<?php

namespace App\Services\MessageRouter\Adapters;

use App\Models\Task;
use App\Models\User;
use App\TaskExchange\TaskExchangeFormat;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailAdapter implements ChannelAdapter
{
    public function getChannel(): string
    {
        return 'email';
    }

    public function canSend(string $recipient): bool
    {
        return filter_var($recipient, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function sendTask(array $tef, string $recipient): bool
    {
        $subject = "Task: {$tef['title']}";
        $body = $this->formatTask($tef);

        // Create .tef file attachment
        $attachment = [
            'content' => json_encode($tef, JSON_PRETTY_PRINT),
            'filename' => 'task.' . TaskExchangeFormat::EXTENSION,
            'mime' => TaskExchangeFormat::MIME_TYPE,
        ];

        try {
            Mail::raw($body, function ($message) use ($recipient, $subject, $tef, $attachment) {
                $message->to($recipient)
                    ->subject($subject)
                    ->attachData(
                        $attachment['content'],
                        $attachment['filename'],
                        ['mime' => $attachment['mime']]
                    );
            });
            return true;
        } catch (\Exception $e) {
            Log::error('EmailAdapter: Failed to send', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function sendNotification(User $user, Task $task, string $type): bool
    {
        if (!$user->email) {
            return false;
        }

        $subject = $this->getNotificationSubject($task, $type);
        $body = $this->getNotificationBody($task, $type);

        try {
            Mail::raw($body, function ($message) use ($user, $subject) {
                $message->to($user->email)->subject($subject);
            });
            return true;
        } catch (\Exception $e) {
            Log::error('EmailAdapter: Failed to send notification', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function formatTask(array $tef): string
    {
        $lines = [
            "📋 TASK REQUEST",
            "═══════════════════════════════════════",
            "",
            "Title: {$tef['title']}",
        ];

        if (!empty($tef['description'])) {
            $lines[] = "";
            $lines[] = "Description:";
            $lines[] = $tef['description'];
        }

        if (!empty($tef['dtdue'])) {
            $lines[] = "";
            $lines[] = "Due: " . date('M j, Y g:ia', strtotime($tef['dtdue']));
        }

        if (!empty($tef['organizer'])) {
            $lines[] = "";
            $lines[] = "From: {$tef['organizer']['name']} ({$tef['organizer']['email']})";
        }

        if (!empty($tef['location']['address'])) {
            $lines[] = "";
            $lines[] = "Location: {$tef['location']['address']}";
        }

        $lines[] = "";
        $lines[] = "═══════════════════════════════════════";
        $lines[] = "";
        $lines[] = "RESPOND:";
        $lines[] = "• Reply ACCEPT to accept this task";
        $lines[] = "• Reply DECLINE to decline";
        $lines[] = "• Or click: {$tef['actions']['view']}";
        $lines[] = "";
        $lines[] = "---";
        $lines[] = "Sent via Task Juggler | Task ID: {$tef['id']}";

        return implode("\n", $lines);
    }

    private function getNotificationSubject(Task $task, string $type): string
    {
        return match($type) {
            'created' => "[Task Juggler] New task: {$task->title}",
            'accepted' => "[Task Juggler] Task accepted: {$task->title}",
            'declined' => "[Task Juggler] Task declined: {$task->title}",
            'completed' => "[Task Juggler] Task completed: {$task->title}",
            'overdue' => "[Task Juggler] ⚠️ Task overdue: {$task->title}",
            'reminder' => "[Task Juggler] Reminder: {$task->title}",
            default => "[Task Juggler] Update: {$task->title}",
        };
    }

    private function getNotificationBody(Task $task, string $type): string
    {
        $url = config('app.url') . '/api/tasks/' . $task->id;
        
        return match($type) {
            'accepted' => "Your task \"{$task->title}\" has been accepted.\n\nView: {$url}",
            'declined' => "Your task \"{$task->title}\" has been declined.\n\nView: {$url}",
            'completed' => "Your task \"{$task->title}\" has been completed.\n\nView: {$url}",
            default => "Update on task \"{$task->title}\".\n\nView: {$url}",
        };
    }
}
