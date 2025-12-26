<?php

namespace App\Http\Controllers\Api\TEF;

use App\Http\Controllers\Controller;
use App\Services\TEF\ActorService;
use App\Models\Actor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ActorController extends Controller
{
    public function __construct(
        private ActorService $actorService
    ) {}

    /**
     * Register a new actor
     * POST /api/tef/v1/actors
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'actor_type' => 'required|in:HUMAN,AI_AGENT,TEAM,IOT_DEVICE,IOT_GATEWAY',
            'display_name' => 'required|string|max:255',
            'capabilities' => 'nullable|array',
            'contact_methods' => 'nullable|array',
            'metadata' => 'nullable|array',
            'authentication' => 'nullable|array',
            'organization_id' => 'nullable|uuid',
            'user_id' => 'nullable|uuid|exists:users,id',
        ]);

        try {
            $result = $this->actorService->registerActor($validated);
            return response()->json($result, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to register actor',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get actor details
     * GET /api/tef/v1/actors/{id}
     */
    public function show(string $id): JsonResponse
    {
        $actor = $this->actorService->getActor($id);

        if (!$actor) {
            return response()->json(['error' => 'Actor not found'], 404);
        }

        return response()->json($actor);
    }

    /**
     * Update actor
     * PUT /api/tef/v1/actors/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'display_name' => 'sometimes|string|max:255',
            'capabilities' => 'nullable|array',
            'contact_methods' => 'nullable|array',
            'metadata' => 'nullable|array',
            'authentication' => 'nullable|array',
        ]);

        try {
            $actor = $this->actorService->updateActor($id, $validated);
            return response()->json($actor);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update actor',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Deactivate actor
     * DELETE /api/tef/v1/actors/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->actorService->deactivateActor($id);
            return response()->json(['message' => 'Actor deactivated'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to deactivate actor',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Claim an actor using claim code
     * POST /api/tef/v1/actors/claim
     */
    public function claim(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'claim_code' => 'required|string',
            'claimant_id' => 'required|uuid|exists:users,id',
            'display_name' => 'nullable|string|max:255',
        ]);

        try {
            $result = $this->actorService->claimActor(
                $validated['claim_code'],
                $validated['claimant_id'],
                $validated['display_name'] ?? null
            );
            return response()->json($result, 200);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to claim actor',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get actor capabilities
     * GET /api/tef/v1/actors/{id}/capabilities
     */
    public function capabilities(string $id): JsonResponse
    {
        $capabilities = $this->actorService->getActorCapabilities($id);
        return response()->json(['capabilities' => $capabilities]);
    }

    /**
     * Validate actor authentication
     * POST /api/tef/v1/actors/{id}/authenticate
     */
    public function authenticate(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'credentials' => 'required|array',
        ]);

        $isValid = $this->actorService->validateActorAuthentication($id, $validated['credentials']);

        return response()->json([
            'authenticated' => $isValid,
        ], $isValid ? 200 : 401);
    }
}

