<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Models\Actor;
use App\Models\Task;
use App\Services\AI\AiAgentRegistrationService;
use App\Services\AI\DelegationEngine;
use App\Services\AI\McpServerService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * AI Agent Controller
 * 
 * Handles AI agent registration, claiming, and management endpoints
 */
class AgentController extends Controller
{
    public function __construct(
        private AiAgentRegistrationService $registrationService,
        private McpServerService $mcpService,
        private DelegationEngine $delegationEngine
    ) {}

    /**
     * Register a new AI agent
     * POST /api/ai/agents/register
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'agent_id' => 'nullable|uuid',
            'name' => 'required|string|max:255',
            'agent_type' => 'nullable|string|max:100',
            'capabilities' => 'nullable|array',
            'mcp_endpoint' => 'nullable|url',
            'http_endpoint' => 'nullable|url',
            'model' => 'nullable|string|max:100',
            'provider' => 'nullable|string|max:100',
            'version' => 'nullable|string|max:50',
            'api_key' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        try {
            $agentInfo = [
                'agent_id' => $request->input('agent_id'),
                'name' => $request->input('name'),
                'agent_type' => $request->input('agent_type'),
                'capabilities' => $request->input('capabilities', []),
                'mcp_endpoint' => $request->input('mcp_endpoint'),
                'http_endpoint' => $request->input('http_endpoint'),
                'model' => $request->input('model'),
                'provider' => $request->input('provider'),
                'version' => $request->input('version'),
                'api_key' => $request->input('api_key'),
                'metadata' => $request->input('metadata', []),
            ];

            $actor = $this->registrationService->registerAgent($agentInfo, $request->user()?->id);
            $info = $this->registrationService->getAgentRegistrationInfo($actor);

            return response()->json([
                'message' => 'AI agent registered successfully',
                'agent' => $info,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Agent registration failed',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Claim an AI agent with claim code
     * POST /api/ai/agents/claim
     */
    public function claim(Request $request): JsonResponse
    {
        $request->validate([
            'claim_code' => 'required|string|size:8',
        ]);

        try {
            $actor = $this->registrationService->claimAgent(
                $request->input('claim_code'),
                $request->user()
            );

            return response()->json([
                'message' => 'AI agent claimed successfully',
                'agent' => [
                    'actor_id' => $actor->id,
                    'display_name' => $actor->display_name,
                    'status' => $actor->status,
                    'capabilities' => $actor->capabilities,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Agent claiming failed',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * List user's AI agents
     * GET /api/ai/agents
     */
    public function index(Request $request): JsonResponse
    {
        $agents = Actor::where('actor_type', Actor::TYPE_AI_AGENT)
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function ($actor) {
                return $this->registrationService->getAgentRegistrationInfo($actor);
            });

        return response()->json([
            'data' => $agents,
        ]);
    }

    /**
     * Get agent details
     * GET /api/ai/agents/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_AI_AGENT)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $info = $this->registrationService->getAgentRegistrationInfo($actor);

        return response()->json([
            'agent' => $info,
        ]);
    }

    /**
     * Update agent capabilities
     * PUT /api/ai/agents/{id}/capabilities
     */
    public function updateCapabilities(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'capabilities' => 'required|array',
        ]);

        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_AI_AGENT)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->registrationService->updateAgentCapabilities(
            $actor,
            $request->input('capabilities')
        );

        return response()->json([
            'message' => 'Agent capabilities updated',
            'agent' => $this->registrationService->getAgentRegistrationInfo($actor),
        ]);
    }

    /**
     * Generate new claim code for agent
     * POST /api/ai/agents/{id}/claim-code
     */
    public function generateClaimCode(Request $request, string $id): JsonResponse
    {
        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_AI_AGENT)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $claimCode = $this->registrationService->generateClaimCode($actor);

        return response()->json([
            'claim_code' => $claimCode->code,
            'expires_at' => $claimCode->expires_at->toIso8601String(),
        ]);
    }

    /**
     * Delegate task to agent
     * POST /api/ai/agents/{id}/delegate-task
     */
    public function delegateTask(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'task_id' => 'required|uuid|exists:tasks,id',
        ]);

        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_AI_AGENT)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $task = Task::findOrFail($request->input('task_id'));

        $success = $this->delegationEngine->delegateToAgent($task, $actor);

        if ($success) {
            return response()->json([
                'message' => 'Task delegated to agent',
                'task_id' => $task->id,
            ]);
        }

        return response()->json([
            'error' => 'Failed to delegate task to agent',
        ], 500);
    }

    /**
     * Deactivate agent
     * DELETE /api/ai/agents/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_AI_AGENT)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->registrationService->deactivateAgent($actor);

        return response()->json([
            'message' => 'Agent deactivated',
        ]);
    }
}
