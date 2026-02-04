<?php

namespace App\Modules\Doctors\Services;

use App\Modules\Doctors\Models\DocConnectPost;
use App\Modules\Doctors\Models\DocConnectReferral;
use App\Modules\Doctors\Models\DocConnectProfile;
use App\Modules\Doctors\Models\Provider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DocConnectService
{
    /**
     * Get the collaboration feed
     */
    public function getFeed(string $organizationId, array $filters = [])
    {
        $query = DocConnectPost::with(['provider.user', 'attachments', 'comments.provider.user'])
            ->where(function ($q) use ($organizationId) {
                $q->where('visibility', 'public')
                  ->orWhere('organization_id', $organizationId);
            });

        if (isset($filters['specialty'])) {
            $query->whereHas('provider', function ($q) use ($filters) {
                $q->where('specialty', $filters['specialty']);
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Create a new clinical post
     */
    public function createPost(array $data): DocConnectPost
    {
        return DB::transaction(function () use ($data) {
            $post = DocConnectPost::create([
                'provider_id' => $data['provider_id'],
                'organization_id' => $data['organization_id'],
                'content' => $data['content'],
                'visibility' => $data['visibility'] ?? 'public',
            ]);

            if (!empty($data['attachments'])) {
                foreach ($data['attachments'] as $attachment) {
                    $post->attachments()->create($attachment);
                }
            }

            return $post;
        });
    }

    /**
     * Create a new referral and optionally trigger Prior Auth
     */
    public function createReferral(array $data): DocConnectReferral
    {
        return DB::transaction(function () use ($data) {
            $referral = DocConnectReferral::create([
                'sending_provider_id' => $data['referring_provider_id'],
                'receiving_provider_id' => $data['receiving_provider_id'] ?? null,
                'patient_id' => $data['patient_id'],
                'specialty_requested' => $data['specialty'],
                'clinical_reason' => $data['reason'],
                'urgency' => $data['urgency'] ?? 'routine',
                'requires_prior_auth' => $data['requires_prior_auth'] ?? false,
                'prior_auth_type' => $data['prior_auth_type'] ?? null,
                'status' => 'sent',
            ]);

            // Phase 2: AI Auto-Prior Auth Integration
            if (!empty($data['requires_prior_auth'])) {
                $this->triggerAutoPriorAuth($referral, $data['prior_auth_type'] ?? 'General');
            }

            return $referral;
        });
    }

    /**
     * Simulate automatic Prior Auth generation from referral data
     */
    private function triggerAutoPriorAuth(DocConnectReferral $referral, string $type): void
    {
        // In a real implementation, this would call the PriorAuthService
        // or dispatch a job. For now, we simulate the logic.
        
        $authId = 'AUTH-' . strtoupper(Str::random(6));
        
        // Log the creation (simulated)
        // Note: In production we would use the real HIPAA audit logger
        
        // Update referral with PA info
        $referral->update([
            'prior_auth_id' => $authId
        ]);
    }

    /**
     * Get online peers
     */
    public function getOnlinePeers(?string $excludeProviderId = null)
    {
        $query = Provider::with(['user', 'onlineStatus'])
            ->whereHas('onlineStatus', function ($q) {
                $q->where('status', '!=', 'off');
            });

        if ($excludeProviderId) {
            $query->where('id', '!=', $excludeProviderId);
        }

        return $query->limit(10)->get();
    }

    /**
     * Search the directory for providers
     */
    public function searchDirectory(array $filters)
    {
        $query = DocConnectProfile::with(['provider.user', 'provider.organization'])
            ->where('is_visible_in_directory', true);

        if (!empty($filters['query'])) {
            $search = $filters['query'];
            $query->whereHas('provider.user', function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            })->orWhereHas('provider', function($q) use ($search) {
                $q->where('specialty', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['specialty'])) {
            $query->whereHas('provider', function($q) use ($filters) {
                $q->where('specialty', $filters['specialty']);
            });
        }

        if (!empty($filters['location'])) {
            $location = $filters['location'];
            $query->whereHas('provider.organization', function($q) use ($location) {
                $q->where('city', 'like', "%{$location}%")
                  ->orWhere('state', 'like', "%{$location}%");
            });
        }
        
        if (!empty($filters['insurance'])) {
            // JSON search for accepted insurances
            // Note: This is a simple implementation, production might need better JSON search
            $query->whereJsonContains('accepted_insurances', $filters['insurance']);
        }

        return $query->paginate(20);
    }
}
