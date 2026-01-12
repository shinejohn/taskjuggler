<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Services\ContextPacketService;
use App\Modules\Coordinator\Services\AiAgentAuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Context Packet Controller
 * Implements Protocol Part 2: Context Packet Delivery
 */
class ContextPacketController extends Controller
{
    public function __construct(
        private ContextPacketService $contextService,
        private AiAgentAuthService $authService
    ) {}

    /**
     * Get context packet
     * GET /internal/ai/context/{business_id}
     */
    public function getContext(Request $request, string $businessId): JsonResponse
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

        // Check permissions
        if (!$session->hasPermission('read_profile')) {
            return response()->json(['error' => 'Insufficient permissions'], 403);
        }

        $agentId = $request->header('X-Agent-Id');
        $cachedVersion = $request->header('X-Cached-Version');

        try {
            $result = $this->contextService->getContextPacket(
                $businessId,
                $agentId,
                $cachedVersion
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Force refresh context packet
     * GET /internal/ai/context/{business_id}/refresh
     */
    public function refreshContext(Request $request, string $businessId): JsonResponse
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

        $agentId = $request->header('X-Agent-Id');

        try {
            $result = $this->contextService->getContextPacket(
                $businessId,
                $agentId,
                null // Force refresh by not providing cached version
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}




