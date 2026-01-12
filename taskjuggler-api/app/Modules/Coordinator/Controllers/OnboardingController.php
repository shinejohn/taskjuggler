<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Coordinator;
use App\Modules\Coordinator\Models\RoleTemplate;
use App\Modules\Coordinator\Models\PersonaTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OnboardingController extends Controller
{
    /**
     * Complete onboarding and create coordinator
     * POST /api/coordinator/onboarding/complete
     */
    public function complete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization' => 'required|array',
            'organization.name' => 'required|string|max:255',
            'organization.industry' => 'required|string',
            'organization.phone' => 'nullable|string',
            'organization.email' => 'nullable|email',
            'organization.address' => 'nullable|string',
            'organization.city' => 'nullable|string',
            'organization.state' => 'nullable|string',
            'organization.postal_code' => 'nullable|string',
            'organization.country' => 'nullable|string|default:US',
            'organization.timezone' => 'nullable|string|default:America/New_York',
            'organization.business_hours' => 'nullable|array',
            
            'role_template_id' => 'required|uuid|exists:coord_role_templates,id',
            'persona_template_id' => 'required|uuid|exists:coord_persona_templates,id',
            
            'coordinator' => 'nullable|array',
            'coordinator.display_name' => 'nullable|string|max:255',
            'coordinator.custom_greeting' => 'nullable|string',
            'coordinator.custom_prompts' => 'nullable|array',
            
            'business_info' => 'nullable|array',
            'business_info.services' => 'nullable|array',
            'business_info.description' => 'nullable|string',
        ]);

        $user = $request->user();

        // Create or update organization
        $organization = Organization::updateOrCreate(
            [
                'user_id' => $user->id,
                'slug' => \Illuminate\Support\Str::slug($validated['organization']['name']),
            ],
            [
                'name' => $validated['organization']['name'],
                'industry' => $validated['organization']['industry'],
                'phone' => $validated['organization']['phone'] ?? null,
                'email' => $validated['organization']['email'] ?? null,
                'address' => $validated['organization']['address'] ?? null,
                'city' => $validated['organization']['city'] ?? null,
                'state' => $validated['organization']['state'] ?? null,
                'postal_code' => $validated['organization']['postal_code'] ?? null,
                'country' => $validated['organization']['country'] ?? 'US',
                'timezone' => $validated['organization']['timezone'] ?? 'America/New_York',
                'business_hours' => $validated['organization']['business_hours'] ?? null,
                'status' => 'active',
            ]
        );

        // Get role and persona templates
        $roleTemplate = RoleTemplate::findOrFail($validated['role_template_id']);
        $personaTemplate = PersonaTemplate::findOrFail($validated['persona_template_id']);

        // Create coordinator
        $coordinator = Coordinator::create([
            'organization_id' => $organization->id,
            'role_template_id' => $validated['role_template_id'],
            'persona_template_id' => $validated['persona_template_id'],
            'display_name' => $validated['coordinator']['display_name'] ?? $roleTemplate->name,
            'custom_greeting' => $validated['coordinator']['custom_greeting'] ?? null,
            'custom_prompts' => $validated['coordinator']['custom_prompts'] ?? null,
            'status' => 'active',
            'monthly_price' => $roleTemplate->base_price ?? 0,
            'activated_at' => now(),
        ]);

        // Save business information if provided (using key-value structure)
        if (isset($validated['business_info'])) {
            $businessInfoTable = 'coord_business_information';
            
            // Save services
            if (!empty($validated['business_info']['services'])) {
                DB::table($businessInfoTable)->updateOrInsert(
                    [
                        'organization_id' => $organization->id,
                        'key' => 'services_offered',
                    ],
                    [
                        'id' => \Illuminate\Support\Str::uuid(),
                        'category' => 'services',
                        'value' => json_encode($validated['business_info']['services']),
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
            
            // Save description
            if (!empty($validated['business_info']['description'])) {
                DB::table($businessInfoTable)->updateOrInsert(
                    [
                        'organization_id' => $organization->id,
                        'key' => 'description',
                    ],
                    [
                        'id' => \Illuminate\Support\Str::uuid(),
                        'category' => 'general',
                        'value' => $validated['business_info']['description'],
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        return response()->json([
            'organization' => $organization->load(['coordinators']),
            'coordinator' => $coordinator->load(['roleTemplate', 'personaTemplate']),
            'message' => 'Onboarding completed successfully',
        ], 201);
    }

    /**
     * Get available role templates
     * GET /api/coordinator/onboarding/role-templates
     */
    public function getRoleTemplates(): JsonResponse
    {
        $templates = RoleTemplate::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return response()->json($templates);
    }

    /**
     * Get available persona templates
     * GET /api/coordinator/onboarding/persona-templates
     */
    public function getPersonaTemplates(): JsonResponse
    {
        $templates = PersonaTemplate::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return response()->json($templates);
    }
}

