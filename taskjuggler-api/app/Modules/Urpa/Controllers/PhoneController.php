<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Events\PhoneCallStatusChanged;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PhoneController extends Controller
{
    /**
     * Get phone calls for user
     * GET /api/urpa/phone/calls
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = UrpaPhoneCall::where('user_id', $user->id);

        if ($request->has('direction')) {
            $query->where('direction', $request->query('direction'));
        }

        if ($request->has('status')) {
            $query->byStatus($request->query('status'));
        }

        if ($request->has('handled_by_ai')) {
            $query->where('handled_by_ai', $request->boolean('handled_by_ai'));
        }

        if ($request->has('contact_id')) {
            $query->where('contact_id', $request->query('contact_id'));
        }

        $perPage = $request->query('per_page', 20);
        $calls = $query->with('contact')
            ->orderBy('started_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $calls->items(),
            'total' => $calls->total(),
            'page' => $calls->currentPage(),
            'per_page' => $calls->perPage(),
        ]);
    }

    /**
     * Get call by ID
     * GET /api/urpa/phone/calls/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $call = UrpaPhoneCall::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('contact')
            ->firstOrFail();

        return response()->json($call);
    }

    /**
     * Create call record
     * POST /api/urpa/phone/calls
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'direction' => 'required|string|in:inbound,outbound',
            'caller_number' => 'nullable|string|max:50',
            'callee_number' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:ringing,in_progress,completed,missed,voicemail',
            'handled_by_ai' => 'sometimes|boolean',
            'ai_persona_used' => 'nullable|string|max:20',
            'vapi_call_id' => 'nullable|string|max:100',
            'vapi_assistant_id' => 'nullable|string|max:100',
            'contact_id' => 'nullable|uuid|exists:urpa_contacts,id',
            'started_at' => 'nullable|date',
        ]);

        $call = UrpaPhoneCall::create([
            'user_id' => $request->user()->id,
            'direction' => $validated['direction'],
            'caller_number' => $validated['caller_number'] ?? null,
            'callee_number' => $validated['callee_number'] ?? null,
            'status' => $validated['status'] ?? 'ringing',
            'handled_by_ai' => $validated['handled_by_ai'] ?? false,
            'ai_persona_used' => $validated['ai_persona_used'] ?? null,
            'vapi_call_id' => $validated['vapi_call_id'] ?? null,
            'vapi_assistant_id' => $validated['vapi_assistant_id'] ?? null,
            'contact_id' => $validated['contact_id'] ?? null,
            'started_at' => $validated['started_at'] ?? now(),
        ]);

        return response()->json($call->load('contact'), 201);
    }

    /**
     * Update call
     * PUT /api/urpa/phone/calls/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $call = UrpaPhoneCall::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'sometimes|string|in:ringing,in_progress,completed,missed,voicemail',
            'duration_seconds' => 'sometimes|integer',
            'recording_url' => 'sometimes|url',
            'transcript' => 'sometimes|string',
            'ai_summary' => 'sometimes|string',
            'actions_taken' => 'sometimes|array',
            'ended_at' => 'sometimes|date',
        ]);

        $call->update($validated);

        // Broadcast status change event
        event(new PhoneCallStatusChanged($call));

        return response()->json($call->load('contact'));
    }

    /**
     * Mark call as completed
     * PATCH /api/urpa/phone/calls/{id}/complete
     */
    public function complete(Request $request, string $id): JsonResponse
    {
        $call = UrpaPhoneCall::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'duration_seconds' => 'required|integer',
        ]);

        $call->markAsCompleted($validated['duration_seconds']);

        // Broadcast status change event
        event(new PhoneCallStatusChanged($call));

        return response()->json($call->load('contact'));
    }
}

