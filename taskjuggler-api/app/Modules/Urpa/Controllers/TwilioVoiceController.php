<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use App\Modules\Urpa\Models\UrpaUserProfile;
use App\Modules\Urpa\Services\PipecatBridgeService;
use App\Services\IdeaCircuit\LiveKitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

/**
 * Twilio voice webhooks — routes inbound calls to Pipecat/LiveKit when enabled.
 */
final class TwilioVoiceController extends Controller
{
    public function __construct(
        private PipecatBridgeService $pipecatBridge,
        private LiveKitService $liveKit
    ) {}

    /**
     * POST /api/urpa/voice/twilio/inbound
     */
    public function inbound(Request $request): Response|JsonResponse
    {
        $from = $request->input('From', '');
        $to = $request->input('To', '');
        $callSid = $request->input('CallSid', '');

        if ($this->pipecatBridge->shouldReplaceVapi() && $this->liveKit->isEnabled()) {
            $roomName = 'urpa-inbound-'.Str::replace('-', '', (string) Str::uuid());

            $session = $this->pipecatBridge->startVoiceSession([
                'room_name' => $roomName,
                'customer_number' => $from,
                'metadata' => ['direction' => 'inbound', 'twilio_call_sid' => $callSid, 'to' => $to],
                'livekit' => $this->liveKit->agentJoinCredentials($roomName),
            ]);

            $userId = UrpaUserProfile::where('phone_number', $to)->value('user_id');

            if ($userId) {
                UrpaPhoneCall::create([
                    'user_id' => $userId,
                    'direction' => 'inbound',
                    'caller_number' => $from,
                    'callee_number' => $to,
                    'status' => 'in_progress',
                    'handled_by_ai' => true,
                    'actions_taken' => [
                        'provider' => 'pipecat',
                        'room_name' => $roomName,
                        'session' => $session,
                        'twilio_call_sid' => $callSid,
                    ],
                    'started_at' => now(),
                ]);
            }

            // TwiML: connect caller audio stream to LiveKit SIP bridge (future) or hold message
            $twiml = '<?xml version="1.0" encoding="UTF-8"?>'
                .'<Response><Say voice="Polly.Joanna">Connecting you to your AI assistant.</Say>'
                .'<Pause length="60"/></Response>';

            return response($twiml, 200)->header('Content-Type', 'text/xml');
        }

        $twiml = '<?xml version="1.0" encoding="UTF-8"?>'
            .'<Response><Say voice="Polly.Joanna">URPA voice is not configured. Please try again later.</Say></Response>';

        return response($twiml, 200)->header('Content-Type', 'text/xml');
    }
}
