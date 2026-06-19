<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Models\User;
use App\Modules\Communications\Services\MatrixService;
use App\Modules\Urpa\Jobs\GenerateChannelReplyJob;
use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaChannelLink;
use Illuminate\Support\Facades\Log;

final class UrpaChannelBridgeService
{
    public function __construct(
        private MatrixService $matrix
    ) {}

    /**
     * Ingest a normalized channel message and mirror to Matrix + URPA activity feed.
     *
     * @param  array<string, mixed>  $metadata
     * @return array<string, mixed>
     */
    public function ingestMessage(
        string $channel,
        string $userId,
        string $externalUserId,
        string $externalChatId,
        string $text,
        array $metadata = []
    ): array {
        $user = User::findOrFail($userId);

        // Bind this external identity to the user so the assistant knows who it
        // is and where to reply. Credentials are user-managed (Option B) and
        // set via the channel-links API, so we never overwrite them here.
        $link = UrpaChannelLink::firstOrNew([
            'channel' => $channel,
            'external_user_id' => $externalUserId,
        ]);
        $link->fill([
            'user_id' => $user->id,
            'external_chat_id' => $externalChatId,
            'last_inbound_at' => now(),
        ]);
        if (! $link->exists) {
            $link->is_active = true;
            $link->auto_reply = true;
        }
        $link->save();

        $activity = UrpaActivity::create([
            'user_id' => $user->id,
            'activity_type' => 'message',
            'source' => $channel,
            'title' => ucfirst($channel).' message',
            'description' => $text,
            'raw_content' => array_merge($metadata, [
                'external_user_id' => $externalUserId,
                'external_chat_id' => $externalChatId,
                'channel' => $channel,
            ]),
            'status' => 'new',
            'is_read' => false,
            'activity_timestamp' => now(),
            'external_id' => $externalChatId,
        ]);

        $matrixRoomId = null;
        if ($this->matrix->isEnabled()) {
            try {
                $matrixRoomId = $this->matrix->ensureChannelRoom(
                    $user,
                    $channel,
                    $externalChatId
                );
                if ($matrixRoomId) {
                    $this->matrix->sendToRoomAsUser($user, $matrixRoomId, "[{$channel}] {$text}");
                }
            } catch (\Throwable $e) {
                Log::warning('Matrix channel mirror failed', [
                    'channel' => $channel,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Generate + send the assistant's reply over the same channel (async).
        $replyQueued = false;
        if (config('urpa.auto_reply') && $link->is_active && $link->auto_reply) {
            GenerateChannelReplyJob::dispatch($link->id, $text);
            $replyQueued = true;
        }

        return [
            'activity_id' => $activity->id,
            'channel_link_id' => $link->id,
            'matrix_room_id' => $matrixRoomId,
            'reply_queued' => $replyQueued,
            'processed' => true,
        ];
    }
}
