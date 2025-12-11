<?php

namespace App\Services\Tasks;

use App\Models\Task;
use App\Models\TaskMessage;
use App\Models\User;
use App\Services\MessageRouter\MessageRouter;
use App\Services\Notifications\NotificationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaskMessageService
{
    public function __construct(
        private NotificationService $notifications,
        private ?MessageRouter $messageRouter = null
    ) {}

    /**
     * Send a message on a task
     */
    public function sendMessage(
        Task $task,
        User $sender,
        string $content,
        string $contentType = TaskMessage::CONTENT_TEXT,
        ?string $sourceChannel = 'in_app',
        ?array $attachments = null
    ): TaskMessage {
        $message = TaskMessage::create([
            'task_id' => $task->id,
            'sender_id' => $sender->id,
            'sender_type' => $sender->actor_type ?? TaskMessage::SENDER_HUMAN,
            'content' => $content,
            'content_type' => $contentType,
            'source_channel' => $sourceChannel,
            'attachments' => $attachments,
        ]);

        // Mark as read for sender
        $this->markAsRead($task, $sender, $message);

        // Notify other participants
        $this->notifyParticipants($task, $message, $sender);

        return $message;
    }

    /**
     * Get messages for a task
     */
    public function getMessages(Task $task, int $limit = 50, ?string $before = null): array
    {
        $query = $task->messages()
            ->with('sender:id,name,avatar_url')
            ->orderBy('created_at', 'desc')
            ->limit($limit);

        if ($before) {
            $query->where('created_at', '<', $before);
        }

        return $query->get()->reverse()->values()->toArray();
    }

    /**
     * Get unread count for a user on a task
     */
    public function getUnreadCount(Task $task, User $user): int
    {
        $lastRead = DB::table('task_message_reads')
            ->where('task_id', $task->id)
            ->where('user_id', $user->id)
            ->value('last_read_at');

        if (!$lastRead) {
            return $task->messages()->count();
        }

        return $task->messages()
            ->where('created_at', '>', $lastRead)
            ->where('sender_id', '!=', $user->id)
            ->count();
    }

    /**
     * Mark messages as read
     */
    public function markAsRead(Task $task, User $user, ?TaskMessage $upToMessage = null): void
    {
        $messageId = $upToMessage?->id ?? $task->messages()->latest()->value('id');

        DB::table('task_message_reads')->updateOrInsert(
            ['task_id' => $task->id, 'user_id' => $user->id],
            [
                'last_read_message_id' => $messageId,
                'last_read_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Add system message (for status changes, etc.)
     */
    public function addSystemMessage(Task $task, string $content): TaskMessage
    {
        return TaskMessage::systemMessage($task, $content);
    }

    /**
     * Process an inbound message from external channel
     */
    public function processInboundMessage(
        Task $task,
        string $content,
        User $sender,
        string $sourceChannel,
        ?string $sourceChannelRef = null
    ): TaskMessage {
        return TaskMessage::create([
            'task_id' => $task->id,
            'sender_id' => $sender->id,
            'sender_type' => TaskMessage::SENDER_HUMAN,
            'content' => $content,
            'content_type' => TaskMessage::CONTENT_TEXT,
            'source_channel' => $sourceChannel,
            'source_channel_ref' => $sourceChannelRef,
        ]);
    }

    /**
     * Get all participants who should be notified
     */
    private function getParticipants(Task $task): array
    {
        $participants = [];

        // Requestor
        if ($task->requestor_id) {
            $participants[$task->requestor_id] = $task->requestor;
        }

        // Owner
        if ($task->owner_id) {
            $participants[$task->owner_id] = $task->owner;
        }

        // Watchers (if you have a watchers relationship)
        // foreach ($task->watchers as $watcher) {
        //     $participants[$watcher->id] = $watcher;
        // }

        return $participants;
    }

    /**
     * Notify participants of new message
     */
    private function notifyParticipants(Task $task, TaskMessage $message, User $sender): void
    {
        $participants = $this->getParticipants($task);

        foreach ($participants as $userId => $user) {
            // Don't notify sender
            if ($userId === $sender->id) {
                continue;
            }

            // Use message router if available, otherwise use basic notifications
            if ($this->messageRouter) {
                $this->messageRouter->notifyUser($user, $task, 'new_message');
            } else {
                $this->notifications->notifyNewMessage($task, $message, $user);
            }
        }
    }
}
