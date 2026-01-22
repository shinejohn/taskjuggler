<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WebhookController extends Controller
{
    /**
     * Register webhook for organization
     * POST /api/coordinator/organizations/{orgId}/webhooks
     */
    public function store(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:500',
            'secret' => 'required|string|min:16',
            'events' => 'required|array',
            'events.*' => 'string|in:organization.created,coordinator.created,coordinator.activated,contact.created,contact.updated,appointment.created,appointment.confirmed,appointment.cancelled,call.completed,call.missed,campaign.started,campaign.completed,ai_interaction.logged',
        ]);

        $webhookId = \Illuminate\Support\Str::uuid();
        
        DB::table('coord_webhooks')->insert([
            'id' => $webhookId,
            'organization_id' => $organization->id,
            'name' => $validated['name'],
            'url' => $validated['url'],
            'secret' => $validated['secret'],
            'events' => json_encode($validated['events']),
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $webhook = DB::table('coord_webhooks')->where('id', $webhookId)->first();

        return response()->json([
            'id' => $webhook->id,
            'name' => $webhook->name,
            'url' => $webhook->url,
            'events' => json_decode($webhook->events, true),
            'active' => $webhook->active,
            'created_at' => $webhook->created_at,
        ], 201);
    }

    /**
     * List webhooks for organization
     * GET /api/coordinator/organizations/{orgId}/webhooks
     */
    public function index(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $webhooks = DB::table('coord_webhooks')
            ->where('organization_id', $organization->id)
            ->get()
            ->map(function ($webhook) {
                return [
                    'id' => $webhook->id,
                    'name' => $webhook->name,
                    'url' => $webhook->url,
                    'events' => json_decode($webhook->events, true),
                    'active' => $webhook->active,
                    'created_at' => $webhook->created_at,
                ];
            });

        return response()->json(['data' => $webhooks]);
    }

    /**
     * Update webhook
     * PUT /api/coordinator/organizations/{orgId}/webhooks/{id}
     */
    public function update(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $webhook = DB::table('coord_webhooks')
            ->where('id', $id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'url' => 'sometimes|url|max:500',
            'secret' => 'sometimes|string|min:16',
            'events' => 'sometimes|array',
            'events.*' => 'string|in:organization.created,coordinator.created,coordinator.activated,contact.created,contact.updated,appointment.created,appointment.confirmed,appointment.cancelled,call.completed,call.missed,campaign.started,campaign.completed,ai_interaction.logged',
            'active' => 'sometimes|boolean',
        ]);

        $updateData = ['updated_at' => now()];
        if (isset($validated['name'])) $updateData['name'] = $validated['name'];
        if (isset($validated['url'])) $updateData['url'] = $validated['url'];
        if (isset($validated['secret'])) $updateData['secret'] = $validated['secret'];
        if (isset($validated['events'])) $updateData['events'] = json_encode($validated['events']);
        if (isset($validated['active'])) $updateData['active'] = $validated['active'];

        DB::table('coord_webhooks')
            ->where('id', $id)
            ->update($updateData);

        $updated = DB::table('coord_webhooks')->where('id', $id)->first();

        return response()->json([
            'id' => $updated->id,
            'name' => $updated->name,
            'url' => $updated->url,
            'events' => json_decode($updated->events, true),
            'active' => $updated->active,
        ]);
    }

    /**
     * Delete webhook
     * DELETE /api/coordinator/organizations/{orgId}/webhooks/{id}
     */
    public function destroy(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        DB::table('coord_webhooks')
            ->where('id', $id)
            ->where('organization_id', $organization->id)
            ->delete();

        return response()->json(['message' => 'Webhook deleted']);
    }
}

