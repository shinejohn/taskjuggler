<?php

namespace App\Services\MessageRouter\Adapters;

use App\Models\Task;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use Illuminate\Support\Facades\Log;

class InAppAdapter implements ChannelAdapter
{
    use HandlesTefFormats;
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function getChannel(): string
    {
        return 'in_app';
    }

    public function canSend(string $recipient): bool
    {
        // In-app notifications always work if user exists
        return User::where('id', $recipient)->exists();
    }

    public function sendTask(array $tef, string $recipient): bool
    {
        $user = User::find($recipient);
        if (!$user) {
            return false;
        }

        // Extract task data (handles both TEF 1.0 and 2.0.0)
        // Check if this is a TEF 2.0.0 envelope
        if (isset($tef['message_type']) && isset($tef['task'])) {
            // TEF 2.0.0 envelope - extract task from envelope
            $taskData = \App\TaskExchange\TaskExchangeFormat::toTaskData($tef['task']);
            $sourceRef = $tef['task']['task_id'] ?? $tef['message_id'] ?? null;
        } else {
            // TEF 1.0 or direct TEF 2.0.0 task format
            $taskData = \App\TaskExchange\TaskExchangeFormat::toTaskData($tef);
            $sourceRef = $tef['uid'] ?? $tef['task_id'] ?? null;
        }
        
        $taskData['requestor_id'] = $user->id;
        $taskData['source_channel'] = 'in_app';
        $taskData['source_channel_ref'] = $sourceRef;

        $task = \App\Models\Task::create($taskData);

        // Send in-app notification
        $this->notificationService->send(
            $user,
            'task_received',
            'New Task',
            "You've been assigned a task: {$task->title}",
            ['task_id' => $task->id]
        );

        return true;
    }

    public function sendNotification(User $user, Task $task, string $type): bool
    {
        $messages = [
            'created' => ['title' => 'New Task', 'body' => "Task: {$task->title}"],
            'accepted' => ['title' => 'Task Accepted', 'body' => "Task accepted: {$task->title}"],
            'declined' => ['title' => 'Task Declined', 'body' => "Task declined: {$task->title}"],
            'completed' => ['title' => 'Task Completed', 'body' => "Task completed: {$task->title}"],
            'overdue' => ['title' => 'Task Overdue', 'body' => "⚠️ Task overdue: {$task->title}"],
        ];

        $message = $messages[$type] ?? ['title' => 'Task Update', 'body' => "Update on task: {$task->title}"];

        $this->notificationService->send(
            $user,
            "task.{$type}",
            $message['title'],
            $message['body'],
            ['task_id' => $task->id]
        );

        return true;
    }

    public function formatTask(array $tef): string
    {
        // Ensure we have normalized task data
        $taskData = $this->extractTaskData($tef);
        return "Task: {$taskData['title']}";
    }
}
