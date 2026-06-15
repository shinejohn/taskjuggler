<?php

declare(strict_types=1);

namespace App\Modules\Communications\Services;

use App\Models\Conversation;
use App\Models\DirectMessage;
use App\Models\Task;
use App\Models\User;
use App\Modules\Communications\Models\MatrixAccount;
use App\Modules\Communications\Models\MatrixDirectRoom;
use App\Modules\Tasks\Models\TaskMessage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

final class MatrixService
{
    public function isEnabled(): bool
    {
        return (bool) config('matrix.enabled')
            && is_string(config('matrix.homeserver_url'))
            && config('matrix.homeserver_url') !== '';
    }

    /**
     * Register the user on the Matrix homeserver if not already provisioned.
     */
    public function ensureUserRegistered(User $user): ?MatrixAccount
    {
        if (! $this->isEnabled()) {
            return null;
        }

        $existing = MatrixAccount::where('user_id', $user->id)->first();
        if ($existing?->access_token) {
            return $existing;
        }

        $localpart = $this->localpartForUser($user);
        $password = Str::random(32);
        $matrixUserId = $this->matrixUserId($localpart);

        $accessToken = $this->registerOnHomeserver($localpart, $password);
        if ($accessToken === null) {
            return $existing;
        }

        return MatrixAccount::updateOrCreate(
            ['user_id' => $user->id],
            [
                'matrix_user_id' => $matrixUserId,
                'access_token' => $accessToken,
                'device_id' => 'fibonacco-web',
                'provisioned_at' => now(),
            ]
        );
    }

    /**
     * Create or return the Matrix room for a task conversation.
     */
    public function ensureTaskRoom(Task $task): ?string
    {
        if (! $this->isEnabled()) {
            return null;
        }

        $conversation = Conversation::firstOrCreate(
            ['task_id' => $task->id],
            [
                'participants' => array_values(array_filter([
                    $task->requestor_id,
                    $task->owner_id,
                ])),
                'message_count' => 0,
            ]
        );

        if ($conversation->matrix_room_id) {
            return $conversation->matrix_room_id;
        }

        $requestor = $task->requestor;
        if (! $requestor) {
            return null;
        }

        $account = $this->ensureUserRegistered($requestor);
        if (! $account?->access_token) {
            return null;
        }

        $roomId = $this->createRoom(
            $account->access_token,
            'Task: '.($task->title ?? 'Untitled'),
            'task-'.str_replace('-', '', (string) $task->id)
        );

        if ($roomId === null) {
            return null;
        }

        $conversation->update(['matrix_room_id' => $roomId]);

        return $roomId;
    }

    /**
     * Mirror a task message to the task's Matrix room.
     */
    public function mirrorTaskMessage(TaskMessage $message): void
    {
        if (! $this->isEnabled() || $message->isSystem()) {
            return;
        }

        $task = $message->task;
        if (! $task) {
            return;
        }

        $roomId = $this->ensureTaskRoom($task);
        if ($roomId === null) {
            return;
        }

        $sender = $message->sender;
        if (! $sender) {
            return;
        }

        $account = $this->ensureUserRegistered($sender);
        if (! $account?->access_token) {
            return;
        }

        $this->sendTextMessage($account->access_token, $roomId, $message->content);
    }

    /**
     * Handle an inbound Matrix m.room.message event (from appservice webhook).
     */
    public function handleInboundMessage(array $event): void
    {
        if (($event['type'] ?? '') !== 'm.room.message') {
            return;
        }

        $roomId = $event['room_id'] ?? null;
        $body = $event['content']['body'] ?? null;
        $senderMxid = $event['sender'] ?? null;

        if (! $roomId || ! is_string($body) || ! $senderMxid) {
            return;
        }

        $conversation = Conversation::where('matrix_room_id', $roomId)->first();
        if ($conversation?->task_id) {
            $this->handleInboundTaskMessage($event, $conversation, $senderMxid, $body);

            return;
        }

        $directRoom = MatrixDirectRoom::where('matrix_room_id', $roomId)->first();
        if ($directRoom) {
            $this->handleInboundDirectMessage($event, $directRoom, $senderMxid, $body);
        }
    }

    /**
     * Create or return a Matrix DM room between two users.
     */
    public function ensureDirectRoom(User $currentUser, User $otherUser): ?string
    {
        if (! $this->isEnabled()) {
            return null;
        }

        [$low, $high] = strcmp((string) $currentUser->id, (string) $otherUser->id) < 0
            ? [$currentUser, $otherUser]
            : [$otherUser, $currentUser];

        $existing = MatrixDirectRoom::where('user_low_id', $low->id)
            ->where('user_high_id', $high->id)
            ->first();

        if ($existing) {
            return $existing->matrix_room_id;
        }

        $account = $this->ensureUserRegistered($currentUser);
        if (! $account?->access_token) {
            return null;
        }

        $roomId = $this->createRoom(
            $account->access_token,
            'DM: '.$currentUser->name.' & '.$otherUser->name,
            'dm-'.str_replace('-', '', (string) $low->id).'-'.str_replace('-', '', (string) $high->id)
        );

        if ($roomId === null) {
            return null;
        }

        MatrixDirectRoom::create([
            'user_low_id' => $low->id,
            'user_high_id' => $high->id,
            'matrix_room_id' => $roomId,
        ]);

        return $roomId;
    }

    private function handleInboundTaskMessage(
        array $event,
        Conversation $conversation,
        string $senderMxid,
        string $body
    ): void {
        $eventId = $event['event_id'] ?? null;
        if ($eventId && TaskMessage::where('source_channel_ref', $eventId)->exists()) {
            return;
        }

        $account = MatrixAccount::where('matrix_user_id', $senderMxid)->first();
        if (! $account) {
            return;
        }

        $task = Task::find($conversation->task_id);
        if (! $task) {
            return;
        }

        $sender = User::find($account->user_id);
        if (! $sender) {
            return;
        }

        TaskMessage::create([
            'task_id' => $task->id,
            'sender_id' => $sender->id,
            'sender_type' => TaskMessage::SENDER_HUMAN,
            'content' => $body,
            'content_type' => TaskMessage::CONTENT_TEXT,
            'source_channel' => 'matrix',
            'source_channel_ref' => $eventId,
        ]);
    }

    private function handleInboundDirectMessage(
        array $event,
        MatrixDirectRoom $directRoom,
        string $senderMxid,
        string $body
    ): void {
        $eventId = $event['event_id'] ?? null;
        if ($eventId && DirectMessage::where('content', $body)->where('created_at', '>=', now()->subMinute())->exists()) {
            return;
        }

        $account = MatrixAccount::where('matrix_user_id', $senderMxid)->first();
        if (! $account) {
            return;
        }

        $recipientId = $account->user_id === $directRoom->user_low_id
            ? $directRoom->user_high_id
            : $directRoom->user_low_id;

        DirectMessage::create([
            'sender_id' => $account->user_id,
            'recipient_id' => $recipientId,
            'content' => $body,
        ]);
    }

    /**
     * Client session payload for matrix-js-sdk.
     *
     * @return array{enabled: bool, homeserver_url?: string, user_id?: string, access_token?: string, device_id?: string}
     */
    public function clientSession(User $user): array
    {
        if (! $this->isEnabled()) {
            return ['enabled' => false];
        }

        $account = $this->ensureUserRegistered($user);
        if (! $account?->access_token) {
            return ['enabled' => true, 'provisioned' => false];
        }

        return [
            'enabled' => true,
            'provisioned' => true,
            'homeserver_url' => rtrim((string) config('matrix.homeserver_url'), '/'),
            'user_id' => $account->matrix_user_id,
            'access_token' => $account->access_token,
            'device_id' => $account->device_id ?? 'fibonacco-web',
        ];
    }

    private function registerOnHomeserver(string $localpart, string $password): ?string
    {
        $url = rtrim((string) config('matrix.homeserver_url'), '/');
        $adminToken = config('matrix.admin_token');

        if ($adminToken) {
            $response = Http::withToken($adminToken)
                ->post("{$url}/_synapse/admin/v1/register", [
                    'username' => $localpart,
                    'password' => $password,
                    'admin' => false,
                ]);

            if ($response->successful()) {
                return $response->json('access_token');
            }
        }

        // Fallback: open registration (dev / Dendrite with m.login.dummy)
        $response = Http::post("{$url}/_matrix/client/v3/register", [
            'username' => $localpart,
            'password' => $password,
            'auth' => ['type' => 'm.login.dummy'],
        ]);

        if ($response->successful()) {
            return $response->json('access_token');
        }

        Log::warning('Matrix user registration failed', [
            'localpart' => $localpart,
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        return null;
    }

    private function createRoom(string $accessToken, string $name, string $aliasLocalpart): ?string
    {
        $url = rtrim((string) config('matrix.homeserver_url'), '/');

        $response = Http::withToken($accessToken)->post("{$url}/_matrix/client/v3/createRoom", [
            'name' => $name,
            'room_alias_name' => $aliasLocalpart,
            'preset' => 'private_chat',
            'visibility' => config('matrix.room_visibility', 'private'),
        ]);

        if ($response->successful()) {
            return $response->json('room_id');
        }

        Log::warning('Matrix room creation failed', [
            'alias' => $aliasLocalpart,
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        return null;
    }

    private function sendTextMessage(string $accessToken, string $roomId, string $body): void
    {
        $url = rtrim((string) config('matrix.homeserver_url'), '/');
        $txnId = Str::uuid()->toString();

        Http::withToken($accessToken)->put(
            "{$url}/_matrix/client/v3/rooms/".urlencode($roomId)."/send/m.room.message/{$txnId}",
            [
                'msgtype' => 'm.text',
                'body' => $body,
            ]
        );
    }

    private function localpartForUser(User $user): string
    {
        return 'tj-'.str_replace('-', '', (string) $user->id);
    }

    private function matrixUserId(string $localpart): string
    {
        return '@'.$localpart.':'.config('matrix.server_name', 'fibonacco.ai');
    }
}
