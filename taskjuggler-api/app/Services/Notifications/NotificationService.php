<?php

namespace App\Services\Notifications;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function send(User $user, string $type, string $title, string $body, array $data = [], array $channels = ['push']): Notification
    {
        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
            'channels' => $channels,
        ]);

        // Send via configured channels
        foreach ($channels as $channel) {
            match ($channel) {
                'push' => $this->sendPush($notification),
                'email' => $this->sendEmail($notification),
                'sms' => $this->sendSms($notification),
                default => Log::warning("Unknown notification channel: {$channel}"),
            };
        }

        $notification->markAsSent();

        return $notification;
    }

    private function sendPush(Notification $notification): void
    {
        // TODO: Implement push notification via Pusher or similar
        // For now, just log
        Log::info('Push notification sent', ['notification_id' => $notification->id]);
    }

    private function sendEmail(Notification $notification): void
    {
        // TODO: Implement email notification via SendGrid
        // For now, just log
        Log::info('Email notification sent', ['notification_id' => $notification->id]);
    }

    private function sendSms(Notification $notification): void
    {
        // TODO: Implement SMS notification via Twilio
        // For now, just log
        Log::info('SMS notification sent', ['notification_id' => $notification->id]);
    }

    public function sendTaskNotification(User $user, string $event, array $taskData): void
    {
        $messages = [
            'created' => ['title' => 'New Task', 'body' => "Task: {$taskData['title']}"],
            'assigned' => ['title' => 'Task Assigned', 'body' => "You've been assigned: {$taskData['title']}"],
            'completed' => ['title' => 'Task Completed', 'body' => "Task completed: {$taskData['title']}"],
        ];

        $message = $messages[$event] ?? ['title' => 'Task Update', 'body' => 'Your task has been updated'];

        $this->send(
            $user,
            "task.{$event}",
            $message['title'],
            $message['body'],
            ['task_id' => $taskData['id'] ?? null]
        );
    }
}
