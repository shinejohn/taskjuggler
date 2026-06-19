<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Jobs;

use App\Modules\Urpa\Models\UrpaAiMessage;
use App\Modules\Urpa\Models\UrpaAiSession;
use App\Modules\Urpa\Models\UrpaChannelLink;
use App\Modules\Urpa\Services\AiService;
use App\Modules\Urpa\Services\UrpaChannelOutboundService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Runs the inbound → AI → outbound reply loop for a channel message so the
 * webhook can return immediately. One conversation (AI session) is kept per
 * (user, channel link) for continuity.
 */
final class GenerateChannelReplyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $channelLinkId,
        public string $text
    ) {}

    public function handle(AiService $aiService, UrpaChannelOutboundService $outbound): void
    {
        $link = UrpaChannelLink::find($this->channelLinkId);
        if (! $link || ! $link->is_active || ! $link->auto_reply) {
            return;
        }

        $session = $this->resolveSession($link);

        UrpaAiMessage::create([
            'session_id' => $session->id,
            'role' => 'user',
            'content' => $this->text,
        ]);
        $session->incrementMessageCount();

        $reply = $aiService->processMessage($session, $this->text, $session->persona_used);

        UrpaAiMessage::create([
            'session_id' => $session->id,
            'role' => 'assistant',
            'content' => $reply,
        ]);
        $session->incrementMessageCount();
        $session->incrementAiRequestCount();

        try {
            $outbound->send($link, $reply);
        } catch (\Throwable $e) {
            Log::warning('Channel reply delivery failed', [
                'channel_link_id' => $link->id,
                'channel' => $link->channel,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function resolveSession(UrpaChannelLink $link): UrpaAiSession
    {
        $session = UrpaAiSession::where('user_id', $link->user_id)
            ->where('status', 'active')
            ->where('context->channel_link_id', $link->id)
            ->latest('started_at')
            ->first();

        if ($session) {
            return $session;
        }

        return UrpaAiSession::create([
            'user_id' => $link->user_id,
            'session_type' => 'chat',
            'status' => 'active',
            'started_at' => now(),
            'context' => [
                'channel' => $link->channel,
                'channel_link_id' => $link->id,
            ],
        ]);
    }
}
