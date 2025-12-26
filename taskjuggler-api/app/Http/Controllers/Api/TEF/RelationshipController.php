<?php

namespace App\Http\Controllers\Api\TEF;

use App\Http\Controllers\Controller;
use App\Services\TEF\RelationshipService;
use App\Models\Relationship;
use App\Models\Actor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RelationshipController extends Controller
{
    public function __construct(
        private RelationshipService $relationshipService
    ) {}

    /**
     * Create a relationship between actors
     * POST /api/tef/v1/relationships
     */
    public function store(Request $request): JsonResponse
    {
        // Get current user's actor
        $userActor = Actor::where('user_id', $request->user()->id)
            ->where('actor_type', Actor::TYPE_HUMAN)
            ->first();

        if (!$userActor) {
            return response()->json(['error' => 'User actor not found'], 404);
        }

        $validated = $request->validate([
            'actor_b_id' => ['required', 'string', 'exists:actors,id'],
            'relationship_type' => 'required|in:OWNER,PEER,DELEGATE,WATCHER,VENDOR',
            'permissions' => 'nullable|array',
            'established_via' => 'nullable|in:CLAIM_CODE,INVITATION,ORGANIZATION,API',
            'expires_at' => 'nullable|date',
        ]);

        try {
            $relationship = $this->relationshipService->createRelationship(
                $userActor->id, // actor_a_id is current user's actor
                $validated['actor_b_id'],
                $validated['relationship_type'],
                $validated['permissions'] ?? [],
                $validated['established_via'] ?? Relationship::VIA_API
            );

            if (isset($validated['expires_at'])) {
                $relationship->update(['expires_at' => $validated['expires_at']]);
            }

            return response()->json($relationship, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create relationship',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * List relationships for an actor
     * GET /api/tef/v1/relationships?actor_id={id}
     */
    public function index(Request $request): JsonResponse
    {
        $actorId = $request->input('actor_id');

        if (!$actorId) {
            return response()->json(['error' => 'actor_id parameter is required'], 400);
        }

        $relationships = Relationship::where('actor_a_id', $actorId)
            ->orWhere('actor_b_id', $actorId)
            ->with(['actorA', 'actorB'])
            ->get()
            ->map(function ($rel) {
                return [
                    'id' => $rel->id,
                    'actor_a' => [
                        'id' => $rel->actorA->id,
                        'display_name' => $rel->actorA->display_name,
                        'actor_type' => $rel->actorA->actor_type,
                    ],
                    'actor_b' => [
                        'id' => $rel->actorB->id,
                        'display_name' => $rel->actorB->display_name,
                        'actor_type' => $rel->actorB->actor_type,
                    ],
                    'relationship_type' => $rel->relationship_type,
                    'trust_score' => $rel->trust_score,
                    'task_count' => $rel->task_count,
                    'expires_at' => $rel->expires_at?->toIso8601String(),
                    'created_at' => $rel->created_at->toIso8601String(),
                ];
            });

        return response()->json(['relationships' => $relationships]);
    }

    /**
     * Get relationship details
     * GET /api/tef/v1/relationships/{id}
     */
    public function show(string $id): JsonResponse
    {
        $relationship = Relationship::with(['actorA', 'actorB'])->find($id);

        if (!$relationship) {
            return response()->json(['error' => 'Relationship not found'], 404);
        }

        return response()->json([
            'id' => $relationship->id,
            'actor_a' => [
                'id' => $relationship->actorA->id,
                'display_name' => $relationship->actorA->display_name,
                'actor_type' => $relationship->actorA->actor_type,
            ],
            'actor_b' => [
                'id' => $relationship->actorB->id,
                'display_name' => $relationship->actorB->display_name,
                'actor_type' => $relationship->actorB->actor_type,
            ],
            'relationship_type' => $relationship->relationship_type,
            'permissions' => $relationship->permissions,
            'trust_score' => $relationship->trust_score,
            'task_count' => $relationship->task_count,
            'expires_at' => $relationship->expires_at?->toIso8601String(),
            'created_at' => $relationship->created_at->toIso8601String(),
        ]);
    }

    /**
     * Update relationship
     * PUT /api/tef/v1/relationships/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'permissions' => 'nullable|array',
            'expires_at' => 'nullable|date',
        ]);

        $relationship = Relationship::findOrFail($id);
        $relationship->update($validated);

        return response()->json($relationship);
    }

    /**
     * Delete relationship
     * DELETE /api/tef/v1/relationships/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $relationship = Relationship::findOrFail($id);
        $relationship->delete();

        return response()->json(['message' => 'Relationship deleted'], 200);
    }

    /**
     * Get relationship history
     * GET /api/tef/v1/relationships/{id}/history
     */
    public function history(string $id): JsonResponse
    {
        $relationship = Relationship::findOrFail($id);
        $history = $relationship->history()
            ->with(['task'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($h) {
                return [
                    'id' => $h->id,
                    'event_type' => $h->event_type,
                    'outcome' => $h->outcome,
                    'response_time_ms' => $h->response_time_ms,
                    'completion_time_ms' => $h->completion_time_ms,
                    'task_id' => $h->task_id,
                    'task_title' => $h->task?->title,
                    'metadata' => $h->metadata,
                    'created_at' => $h->created_at->toIso8601String(),
                ];
            });

        return response()->json(['history' => $history]);
    }
}

