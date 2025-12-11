<?php

namespace App\Services\MessageRouter;

use App\Models\Task;
use App\Models\User;
use App\Services\MessageRouter\Adapters\ChannelAdapter;
use App\Services\MessageRouter\Adapters\EmailAdapter;
use App\Services\MessageRouter\Adapters\SmsAdapter;
use App\Services\MessageRouter\Adapters\SlackAdapter;
use App\Services\MessageRouter\Adapters\InAppAdapter;
use App\TaskExchange\TaskExchangeFormat;
use Illuminate\Support\Facades\Log;

class MessageRouter
{
    private array $adapters = [];

    public function __construct()
    {
        $this->registerDefaultAdapters();
    }

    /**
     * Register default channel adapters
     */
    private function registerDefaultAdapters(): void
    {
        $this->registerAdapter('email', app(EmailAdapter::class));
        $this->registerAdapter('sms', app(SmsAdapter::class));
        $this->registerAdapter('slack', app(SlackAdapter::class));
        $this->registerAdapter('in_app', app(InAppAdapter::class));
    }

    /**
     * Register a channel adapter
     */
    public function registerAdapter(string $channel, ChannelAdapter $adapter): void
    {
        $this->adapters[$channel] = $adapter;
    }

    /**
     * Get an adapter by channel
     */
    public function getAdapter(string $channel): ?ChannelAdapter
    {
        return $this->adapters[$channel] ?? null;
    }

    /**
     * Process an inbound message from any channel
     */
    public function processInbound(InboundMessage $message): ProcessedMessage
    {
        Log::info('MessageRouter: Processing inbound', [
            'channel' => $message->channel,
            'sender' => $message->sender,
        ]);

        // Resolve sender to user
        $user = $this->resolveUser($message);

        // Check if this relates to an existing task
        $task = $this->matchToExistingTask($message);

        // Determine intent
        $intent = $this->classifyIntent($message, $task);

        return new ProcessedMessage(
            original: $message,
            user: $user,
            task: $task,
            intent: $intent,
        );
    }

    /**
     * Send a task via specified channel
     */
    public function sendTask(Task $task, string $channel, string $recipient): bool
    {
        $adapter = $this->getAdapter($channel);
        
        if (!$adapter) {
            Log::error("MessageRouter: No adapter for channel: {$channel}");
            return false;
        }

        // Convert task to TEF
        $tef = TaskExchangeFormat::fromTask($task);

        // Let adapter format and send
        return $adapter->sendTask($tef, $recipient);
    }

    /**
     * Send task notification via user's preferred channel
     */
    public function notifyUser(User $user, Task $task, string $notificationType): bool
    {
        $preferredChannel = $this->getUserPreferredChannel($user);
        $adapter = $this->getAdapter($preferredChannel);

        if (!$adapter) {
            // Fallback to email
            $adapter = $this->adapters['email'];
        }

        return $adapter->sendNotification($user, $task, $notificationType);
    }

    /**
     * Resolve inbound message sender to a User
     */
    private function resolveUser(InboundMessage $message): ?User
    {
        // Try email first
        if ($message->sender['email'] ?? null) {
            $user = User::where('email', $message->sender['email'])->first();
            if ($user) return $user;
        }

        // Try phone
        if ($message->sender['phone'] ?? null) {
            $user = User::where('phone', $this->normalizePhone($message->sender['phone']))->first();
            if ($user) return $user;
        }

        // Try external ID (Slack user ID, etc.)
        if ($message->sender['external_id'] ?? null) {
            $user = User::whereJsonContains('settings->external_ids->' . $message->channel, $message->sender['external_id'])->first();
            if ($user) return $user;
        }

        return null;
    }

    /**
     * Try to match message to an existing task
     */
    private function matchToExistingTask(InboundMessage $message): ?Task
    {
        // Check for explicit task ID in message
        if ($taskId = $this->extractTaskId($message->content)) {
            return Task::find($taskId);
        }

        // Check for reply thread
        if ($message->threadId) {
            $task = Task::where('source_channel', $message->channel)
                ->where('source_channel_ref', $message->threadId)
                ->first();
            if ($task) return $task;
        }

        // Check for subject line match (email)
        if ($message->subject && preg_match('/\[Task #([a-f0-9-]+)\]/', $message->subject, $matches)) {
            return Task::find($matches[1]);
        }

        return null;
    }

    /**
     * Classify the intent of the message
     */
    private function classifyIntent(InboundMessage $message, ?Task $task): MessageIntent
    {
        $content = strtolower($message->content);

        // If no existing task, it's a new task request
        if (!$task) {
            return new MessageIntent('create_task', 0.9);
        }

        // Check for explicit responses
        if (preg_match('/\b(accept|yes|confirm|ok|approve)\b/', $content)) {
            return new MessageIntent('accept', 0.95);
        }

        if (preg_match('/\b(decline|no|reject|cancel)\b/', $content)) {
            return new MessageIntent('decline', 0.95);
        }

        if (preg_match('/\b(complete|done|finished)\b/', $content)) {
            return new MessageIntent('complete', 0.9);
        }

        if (preg_match('/\b(watch|follow|subscribe)\b/', $content)) {
            return new MessageIntent('watch', 0.85);
        }

        // Default to message/update
        return new MessageIntent('message', 0.7);
    }

    /**
     * Extract task ID from message content
     */
    private function extractTaskId(string $content): ?string
    {
        // Look for patterns like "task:abc123" or "#abc123" or "Task ID: abc123"
        if (preg_match('/(?:task[:\s#]*|#)([a-f0-9-]{36})/i', $content, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Get user's preferred communication channel
     */
    private function getUserPreferredChannel(User $user): string
    {
        // Check user preferences
        $prefs = $user->settings['notification_preferences'] ?? [];
        
        if (!empty($prefs['preferred_channel'])) {
            return $prefs['preferred_channel'];
        }

        // Default hierarchy: in_app > email > sms
        if ($user->email) return 'email';
        if ($user->phone) return 'sms';
        
        return 'in_app';
    }

    /**
     * Normalize phone number
     */
    private function normalizePhone(string $phone): string
    {
        return preg_replace('/[^0-9+]/', '', $phone);
    }
}
