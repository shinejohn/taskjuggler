<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

final class PipecatWebhookController extends Controller
{
    /**
     * POST /api/urpa/voice/pipecat/webhook — session events from Pipecat agent
     */
    public function handle(Request $request): JsonResponse
    {
        $secret = config('pipecat.webhook_secret');
        if ($secret && $request->header('X-Pipecat-Secret') !== $secret) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $sessionId = $request->input('session_id');
        $event = $request->input('event');
        $payload = $request->input('payload', []);

        if (! is_string($sessionId) || ! is_string($event)) {
            return response()->json(['processed' => false]);
        }

        $call = UrpaPhoneCall::query()
            ->where('actions_taken->session->session_id', $sessionId)
            ->orWhere('actions_taken->session_id', $sessionId)
            ->first();

        if ($call) {
            $actions = $call->actions_taken ?? [];
            $actions['pipecat_events'] = array_merge($actions['pipecat_events'] ?? [], [
                ['event' => $event, 'payload' => $payload, 'at' => now()->toIso8601String()],
            ]);

            if ($event === 'session.connected') {
                $call->update(['status' => 'in_progress', 'actions_taken' => $actions]);
            } elseif ($event === 'session.error') {
                Log::warning('Pipecat session error', ['session_id' => $sessionId, 'payload' => $payload]);
                $call->update(['actions_taken' => $actions]);
            } else {
                $call->update(['actions_taken' => $actions]);
            }
        }

        return response()->json(['processed' => true]);
    }
}
