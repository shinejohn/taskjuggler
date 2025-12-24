<?php

namespace App\Services\MessageRouter\Adapters;

use App\Models\Task;
use App\Models\User;
use App\TaskExchange\TaskExchangeFormat;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailAdapter implements ChannelAdapter
{
    use HandlesTefFormats;
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
        // Extract task data (handles both TEF 1.0 and 2.0.0)
        $taskData = $this->extractTaskData($tef);
        
        $subject = "Task: {$taskData['title']}";
        $body = $this->formatTask($taskData);

        // Create .tef file attachment (use original format)
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
        // Ensure we have normalized task data
        $taskData = $this->extractTaskData($tef);
        
        $lines = [
            "📋 TASK REQUEST",
            "═══════════════════════════════════════",
            "",
            "Title: {$taskData['title']}",
        ];

        if (!empty($taskData['description'])) {
            $lines[] = "";
            $lines[] = "Description:";
            $lines[] = $taskData['description'];
        }

        if (!empty($taskData['dtdue'])) {
            $lines[] = "";
            $lines[] = "Due: " . date('M j, Y g:ia', strtotime($taskData['dtdue']));
        }

        if (!empty($taskData['organizer'])) {
            $organizerInfo = $taskData['organizer']['name'] ?? '';
            if (!empty($taskData['organizer']['email'])) {
                $organizerInfo .= " ({$taskData['organizer']['email']})";
            }
            $lines[] = "";
            $lines[] = "From: {$organizerInfo}";
        }

        if (!empty($taskData['location']['address'])) {
            $lines[] = "";
            $lines[] = "Location: {$taskData['location']['address']}";
        }

        $lines[] = "";
        $lines[] = "═══════════════════════════════════════";
        $lines[] = "";
        $lines[] = "RESPOND:";
        $lines[] = "• Reply ACCEPT to accept this task";
        $lines[] = "• Reply DECLINE to decline";
        if (!empty($taskData['actions']['view'])) {
            $lines[] = "• Or click: {$taskData['actions']['view']}";
        }
        $lines[] = "";
        $lines[] = "---";
        $taskId = $taskData['id'] ?? $taskData['task_id'] ?? 'unknown';
        $lines[] = "Sent via Task Juggler | Task ID: {$taskId}";

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
