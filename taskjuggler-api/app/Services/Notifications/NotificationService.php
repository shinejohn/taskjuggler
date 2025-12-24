<?php

namespace App\Services\Notifications;

use App\Models\User;
use App\Models\Notification;
use App\Models\Task;
use App\Models\TaskMessage;
use App\Models\DirectMessage;
use App\Models\TeamInvitation;
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
            'created_at' => now(),
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
        $user = $notification->user;
        
        // Check if user has a push token
        if (!$user->push_token) {
            Log::info('User has no push token registered', ['user_id' => $user->id]);
            return;
        }
        
        // For Expo push notifications, we need to send to Expo Push Notification service
        // This requires the expo-server-sdk-php package or HTTP requests to Expo API
        // For now, we'll use HTTP requests to Expo Push Notification API
        
        $expoPushUrl = 'https://exp.host/--/api/v2/push/send';
        
        $message = [
            'to' => $user->push_token,
            'sound' => 'default',
            'title' => $notification->title,
            'body' => $notification->body,
            'data' => array_merge($notification->data ?? [], [
                'notification_id' => $notification->id,
                'type' => $notification->type,
            ]),
            'badge' => $user->notifications()->where('read_at', null)->count(),
        ];
        
        try {
            $ch = curl_init($expoPushUrl);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([$message]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json',
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200) {
                Log::info('Push notification sent successfully', [
                    'notification_id' => $notification->id,
                    'user_id' => $user->id,
                ]);
            } else {
                Log::warning('Failed to send push notification', [
                    'notification_id' => $notification->id,
                    'http_code' => $httpCode,
                    'response' => $response,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error sending push notification', [
                'notification_id' => $notification->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function sendEmail(Notification $notification): void
    {
        $user = $notification->user;
        
        if (!$user->email) {
            Log::info('User has no email address', ['user_id' => $user->id]);
            return;
        }

        try {
            // Get user's email channel or use default
            $channel = $user->assistantChannels()
                ->where('channel_type', 'email')
                ->where('is_active', true)
                ->first();

            if (!$channel) {
                // Create a default email channel for notifications
                $channel = \App\Models\AssistantChannel::create([
                    'user_id' => $user->id,
                    'channel_type' => 'email',
                    'email_address' => config('mail.from.address'),
                    'is_active' => true,
                ]);
            }

            $emailService = app(\App\Services\SendGrid\EmailService::class);
            
            $htmlContent = "<h2>{$notification->title}</h2><p>{$notification->body}</p>";
            $textContent = "{$notification->title}\n\n{$notification->body}";

            $success = $emailService->sendEmail(
                $channel,
                $user->email,
                $notification->title,
                $htmlContent,
                $textContent
            );

            if ($success) {
                Log::info('Email notification sent', ['notification_id' => $notification->id]);
            } else {
                Log::warning('Failed to send email notification', ['notification_id' => $notification->id]);
            }
        } catch (\Exception $e) {
            Log::error('Error sending email notification', [
                'notification_id' => $notification->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function sendSms(Notification $notification): void
    {
        $user = $notification->user;
        
        if (!$user->phone) {
            Log::info('User has no phone number', ['user_id' => $user->id]);
            return;
        }

        try {
            // Get user's SMS channel
            $channel = $user->assistantChannels()
                ->where('channel_type', 'sms')
                ->where('is_active', true)
                ->first();

            if (!$channel) {
                Log::warning('User has no active SMS channel', ['user_id' => $user->id]);
                return;
            }

            $smsService = app(\App\Services\Twilio\SmsService::class);
            
            $message = "{$notification->title}: {$notification->body}";
            $smsService->send($user->phone, $message);

            Log::info('SMS notification sent', ['notification_id' => $notification->id]);
        } catch (\Exception $e) {
            Log::error('Error sending SMS notification', [
                'notification_id' => $notification->id,
                'error' => $e->getMessage(),
            ]);
        }
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

    /**
     * Notify user of new task message
     */
    public function notifyNewMessage(Task $task, TaskMessage $message, User $recipient): void
    {
        $senderName = $message->sender?->name ?? 'Someone';
        
        $this->send(
            $recipient,
            "task.new_message",
            "New message on: {$task->title}",
            "{$senderName}: {$this->truncate($message->content, 100)}",
            ['task_id' => $task->id, 'message_id' => $message->id]
        );
    }

    /**
     * Notify user of direct message
     */
    public function notifyDirectMessage(DirectMessage $message): void
    {
        $this->send(
            $message->recipient,
            "direct_message",
            "Message from {$message->sender->name}",
            $this->truncate($message->content, 100),
            ['message_id' => $message->id, 'sender_id' => $message->sender_id]
        );
    }

    /**
     * Notify of team invitation accepted
     */
    public function notifyTeamInvitationAccepted(TeamInvitation $invitation, User $acceptedBy): void
    {
        $this->send(
            $invitation->inviter,
            "team.invitation_accepted",
            "{$acceptedBy->name} joined your team",
            "{$acceptedBy->name} has joined {$invitation->team->name}",
            ['team_id' => $invitation->team_id, 'user_id' => $acceptedBy->id]
        );
    }

    /**
     * Truncate string
     */
    private function truncate(string $text, int $length): string
    {
        return strlen($text) > $length 
            ? substr($text, 0, $length) . '...' 
            : $text;
    }
}
