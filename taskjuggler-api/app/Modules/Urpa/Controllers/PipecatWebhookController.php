<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communications\Support\WebhookSecretAuth;
use App\Modules\Urpa\Services\PipecatVoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PipecatWebhookController extends Controller
{
    public function __construct(
        private PipecatVoiceService $pipecatVoice
    ) {}

    /**
     * POST /api/urpa/voice/pipecat/webhook — session events from Pipecat agent
     */
    public function handle(Request $request): JsonResponse
    {
        if (! WebhookSecretAuth::authorized($request, 'pipecat.webhook_secret', 'X-Pipecat-Secret')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $sessionId = $request->input('session_id');
        $event = $request->input('event');
        $payload = $request->input('payload', []);

        if (! is_string($sessionId) || ! is_string($event) || ! is_array($payload)) {
            return response()->json(['processed' => false]);
        }

        $this->pipecatVoice->handle($sessionId, $event, $payload);

        return response()->json(['processed' => true]);
    }
}
