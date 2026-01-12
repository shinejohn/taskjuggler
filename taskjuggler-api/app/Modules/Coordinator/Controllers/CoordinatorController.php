<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Coordinator;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CoordinatorController extends Controller
{
    /**
     * Get coordinators for organization
     * GET /api/coordinator/organizations/{orgId}/coordinators
     */
    public function index(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $coordinators = Coordinator::where('organization_id', $organization->id)
            ->with(['roleTemplate', 'personaTemplate', 'aiAgents'])
            ->get();

        return response()->json($coordinators);
    }

    /**
     * Create coordinator
     * POST /api/coordinator/organizations/{orgId}/coordinators
     */
    public function store(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'role_template_id' => 'required|uuid|exists:coord_role_templates,id',
            'persona_template_id' => 'required|uuid|exists:coord_persona_templates,id',
            'display_name' => 'nullable|string',
            'voice_id' => 'nullable|string',
            'custom_greeting' => 'nullable|string',
            'custom_prompts' => 'nullable|array',
            'custom_scripts' => 'nullable|array',
            'availability' => 'nullable|array',
        ]);

        $validated['organization_id'] = $organization->id;
        $validated['status'] = 'active';
        $validated['activated_at'] = now();

        // Get base price from role template
        $roleTemplate = \App\Modules\Coordinator\Models\RoleTemplate::findOrFail($validated['role_template_id']);
        $validated['monthly_price'] = $roleTemplate->base_price;

        $coordinator = Coordinator::create($validated);

        return response()->json($coordinator->load(['roleTemplate', 'personaTemplate']), 201);
    }

    /**
     * Get coordinator
     * GET /api/coordinator/coordinators/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $coordinator = Coordinator::where('id', $id)
            ->whereHas('organization', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->with(['roleTemplate', 'personaTemplate', 'aiAgents', 'organization'])
            ->firstOrFail();

        return response()->json($coordinator);
    }

    /**
     * Update coordinator
     * PUT /api/coordinator/coordinators/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $coordinator = Coordinator::where('id', $id)
            ->whereHas('organization', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->firstOrFail();

        $validated = $request->validate([
            'display_name' => 'sometimes|string',
            'voice_id' => 'nullable|string',
            'custom_greeting' => 'nullable|string',
            'custom_prompts' => 'nullable|array',
            'custom_scripts' => 'nullable|array',
            'availability' => 'nullable|array',
            'status' => 'sometimes|string|in:active,paused,inactive',
        ]);

        $coordinator->update($validated);

        return response()->json($coordinator->load(['roleTemplate', 'personaTemplate']));
    }

    /**
     * Delete coordinator
     * DELETE /api/coordinator/coordinators/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $coordinator = Coordinator::where('id', $id)
            ->whereHas('organization', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->firstOrFail();

        $coordinator->delete();

        return response()->json(['message' => 'Coordinator deleted']);
    }
}




