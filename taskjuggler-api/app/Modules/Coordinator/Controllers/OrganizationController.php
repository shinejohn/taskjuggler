<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrganizationController extends Controller
{
    /**
     * Get user's organizations
     * GET /api/coordinator/organizations
     */
    public function index(Request $request): JsonResponse
    {
        $organizations = Organization::where('user_id', $request->user()->id)
            ->with(['coordinators', 'members'])
            ->get();

        return response()->json($organizations);
    }

    /**
     * Create organization
     * POST /api/coordinator/organizations
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'industry' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'country' => 'nullable|string|default:US',
            'timezone' => 'nullable|string|default:America/New_York',
            'business_hours' => 'nullable|array',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        $organization = Organization::create($validated);

        return response()->json($organization, 201);
    }

    /**
     * Get organization
     * GET /api/coordinator/organizations/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $organization = Organization::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with(['coordinators', 'members', 'contacts'])
            ->firstOrFail();

        return response()->json($organization);
    }

    /**
     * Update organization
     * PUT /api/coordinator/organizations/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $organization = Organization::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'industry' => 'sometimes|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'business_hours' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        $organization->update($validated);

        return response()->json($organization);
    }
}




