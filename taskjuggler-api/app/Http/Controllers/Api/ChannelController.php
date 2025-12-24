<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssistantChannel;
use App\Services\Twilio\VoiceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

        // Provision phone number via Twilio if not provided
        $phoneNumber = $validated['phone_number'] ?? null;
        $twilioSid = null;

        if (!$phoneNumber && config('services.twilio.account_sid')) {
            try {
                $twilio = app(\App\Services\Twilio\VoiceService::class);
                $twilioNumber = $twilio->provisionPhoneNumber($request->user());
                $phoneNumber = $twilioNumber['phone_number'] ?? null;
                $twilioSid = $twilioNumber['sid'] ?? null;
            } catch (\Exception $e) {
                Log::error('Failed to provision Twilio number', ['error' => $e->getMessage()]);
                // Continue with manual phone number if provided
            }
        }

        $channel = AssistantChannel::create([
            'user_id' => $request->user()->id,
            'channel_type' => AssistantChannel::TYPE_PHONE,
            'phone_number' => $phoneNumber,
            'twilio_sid' => $twilioSid,
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
