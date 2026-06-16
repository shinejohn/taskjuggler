<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use App\Modules\Urpa\Models\UrpaUserProfile;
use App\Modules\Urpa\Services\ContextBuilderService;
use App\Modules\Urpa\Services\PipecatBridgeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

/**
 * Twilio voice webhooks — routes inbound calls to Pipecat when enabled.
 */
final class TwilioVoiceController extends Controller
{
    public function __construct(
        private PipecatBridgeService $pipecatBridge,
        private ContextBuilderService $contextBuilder
    ) {}

    /**
     * POST /api/urpa/voice/twilio/inbound
     */
    public function inbound(Request $request): Response|JsonResponse
    {
        $from = $request->input('From', '');
        $to = $request->input('To', '');
        $callSid = $request->input('CallSid', '');

        if ($this->pipecatBridge->shouldReplaceVapi()) {
            $roomName = 'urpa-inbound-'.Str::replace('-', '', (string) Str::uuid());
            $userId = UrpaUserProfile::where('phone_number', $to)->value('user_id');
            $systemPrompt = $this->buildSystemPrompt($userId);

            $session = $this->pipecatBridge->startVoiceSession([
                'room_name' => $roomName,
                'customer_number' => $from,
                'user_id' => $userId,
                'system_prompt' => $systemPrompt,
                'metadata' => [
                    'direction' => 'inbound',
                    'twilio_call_sid' => $callSid,
                    'to' => $to,
                ],
            ]);

            $sessionId = is_string($session['session_id'] ?? null) ? $session['session_id'] : '';

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

            $agentUrl = rtrim((string) config('pipecat.agent_url'), '/');
            $streamUrl = str_replace(['https://', 'http://'], ['wss://', 'ws://'], $agentUrl)
                .'/ws/twilio';

            $twiml = '<?xml version="1.0" encoding="UTF-8"?>'
                .'<Response>'
                .'<Connect>'
                .'<Stream url="'.htmlspecialchars($streamUrl, ENT_XML1).'">'
                .'<Parameter name="session_id" value="'.htmlspecialchars($sessionId, ENT_XML1).'" />'
                .'<Parameter name="room_name" value="'.htmlspecialchars($roomName, ENT_XML1).'" />'
                .'</Stream>'
                .'</Connect>'
                .'</Response>';

            return response($twiml, 200)->header('Content-Type', 'text/xml');
        }

        $twiml = '<?xml version="1.0" encoding="UTF-8"?>'
            .'<Response><Say voice="Polly.Joanna">URPA voice is not configured. Please try again later.</Say></Response>';

        return response($twiml, 200)->header('Content-Type', 'text/xml');
    }

    private function buildSystemPrompt(?string $userId): string
    {
        if (! $userId) {
            return 'You are URPA, a concise AI phone assistant. Keep responses under 2 sentences.';
        }

        $user = User::find($userId);
        if (! $user) {
            return 'You are URPA, a concise AI phone assistant. Keep responses under 2 sentences.';
        }

        $context = $this->contextBuilder->buildCallContext($user);

        return $this->contextBuilder->buildSystemPrompt($user, $context);
    }
}
