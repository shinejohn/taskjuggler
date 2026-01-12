<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Events\ActivityCreated;
use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaIntegration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ActivityController extends Controller
{
    /**
     * Get activities for user
     * GET /api/urpa/activities
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = UrpaActivity::where('user_id', $user->id);

        // Search
        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($request->has('type')) {
            $query->byType($request->query('type'));
        }

        if ($request->has('status')) {
            $query->byStatus($request->query('status'));
        }

        if ($request->has('source')) {
            $query->where('source', $request->query('source'));
        }

        if ($request->has('unread')) {
            $query->unread();
        }

        if ($request->has('starred')) {
            $query->starred();
        }

        // Date range
        if ($request->has('date_from')) {
            $query->where('activity_timestamp', '>=', $request->query('date_from'));
        }

        if ($request->has('date_to')) {
            $query->where('activity_timestamp', '<=', $request->query('date_to'));
        }

        // Pagination
        $perPage = $request->query('per_page', 50);
        $activities = $query->with('contact')
            ->orderBy('activity_timestamp', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $activities->items(),
            'total' => $activities->total(),
            'page' => $activities->currentPage(),
            'per_page' => $activities->perPage(),
        ]);
    }

    /**
     * Get activity by ID
     * GET /api/urpa/activities/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $activity = UrpaActivity::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('contact')
            ->firstOrFail();

        return response()->json($activity);
    }

    /**
     * Create activity
     * POST /api/urpa/activities
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'activity_type' => 'required|string|in:email,text,task,calendar,social,voicemail',
            'source' => 'nullable|string|max:50',
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'raw_content' => 'nullable|array',
            'status' => 'nullable|string|in:pending,urgent,completed,archived',
            'contact_id' => 'nullable|uuid|exists:urpa_contacts,id',
            'external_id' => 'nullable|string|max:255',
            'activity_timestamp' => 'nullable|date',
        ]);

        $activity = UrpaActivity::create([
            'user_id' => $request->user()->id,
            'activity_type' => $validated['activity_type'],
            'source' => $validated['source'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'raw_content' => $validated['raw_content'] ?? null,
            'status' => $validated['status'] ?? 'pending',
            'contact_id' => $validated['contact_id'] ?? null,
            'external_id' => $validated['external_id'] ?? null,
            'activity_timestamp' => $validated['activity_timestamp'] ?? now(),
        ]);

        // Broadcast activity created event
        event(new ActivityCreated($activity));

        return response()->json($activity->load('contact'), 201);
    }

    /**
     * Update activity
     * PUT /api/urpa/activities/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $activity = UrpaActivity::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,urgent,completed,archived',
            'is_read' => 'sometimes|boolean',
            'is_starred' => 'sometimes|boolean',
            'title' => 'sometimes|string|max:500',
            'description' => 'sometimes|string',
        ]);

        $activity->update($validated);

        return response()->json($activity->load('contact'));
    }

    /**
     * Mark activity as read
     * PATCH /api/urpa/activities/{id}/read
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $activity = UrpaActivity::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $activity->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Toggle star on activity
     * PATCH /api/urpa/activities/{id}/star
     */
    public function toggleStar(Request $request, string $id): JsonResponse
    {
        $activity = UrpaActivity::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $activity->toggleStar();

        return response()->json(['success' => true, 'is_starred' => $activity->is_starred]);
    }

    /**
     * Delete activity
     * DELETE /api/urpa/activities/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $activity = UrpaActivity::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $activity->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Sync activities from integrations
     * POST /api/urpa/activities/sync
     */
    public function sync(Request $request): JsonResponse
    {
        $user = $request->user();
        $integrationIds = $request->input('integration_ids', []);

        $integrations = UrpaIntegration::where('user_id', $user->id)
            ->where('status', 'connected');

        if (!empty($integrationIds)) {
            $integrations->whereIn('id', $integrationIds);
        }

        $integrations = $integrations->get();

        // Queue sync jobs for each integration
        $integrationIds = $integrations->pluck('id')->toArray();
        \App\Modules\Urpa\Jobs\SyncActivityJob::dispatch($integrationIds);

        return response()->json([
            'message' => 'Sync started',
            'integrations' => $integrations->count(),
        ]);
    }
}

