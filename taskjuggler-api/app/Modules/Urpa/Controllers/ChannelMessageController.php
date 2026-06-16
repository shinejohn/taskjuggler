<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
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
        $secret = config('urpa.channel_webhook_secret');
        if ($secret && $request->header('X-Channel-Secret') !== $secret) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'channel' => 'required|string|in:telegram,whatsapp,signal,imessage,google_chat',
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
