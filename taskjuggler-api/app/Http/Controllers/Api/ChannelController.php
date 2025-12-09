<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssistantChannel;
use App\Services\Twilio\VoiceService;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    public function index(Request $request)
    {
        $channels = $request->user()
            ->assistantChannels()
            ->get();

        return response()->json($channels);
    }

    public function provisionPhone(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'nullable|string|max:20',
            'greeting_message' => 'nullable|string',
            'voicemail_greeting' => 'nullable|string',
        ]);

        // TODO: Integrate with Twilio to provision phone number
        // For now, create channel record
        $channel = AssistantChannel::create([
            'user_id' => $request->user()->id,
            'channel_type' => AssistantChannel::TYPE_PHONE,
            'phone_number' => $validated['phone_number'] ?? null,
            'greeting_message' => $validated['greeting_message'] ?? null,
            'voicemail_greeting' => $validated['voicemail_greeting'] ?? null,
            'is_active' => true,
        ]);

        return response()->json($channel, 201);
    }

    public function createEmail(Request $request)
    {
        $validated = $request->validate([
            'email_address' => 'required|email|unique:assistant_channels,email_address',
            'greeting_message' => 'nullable|string',
        ]);

        $channel = AssistantChannel::create([
            'user_id' => $request->user()->id,
            'channel_type' => AssistantChannel::TYPE_EMAIL,
            'email_address' => $validated['email_address'],
            'greeting_message' => $validated['greeting_message'] ?? null,
            'is_active' => true,
        ]);

        return response()->json($channel, 201);
    }

    public function update(Request $request, AssistantChannel $channel)
    {
        $this->authorize('update', $channel);

        $validated = $request->validate([
            'greeting_message' => 'nullable|string',
            'voicemail_greeting' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $channel->update($validated);

        return response()->json($channel);
    }

    public function destroy(AssistantChannel $channel)
    {
        $this->authorize('delete', $channel);
        
        $channel->delete();

        return response()->json(null, 204);
    }
}
