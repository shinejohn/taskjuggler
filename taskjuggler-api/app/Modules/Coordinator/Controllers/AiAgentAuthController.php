<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Services\AiAgentAuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * AI Agent Authentication Controller
 * Implements Protocol Part 1: Authentication & Authorization
 */
class AiAgentAuthController extends Controller
{
    public function __construct(
        private AiAgentAuthService $authService
    ) {}

    /**
     * Authenticate AI agent
     * POST /internal/ai/auth
     */
    public function authenticate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'agent_id' => 'required|string',
            'agent_secret' => 'required|string',
            'business_id' => 'required|string',
            'session_type' => 'sometimes|string|in:customer_interaction,admin',
        ]);

        try {
            $result = $this->authService->authenticate(
                $validated['agent_id'],
                $validated['agent_secret'],
                $validated['business_id'],
                $validated['session_type'] ?? 'customer_interaction'
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 401);
        }
    }

    /**
     * Refresh session token
     * POST /internal/ai/auth/refresh
     */
    public function refresh(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_token' => 'required|string',
        ]);

        try {
            $result = $this->authService->refreshSession($validated['session_token']);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 401);
        }
    }
}




