<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communications\Support\WebhookSecretAuth;
use App\Modules\Urpa\Services\UrpaChannelBridgeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ChannelMessageController extends Controller
{
    public function __construct(
        private UrpaChannelBridgeService $channelBridge
    ) {}

    /**
     * POST /api/urpa/channels/message — normalized inbound message from openclaw-connector
     */
    public function ingest(Request $request): JsonResponse
    {
        if (! WebhookSecretAuth::authorized($request, 'urpa.channel_webhook_secret', 'X-Channel-Secret')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'channel' => 'required|string|in:telegram,whatsapp,signal,slack,discord,google_chat,imessage',
            'external_user_id' => 'required|string',
            'external_chat_id' => 'required|string',
            'user_id' => 'required|uuid|exists:users,id',
            'text' => 'required|string',
            'metadata' => 'nullable|array',
        ]);

        $result = $this->channelBridge->ingestMessage(
            $validated['channel'],
            $validated['user_id'],
            $validated['external_user_id'],
            $validated['external_chat_id'],
            $validated['text'],
            $validated['metadata'] ?? []
        );

        return response()->json($result);
    }
}
