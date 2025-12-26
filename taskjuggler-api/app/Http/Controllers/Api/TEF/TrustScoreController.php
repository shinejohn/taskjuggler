<?php

namespace App\Http\Controllers\Api\TEF;

use App\Http\Controllers\Controller;
use App\Models\Relationship;
use App\Services\TEF\TrustScoringService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Trust Score Controller
 * 
 * Handles trust score management and recommendations
 */
class TrustScoreController extends Controller
{
    public function __construct(
        private TrustScoringService $trustService
    ) {}

    /**
     * Get trust score for relationship
     * GET /api/tef/v1/relationships/{id}/trust-score
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $relationship = Relationship::findOrFail($id);
        
        // Ensure user has access to this relationship
        $this->authorizeRelationship($request->user(), $relationship);

        $trustScore = $relationship->trust_score ?? $this->trustService->calculateTrustScore($relationship);
        $recommendations = $this->trustService->getTrustRecommendations($relationship);

        return response()->json([
            'relationship_id' => $relationship->id,
            'trust_score' => round($trustScore, 2),
            'recommendations' => $recommendations,
            'task_count' => $relationship->task_count ?? 0,
        ]);
    }

    /**
     * Update trust score manually
     * PUT /api/tef/v1/relationships/{id}/trust-score
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'trust_score' => 'required|numeric|min:0|max:100',
        ]);

        $relationship = Relationship::findOrFail($id);
        $this->authorizeRelationship($request->user(), $relationship);

        $relationship->updateTrustScore($request->input('trust_score'));

        return response()->json([
            'message' => 'Trust score updated',
            'trust_score' => $relationship->trust_score,
        ]);
    }

    /**
     * Recalculate trust score
     * POST /api/tef/v1/relationships/{id}/trust-score/recalculate
     */
    public function recalculate(Request $request, string $id): JsonResponse
    {
        $relationship = Relationship::findOrFail($id);
        $this->authorizeRelationship($request->user(), $relationship);

        $this->trustService->updateTrustScore($relationship);

        return response()->json([
            'message' => 'Trust score recalculated',
            'trust_score' => $relationship->fresh()->trust_score,
        ]);
    }

    /**
     * Authorize user access to relationship
     */
    private function authorizeRelationship($user, Relationship $relationship): void
    {
        $userActor = \App\Models\Actor::where('user_id', $user->id)->first();
        
        if (!$userActor) {
            abort(403, 'User actor not found');
        }

        if ($relationship->actor_a_id !== $userActor->id && $relationship->actor_b_id !== $userActor->id) {
            abort(403, 'Unauthorized access to relationship');
        }
    }
}
