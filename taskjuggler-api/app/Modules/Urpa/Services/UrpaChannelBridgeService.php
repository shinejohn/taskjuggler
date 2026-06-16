<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Models\User;
use App\Modules\Communications\Services\MatrixService;
use App\Modules\Urpa\Models\UrpaActivity;
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

        return [
            'activity_id' => $activity->id,
            'matrix_room_id' => $matrixRoomId,
            'processed' => true,
        ];
    }
}
