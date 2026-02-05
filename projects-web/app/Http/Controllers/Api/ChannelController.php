<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssistantChannel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $channels = AssistantChannel::where('organization_id', $request->user()->organization_id)
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($channels);
    }

    public function provisionPhone(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone_number' => 'nullable|string|max:20',
            'greeting_message' => 'nullable|string',
            'voicemail_greeting' => 'nullable|string',
        ]);

        $channel = AssistantChannel::create([
            'user_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
            'channel_type' => AssistantChannel::TYPE_PHONE,
            'phone_number' => $validated['phone_number'] ?? null,
            'greeting_message' => $validated['greeting_message'] ?? null,
            'voicemail_greeting' => $validated['voicemail_greeting'] ?? null,
            'is_active' => true,
        ]);

        return response()->json($channel, 201);
    }

    public function createEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email_address' => 'required|email|unique:assistant_channels,email_address',
            'greeting_message' => 'nullable|string',
        ]);

        $channel = AssistantChannel::create([
            'user_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
            'channel_type' => AssistantChannel::TYPE_EMAIL,
            'email_address' => $validated['email_address'],
            'greeting_message' => $validated['greeting_message'] ?? null,
            'is_active' => true,
        ]);

        return response()->json($channel, 201);
    }

    public function update(Request $request, AssistantChannel $channel): JsonResponse
    {
        // Check organization access
        if ($channel->organization_id !== $request->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'greeting_message' => 'nullable|string',
            'voicemail_greeting' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $channel->update($validated);

        return response()->json($channel);
    }

    public function destroy(AssistantChannel $channel): JsonResponse
    {
        // Check organization access
        if ($channel->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $channel->delete();

        return response()->json(null, 204);
    }
}
