<?php

namespace App\Modules\Doctors\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Doctors\Services\DocConnectService;
use App\Modules\Doctors\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DocConnectController extends Controller
{
    public function __construct(
        private DocConnectService $docConnectService
    ) {}

    /**
     * Get professional collaboration feed
     */
    public function getFeed(Request $request): JsonResponse
    {
        $user = $request->user();
        $provider = Provider::where('user_id', $user->id)->first();
        
        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 403);
        }

        $feed = $this->docConnectService->getFeed($provider->organization_id, $request->all());
        return response()->json($feed);
    }

    /**
     * Create a new clinical post
     */
    public function createPost(Request $request): JsonResponse
    {
        $request->validate([
            'content' => 'required|string',
            'visibility' => 'nullable|in:public,network,private',
            'attachments' => 'nullable|array',
        ]);

        $user = $request->user();
        $provider = Provider::where('user_id', $user->id)->first();

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 403);
        }

        $post = $this->docConnectService->createPost([
            'provider_id' => $provider->id,
            'organization_id' => $provider->organization_id,
            'content' => $request->get('content'),
            'visibility' => $request->get('visibility') ?? 'public',
            'attachments' => $request->get('attachments'),
        ]);

        return response()->json($post, 201);
    }

    /**
     * Create a new referral
     */
    public function createReferral(Request $request): JsonResponse
    {
        $request->validate([
            'patient_id' => 'required|exists:doctors_patients,id',
            'specialty' => 'required|string',
            'reason' => 'required|string',
            'urgency' => 'nullable|in:routine,urgent,stat',
            'requires_prior_auth' => 'nullable|boolean',
            'prior_auth_type' => 'nullable|string',
            'receiving_provider_id' => 'nullable|exists:doctors_providers,id',
        ]);

        $user = $request->user();
        $provider = Provider::where('user_id', $user->id)->first();

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 403);
        }

        $referral = $this->docConnectService->createReferral([
            'referring_provider_id' => $provider->id,
            'referring_org_id' => $provider->organization_id,
            'patient_id' => $request->patient_id,
            'specialty' => $request->specialty,
            'reason' => $request->reason,
            'urgency' => $request->urgency,
            'requires_prior_auth' => $request->requires_prior_auth,
            'prior_auth_type' => $request->prior_auth_type,
            'receiving_provider_id' => $request->receiving_provider_id,
        ]);

        return response()->json($referral, 201);
    }

    /**
     * Get online peers for real-time consultation
     */
    public function getOnlinePeers(Request $request): JsonResponse
    {
        $user = $request->user();
        $provider = Provider::where('user_id', $user->id)->first();
        
        $peers = $this->docConnectService->getOnlinePeers($provider ? $provider->id : null);
        return response()->json($peers);
    }

    /**
     * Update professional profile status
     */
    public function updateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:on,off,busy,away',
        ]);

        $user = $request->user();
        $provider = Provider::where('user_id', $user->id)->first();

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 403);
        }

        DB::table('docconnect_online_status')->updateOrInsert(
            ['provider_id' => $provider->id],
            [
                'status' => $request->status,
                'last_seen_at' => now(),
            ]
        );

        return response()->json(['status' => $request->status]);
    }

    /**
     * Search provider directory
     */
    public function searchDirectory(Request $request): JsonResponse
    {
        $filters = $request->only(['query', 'specialty', 'location', 'insurance']);
        
        $results = $this->docConnectService->searchDirectory($filters);
        
        return response()->json($results);
    }
}
