<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaChannelLink;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Sends Personal Assistant messages outbound through the openclaw-connector
 * sidecar, which fans out to each channel's native send API.
 */
final class UrpaChannelOutboundService
{
    /**
     * Deliver a message to a linked external channel.
     *
     * @return array<string, mixed>
     */
    public function send(UrpaChannelLink $link, string $text): array
    {
        $connector = config('urpa.connector_url');
        if (! $connector) {
            throw new RuntimeException('URPA_CONNECTOR_URL is not configured');
        }

        $payload = [
            'channel' => $link->channel,
            'external_chat_id' => $link->external_chat_id,
            'text' => $text,
        ];

        // Per-user credentials (Option B) override the connector's shared bot.
        if (! empty($link->credentials)) {
            $payload['credentials'] = $link->credentials;
        }

        $response = Http::timeout(15)
            ->withHeaders(array_filter([
                'X-Channel-Secret' => config('urpa.channel_webhook_secret'),
            ]))
            ->post(rtrim($connector, '/').'/send', $payload);

        if ($response->failed()) {
            Log::warning('URPA channel outbound send failed', [
                'channel' => $link->channel,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException("Channel send failed ({$response->status()})");
        }

        $link->forceFill(['last_outbound_at' => now()])->save();

        return $response->json() ?? ['ok' => true];
    }
}
