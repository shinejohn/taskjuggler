<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Campaign;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Services\CampaignService;
use App\Modules\Coordinator\Services\WebhookService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CampaignController extends Controller
{
    /**
     * Get campaigns for organization
     * GET /api/coordinator/organizations/{orgId}/campaigns
     */
    public function index(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $query = Campaign::where('organization_id', $organization->id)
            ->with(['coordinator']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->query('type'));
        }

        $campaigns = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'data' => $campaigns->items(),
            'total' => $campaigns->total(),
            'per_page' => $campaigns->perPage(),
            'current_page' => $campaigns->currentPage(),
            'last_page' => $campaigns->lastPage(),
        ]);
    }

    /**
     * Create campaign
     * POST /api/coordinator/organizations/{orgId}/campaigns
     */
    public function store(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'description' => 'nullable|string',
            'coordinator_id' => 'nullable|uuid|exists:coord_coordinators,id',
            'target_contacts' => 'nullable|array',
            'target_count' => 'nullable|integer|min:1',
            'script' => 'nullable|array',
            'filters' => 'nullable|array',
            'scheduled_start_at' => 'nullable|date',
            'scheduled_end_at' => 'nullable|date|after:scheduled_start_at',
            'schedule_rules' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        $validated['organization_id'] = $organization->id;
        $validated['status'] = 'draft';

        $campaign = Campaign::create($validated);

        return response()->json($campaign->load(['coordinator']), 201);
    }

    /**
     * Get campaign
     * GET /api/coordinator/organizations/{orgId}/campaigns/{id}
     */
    public function show(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $campaign = Campaign::where('id', $id)
            ->where('organization_id', $organization->id)
            ->with(['coordinator', 'organization'])
            ->firstOrFail();

        return response()->json($campaign);
    }

    /**
     * Update campaign
     * PUT /api/coordinator/organizations/{orgId}/campaigns/{id}
     */
    public function update(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $campaign = Campaign::where('id', $id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string',
            'description' => 'nullable|string',
            'coordinator_id' => 'nullable|uuid|exists:coord_coordinators,id',
            'target_contacts' => 'nullable|array',
            'target_count' => 'nullable|integer|min:1',
            'script' => 'nullable|array',
            'filters' => 'nullable|array',
            'scheduled_start_at' => 'nullable|date',
            'scheduled_end_at' => 'nullable|date|after:scheduled_start_at',
            'schedule_rules' => 'nullable|array',
            'settings' => 'nullable|array',
            'status' => 'sometimes|string|in:draft,scheduled,running,paused,completed,cancelled',
        ]);

        $campaign->update($validated);

        return response()->json($campaign->load(['coordinator']));
    }

    /**
     * Delete campaign
     * DELETE /api/coordinator/organizations/{orgId}/campaigns/{id}
     */
    public function destroy(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $campaign = Campaign::where('id', $id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        $campaign->delete();

        return response()->json(['message' => 'Campaign deleted']);
    }

    /**
     * Start campaign
     * POST /api/coordinator/organizations/{orgId}/campaigns/{id}/start
     */
    public function start(Request $request, string $orgId, string $id): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $campaign = Campaign::where('id', $id)
                ->where('organization_id', $organization->id)
                ->firstOrFail();

            if (!in_array($campaign->status, ['draft', 'scheduled', 'paused'])) {
                return response()->json(['message' => 'Campaign cannot be started from current status'], 400);
            }

            $campaignService = app(\App\Modules\Coordinator\Services\CampaignService::class);
            
            if ($campaign->status === 'scheduled' && $campaign->scheduled_start_at && $campaign->scheduled_start_at->isFuture()) {
                // Keep as scheduled, will start automatically
                return response()->json($campaign->load(['coordinator']));
            }

            $campaign->start();
            $campaign->refresh();
            
            // Dispatch webhook
            app(WebhookService::class)->dispatch('campaign.started', [
                'id' => $campaign->id,
                'name' => $campaign->name,
                'status' => $campaign->status,
                'type' => $campaign->type,
            ], $organization->id);
            
            // Dispatch job to execute campaign (would be async in production)
            // dispatch(new ExecuteCampaignJob($campaign));

            return response()->json($campaign->load(['coordinator']));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Campaign not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Failed to start campaign: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to start campaign'], 500);
        }
    }

    /**
     * Pause campaign
     * POST /api/coordinator/organizations/{orgId}/campaigns/{id}/pause
     */
    public function pause(Request $request, string $orgId, string $id): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $campaign = Campaign::where('id', $id)
                ->where('organization_id', $organization->id)
                ->firstOrFail();

            if ($campaign->status !== 'running') {
                return response()->json(['message' => 'Campaign is not running'], 400);
            }

            $campaign->pause();

            return response()->json($campaign->load(['coordinator']));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Campaign not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Failed to pause campaign: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to pause campaign'], 500);
        }
    }

    /**
     * Get campaign statistics
     * GET /api/coordinator/organizations/{orgId}/campaigns/{id}/stats
     */
    public function getStats(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $campaign = Campaign::where('id', $id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        return response()->json([
            'contacts_processed' => $campaign->contacts_processed,
            'contacts_contacted' => $campaign->contacts_contacted,
            'contacts_answered' => $campaign->contacts_answered,
            'appointments_booked' => $campaign->appointments_booked,
            'appointments_confirmed' => $campaign->appointments_confirmed,
            'appointments_rescheduled' => $campaign->appointments_rescheduled,
            'answer_rate' => $campaign->answer_rate,
            'booking_rate' => $campaign->booking_rate,
            'confirmation_rate' => $campaign->confirmation_rate,
        ]);
    }
}

