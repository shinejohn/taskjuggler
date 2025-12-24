<?php

namespace App\Services\MessageRouter\Adapters;

use App\Models\Task;
use App\Models\User;
use App\Services\Twilio\SmsService;
use Illuminate\Support\Facades\Log;

class SmsAdapter implements ChannelAdapter
{
    use HandlesTefFormats;
    public function __construct(
        private SmsService $smsService
    ) {}

    public function getChannel(): string
    {
        return 'sms';
    }

    public function canSend(string $recipient): bool
    {
        // Basic phone number validation
        return preg_match('/^\+?[1-9]\d{9,14}$/', preg_replace('/[^0-9+]/', '', $recipient));
    }

    public function sendTask(array $tef, string $recipient): bool
    {
        // Extract task data (handles both TEF 1.0 and 2.0.0)
        $taskData = $this->extractTaskData($tef);
        $message = $this->formatTask($taskData);
        
        return $this->smsService->send($recipient, $message);
    }

    public function sendNotification(User $user, Task $task, string $type): bool
    {
        if (!$user->phone) {
            return false;
        }

        $message = $this->getNotificationMessage($task, $type);
        
        return $this->smsService->send($user->phone, $message);
    }

    public function formatTask(array $tef): string
    {
        // Ensure we have normalized task data
        $taskData = $this->extractTaskData($tef);
        
        $lines = [
            "📋 TASK: {$taskData['title']}",
        ];

        if (!empty($taskData['dtdue'])) {
            $lines[] = "Due: " . date('M j', strtotime($taskData['dtdue']));
        }

        if (!empty($taskData['organizer']['name'])) {
            $lines[] = "From: {$taskData['organizer']['name']}";
        }

        $lines[] = "";
        $lines[] = "Reply ACCEPT or DECLINE";
        if (!empty($taskData['actions']['view'])) {
            $lines[] = "View: " . $this->shortenUrl($taskData['actions']['view']);
        }

        return implode("\n", $lines);
    }

    private function getNotificationMessage(Task $task, string $type): string
    {
        $url = $this->shortenUrl(config('app.url') . '/api/tasks/' . $task->id);
        
        return match($type) {
            'accepted' => "✅ Task accepted: \"{$task->title}\"\n{$url}",
            'declined' => "❌ Task declined: \"{$task->title}\"\n{$url}",
            'completed' => "🎉 Task completed: \"{$task->title}\"\n{$url}",
            'overdue' => "⚠️ Task overdue: \"{$task->title}\"\n{$url}",
            default => "📋 Task update: \"{$task->title}\"\n{$url}",
        };
    }

    private function shortenUrl(string $url): string
    {
        // Implement URL shortening if needed
        // For now, return as-is
        return $url;
    }
}
