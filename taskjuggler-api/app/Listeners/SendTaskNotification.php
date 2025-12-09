<?php

namespace App\Listeners;

use App\Events\TaskCreated;
use App\Events\TaskAssigned;
use App\Events\TaskCompleted;
use App\Services\Notifications\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTaskNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function handle(TaskCreated|TaskAssigned|TaskCompleted $event): void
    {
        $task = $event->task;
        $eventType = match (get_class($event)) {
            TaskCreated::class => 'created',
            TaskAssigned::class => 'assigned',
            TaskCompleted::class => 'completed',
        };

        // Notify requestor
        $this->notificationService->sendTaskNotification(
            $task->requestor,
            $eventType,
            [
                'id' => $task->id,
                'title' => $task->title,
            ]
        );

        // Notify assignee if different from requestor
        if ($task->owner_id && $task->owner_id !== $task->requestor_id) {
            $this->notificationService->sendTaskNotification(
                $task->owner,
                $eventType,
                [
                    'id' => $task->id,
                    'title' => $task->title,
                ]
            );
        }
    }
}
