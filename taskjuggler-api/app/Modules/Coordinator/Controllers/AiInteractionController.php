<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Services\LearningService;
use App\Modules\Coordinator\Services\AiAgentAuthService;
use App\Modules\Coordinator\Models\AiInteraction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * AI Interaction Controller
 * Implements Protocol Part 3.5 & Part 4: Interaction Logging & Learning
 */
class AiInteractionController extends Controller
{
    public function __construct(
        private LearningService $learningService,
        private AiAgentAuthService $authService
    ) {}

    /**
     * Log interaction
     * POST /internal/ai/interactions/{business_id}
     */
    public function logInteraction(Request $request, string $businessId): JsonResponse
    {
        // Validate session
        $sessionToken = $request->header('Authorization');
        if (!$sessionToken) {
            return response()->json(['error' => 'Missing authorization'], 401);
        }

        $sessionToken = str_replace('Bearer ', '', $sessionToken);
        $session = $this->authService->validateSession($sessionToken);
        
        if (!$session) {
            return response()->json(['error' => 'Invalid session'], 401);
        }

        if (!$session->hasPermission('log_interaction')) {
            return response()->json(['error' => 'Insufficient permissions'], 403);
        }

        $validated = $request->validate([
            'interaction_id' => 'required|string',
            'channel' => 'required|string|in:phone,chat,sms,email',
            'started_at' => 'required|date',
            'ended_at' => 'nullable|date',
            'duration_seconds' => 'nullable|integer',
            'customer_identified' => 'nullable|boolean',
            'customer_info' => 'nullable|array',
            'intent' => 'nullable|array',
            'outcome' => 'nullable|array',
            'conversation_summary' => 'nullable|string',
            'transcript_reference' => 'nullable|string',
            'sentiment' => 'nullable|array',
            'faqs_used' => 'nullable|array',
            'unknown_questions' => 'nullable|array',
            'agent_version' => 'nullable|string',
        ]);

        $validated['organization_id'] = $businessId;
        $validated['agent_id'] = $session->agent_id;
        $validated['session_id'] = $session->id;
        $validated['contact_id'] = $validated['customer_info']['id'] ?? null;

        $interaction = $this->learningService->logInteraction($validated);

        return response()->json([
            'logged' => true,
            'interaction_id' => $interaction->interaction_id,
        ], 201);
    }

    /**
     * Log feedback
     * POST /internal/ai/interactions/{interaction_id}/feedback
     */
    public function logFeedback(Request $request, string $interactionId): JsonResponse
    {
        $interaction = AiInteraction::where('interaction_id', $interactionId)->firstOrFail();

        $validated = $request->validate([
            'feedback_type' => 'required|string|in:customer_satisfaction,business_review',
            'rating' => 'nullable|integer|min:1|max:5',
            'source' => 'nullable|string',
            'comments' => 'nullable|string',
        ]);

        $interaction->feedback()->create([
            'organization_id' => $interaction->organization_id,
            ...$validated,
        ]);

        return response()->json(['logged' => true]);
    }
}




