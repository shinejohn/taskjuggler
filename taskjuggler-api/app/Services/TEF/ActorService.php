<?php

namespace App\Services\TEF;

use App\Models\Actor;
use App\Models\ClaimCode;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ActorService
{
    /**
     * Register a new actor
     */
    public function registerActor(array $data): array
    {
        $actorId = Str::uuid()->toString();
        $claimCode = null;
        $status = Actor::STATUS_ACTIVE;
        
        // Generate claim code for actors that need claiming
        if (in_array($data['actor_type'], [Actor::TYPE_IOT_DEVICE, Actor::TYPE_AI_AGENT])) {
            $claimCode = $this->generateClaimCode();
            $status = Actor::STATUS_PENDING_CLAIM;
        }
        
        $actor = Actor::create([
            'id' => $actorId,
            'actor_type' => $data['actor_type'],
            'display_name' => $data['display_name'],
            'capabilities' => $data['capabilities'] ?? [],
            'contact_methods' => $data['contact_methods'] ?? [],
            'metadata' => $data['metadata'] ?? [],
            'authentication' => $data['authentication'] ?? [],
            'status' => $status,
            'organization_id' => $data['organization_id'] ?? null,
            'user_id' => $data['user_id'] ?? null,
        ]);
        
        // Store claim code if generated
        if ($claimCode) {
            ClaimCode::create([
                'actor_id' => $actorId,
                'code' => $claimCode,
                'expires_at' => now()->addHour(),
            ]);
        }
        
        return [
            'id' => $actorId,
            'actor_id' => $actorId, // Keep for backward compatibility
            'actor_type' => $data['actor_type'],
            'display_name' => $data['display_name'],
            'capabilities' => $data['capabilities'] ?? [],
            'status' => $status,
            'claim_code' => $claimCode,
            'claim_code_expires' => $claimCode ? now()->addHour()->toIso8601String() : null,
            'exchange_contact' => [
                'http_endpoint' => config('app.url') . '/api/tef/v1/actors/' . $actorId,
                'websocket_endpoint' => str_replace('http', 'ws', config('app.url')) . '/tef/' . $actorId,
            ],
        ];
    }

    /**
     * Get actor with relationships
     */
    public function getActor(string $actorId): ?array
    {
        $actor = Actor::find($actorId);
        
        if (!$actor) {
            return null;
        }
        
        $relationships = $actor->relationships();
        
        return [
            'id' => $actor->id,
            'actor_type' => $actor->actor_type,
            'display_name' => $actor->display_name,
            'capabilities' => $actor->capabilities,
            'contact_methods' => $actor->contact_methods,
            'metadata' => $actor->metadata,
            'status' => $actor->status,
            'organization_id' => $actor->organization_id,
            'user_id' => $actor->user_id,
            'relationships' => $relationships->map(function ($rel) {
                return [
                    'id' => $rel->id,
                    'actor_a_id' => $rel->actor_a_id,
                    'actor_b_id' => $rel->actor_b_id,
                    'relationship_type' => $rel->relationship_type,
                    'trust_score' => $rel->trust_score,
                    'task_count' => $rel->task_count,
                ];
            }),
        ];
    }

    /**
     * Update actor
     */
    public function updateActor(string $actorId, array $updates): Actor
    {
        $actor = Actor::findOrFail($actorId);
        $actor->update($updates);
        return $actor->fresh();
    }

    /**
     * Deactivate actor
     */
    public function deactivateActor(string $actorId): void
    {
        Actor::where('id', $actorId)->update(['status' => Actor::STATUS_DELETED]);
    }

    /**
     * Get actor capabilities
     */
    public function getActorCapabilities(string $actorId): array
    {
        $actor = Actor::find($actorId);
        return $actor?->capabilities ?? [];
    }

    /**
     * Validate actor authentication
     */
    public function validateActorAuthentication(string $actorId, array $credentials): bool
    {
        $actor = Actor::find($actorId);
        
        if (!$actor) {
            return false;
        }
        
        // Validate based on actor type and auth method
        switch ($actor->actor_type) {
            case Actor::TYPE_HUMAN:
                return $this->validateHumanAuth($actor, $credentials);
            case Actor::TYPE_AI_AGENT:
                return $this->validateAIAgentAuth($actor, $credentials);
            case Actor::TYPE_IOT_DEVICE:
                return $this->validateDeviceAuth($actor, $credentials);
            default:
                return false;
        }
    }

    /**
     * Claim an actor using a claim code
     */
    public function claimActor(string $claimCode, string $claimantId, ?string $displayNameOverride = null): array
    {
        // Find and validate claim code
        $claimRecord = ClaimCode::where('code', $claimCode)->first();
        
        if (!$claimRecord) {
            throw new \InvalidArgumentException('Invalid claim code');
        }
        
        if ($claimRecord->isExpired()) {
            throw new \InvalidArgumentException('Claim code expired');
        }
        
        // Get the actor being claimed
        $actor = Actor::find($claimRecord->actor_id);
        
        if (!$actor || $actor->status !== Actor::STATUS_PENDING_CLAIM) {
            throw new \InvalidArgumentException('Actor not available for claiming');
        }
        
        // Update actor status and display name
        $actor->update([
            'status' => Actor::STATUS_ACTIVE,
            'display_name' => $displayNameOverride ?? $actor->display_name,
            'user_id' => $claimantId, // Link to claiming user if human
        ]);
        
        // Delete claim code
        $claimRecord->delete();
        
        return [
            'actor_id' => $actor->id,
            'status' => Actor::STATUS_ACTIVE,
        ];
    }

    /**
     * Generate claim code
     */
    private function generateClaimCode(): string
    {
        $prefix = 'TJ';
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $code = '';
        
        for ($i = 0; $i < 6; $i++) {
            $code .= $chars[random_int(0, strlen($chars) - 1)];
        }
        
        return $prefix . '-' . $code;
    }

    /**
     * Validate human authentication
     */
    private function validateHumanAuth(Actor $actor, array $credentials): bool
    {
        if (!$actor->user_id) {
            return false;
        }
        
        $user = User::find($actor->user_id);
        
        if (!$user) {
            return false;
        }
        
        // Check if credentials match user
        if (isset($credentials['email']) && $user->email !== $credentials['email']) {
            return false;
        }
        
        // Additional validation could check password, token, etc.
        return true;
    }

    /**
     * Validate AI agent authentication
     */
    private function validateAIAgentAuth(Actor $actor, array $credentials): bool
    {
        $auth = $actor->authentication ?? [];
        
        if (isset($auth['api_key']) && isset($credentials['api_key'])) {
            return hash_equals($auth['api_key'], $credentials['api_key']);
        }
        
        return false;
    }

    /**
     * Validate device authentication
     */
    private function validateDeviceAuth(Actor $actor, array $credentials): bool
    {
        $auth = $actor->authentication ?? [];
        
        if (isset($auth['device_token']) && isset($credentials['device_token'])) {
            return hash_equals($auth['device_token'], $credentials['device_token']);
        }
        
        return false;
    }
}

