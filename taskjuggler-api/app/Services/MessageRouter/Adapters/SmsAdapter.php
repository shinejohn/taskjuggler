<?php

namespace App\Services\MessageRouter\Adapters;

use App\Models\Task;
use App\Models\User;
use App\Services\Twilio\SmsService;
use Illuminate\Support\Facades\Log;

class SmsAdapter implements ChannelAdapter
{
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
        $message = $this->formatTask($tef);
        
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
        $lines = [
            "📋 TASK: {$tef['title']}",
        ];

        if (!empty($tef['dtdue'])) {
            $lines[] = "Due: " . date('M j', strtotime($tef['dtdue']));
        }

        if (!empty($tef['organizer']['name'])) {
            $lines[] = "From: {$tef['organizer']['name']}";
        }

        $lines[] = "";
        $lines[] = "Reply ACCEPT or DECLINE";
        $lines[] = "View: " . $this->shortenUrl($tef['actions']['view']);

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
