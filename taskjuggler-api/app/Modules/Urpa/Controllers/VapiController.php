<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use App\Modules\Urpa\Services\PipecatBridgeService;
use App\Modules\Urpa\Services\VapiService;
use App\Services\IdeaCircuit\LiveKitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

final class VapiController extends Controller
{
    public function __construct(
        private VapiService $vapiService,
        private PipecatBridgeService $pipecatBridge,
        private LiveKitService $liveKit
    ) {}

    /**
     * Initiate an outbound voice call (Pipecat when enabled, else Vapi)
     * POST /api/urpa/voice/vapi/call
     */
    public function startCall(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'assistant_id' => 'required|string',
            'customer_number' => 'required|string',
            'phone_number_id' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $user = $request->user();
        $metadata = array_merge($validated['metadata'] ?? [], ['user_id' => $user->id]);

        if ($this->pipecatBridge->shouldReplaceVapi()) {
            $roomName = 'urpa-call-'.Str::replace('-', '', (string) Str::uuid());

            $session = $this->pipecatBridge->startVoiceSession([
                'room_name' => $roomName,
                'customer_number' => $validated['customer_number'],
                'user_id' => $user->id,
                'assistant_id' => $validated['assistant_id'],
                'metadata' => $metadata,
                'livekit' => $this->liveKit->isEnabled()
                    ? $this->liveKit->agentJoinCredentials($roomName)
                    : null,
            ]);

            UrpaPhoneCall::create([
                'user_id' => $user->id,
                'callee_number' => $validated['customer_number'],
                'direction' => 'outbound',
                'status' => 'initiated',
                'handled_by_ai' => true,
                'vapi_assistant_id' => $validated['assistant_id'],
                'actions_taken' => [
                    'provider' => 'pipecat',
                    'room_name' => $roomName,
                    'session' => $session,
                ],
                'started_at' => now(),
            ]);

            return response()->json([
                'provider' => 'pipecat',
                'room_name' => $roomName,
                'livekit' => $this->liveKit->isEnabled()
                    ? $this->liveKit->agentJoinCredentials($roomName)
                    : null,
                'session' => $session,
            ]);
        }

        $response = $this->vapiService->initiateCall([
            'assistant_id' => $validated['assistant_id'],
            'customer_number' => $validated['customer_number'],
            'phone_number_id' => $validated['phone_number_id'] ?? null,
            'metadata' => $metadata,
        ]);

        return response()->json(array_merge($response, ['provider' => 'vapi']));
    }

    /**
     * POST /api/urpa/voice/vapi/call/{callId}/end
     */
    public function endCall(Request $request, string $callId): JsonResponse
    {
        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)
            ->orWhere('id', $callId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (($phoneCall->actions_taken['provider'] ?? 'vapi') === 'pipecat') {
            $roomName = $phoneCall->actions_taken['room_name'] ?? null;
            if ($roomName && $this->liveKit->isEnabled()) {
                try {
                    $this->liveKit->deleteRoom($roomName);
                } catch (\Throwable) {
                    Log::warning('Failed to delete Pipecat LiveKit room', ['room' => $roomName]);
                }
            }

            $phoneCall->update(['status' => 'completed', 'ended_at' => now()]);

            return response()->json(['success' => true, 'provider' => 'pipecat']);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.config('services.vapi.api_key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.vapi.ai/call/'.$callId.'/end');

        if ($response->failed()) {
            Log::error('Vapi call end failed', [
                'call_id' => $callId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return response()->json(['error' => 'Failed to end call'], 500);
        }

        $phoneCall->update(['status' => 'completed', 'ended_at' => now()]);

        return response()->json(['success' => true, 'provider' => 'vapi']);
    }

    /**
     * GET /api/urpa/voice/vapi/call/{callId}
     */
    public function getCallStatus(Request $request, string $callId): JsonResponse
    {
        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)
            ->orWhere('id', $callId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json($phoneCall);
    }
}
