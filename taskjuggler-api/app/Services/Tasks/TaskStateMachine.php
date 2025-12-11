<?php

namespace App\Services\Tasks;

use App\Models\Task;
use App\Models\TaskAction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaskStateMachine
{
    /**
     * Valid status transitions
     */
    private const VALID_TRANSITIONS = [
        'pending' => ['accepted', 'declined', 'watching', 'cancelled'],
        'accepted' => ['in_progress', 'completed', 'cancelled'],
        'declined' => ['pending'],
        'watching' => ['accepted', 'declined'],
        'in_progress' => ['completed', 'cancelled'],
        'completed' => [], // Terminal state
        'cancelled' => ['pending'], // Can be reopened
        'overdue' => ['in_progress', 'completed', 'cancelled'],
    ];

    /**
     * Transition task status with validation and logging
     *
     * @param Task $task
     * @param string $newStatus
     * @param User $actor
     * @param string|null $reason
     * @return Task
     * @throws \Exception
     */
    public function transitionTaskStatus(
        Task $task,
        string $newStatus,
        User $actor,
        ?string $reason = null
    ): Task {
        $currentStatus = $task->status;

        // Validate transition
        if (!$this->isValidTransition($currentStatus, $newStatus)) {
            throw new \Exception(
                "Invalid status transition from '{$currentStatus}' to '{$newStatus}'. " .
                "Allowed transitions: " . implode(', ', $this->getValidTransitions($currentStatus))
            );
        }

        return DB::transaction(function () use ($task, $currentStatus, $newStatus, $actor, $reason) {
            // Log the action
            TaskAction::create([
                'task_id' => $task->id,
                'user_id' => $actor->id,
                'action_type' => 'status_change',
                'action_data' => [
                    'from' => $currentStatus,
                    'to' => $newStatus,
                    'reason' => $reason,
                ],
                'previous_value' => $currentStatus,
                'new_value' => $newStatus,
                'reason' => $reason,
            ]);

            // Update task status
            $updateData = ['status' => $newStatus];

            // Set completed_at if transitioning to completed
            if ($newStatus === Task::STATUS_COMPLETED) {
                $updateData['completed_at'] = now();
            }

            // Clear completed_at if moving away from completed
            if ($currentStatus === Task::STATUS_COMPLETED && $newStatus !== Task::STATUS_COMPLETED) {
                $updateData['completed_at'] = null;
            }

            $task->update($updateData);

            // Add system message for status change
            try {
                $messageService = app(TaskMessageService::class);
                $messageService->addSystemMessage(
                    $task,
                    "{$actor->name} changed status from {$currentStatus} to {$newStatus}" . ($reason ? ": {$reason}" : "")
                );
            } catch (\Exception $e) {
                // Don't fail if message service isn't available
                Log::warning('Failed to add system message', ['error' => $e->getMessage()]);
            }

            Log::info('Task status transitioned', [
                'task_id' => $task->id,
                'from' => $currentStatus,
                'to' => $newStatus,
                'actor_id' => $actor->id,
            ]);

            return $task->fresh();
        });
    }

    /**
     * Check if a status transition is valid
     */
    public function isValidTransition(string $currentStatus, string $newStatus): bool
    {
        if ($currentStatus === $newStatus) {
            return true; // No change is always valid
        }

        $allowedTransitions = self::VALID_TRANSITIONS[$currentStatus] ?? [];

        return in_array($newStatus, $allowedTransitions);
    }

    /**
     * Get valid transitions for a status
     */
    public function getValidTransitions(string $status): array
    {
        return self::VALID_TRANSITIONS[$status] ?? [];
    }

    /**
     * Accept a task (transition from pending to accepted)
     */
    public function acceptTask(Task $task, User $actor, ?string $reason = null): Task
    {
        return $this->transitionTaskStatus($task, Task::STATUS_ACCEPTED, $actor, $reason);
    }

    /**
     * Decline a task (transition from pending to declined)
     */
    public function declineTask(Task $task, User $actor, ?string $reason = null): Task
    {
        return $this->transitionTaskStatus($task, 'declined', $actor, $reason);
    }

    /**
     * Watch a task (transition from pending to watching)
     */
    public function watchTask(Task $task, User $actor, ?string $reason = null): Task
    {
        return $this->transitionTaskStatus($task, 'watching', $actor, $reason);
    }

    /**
     * Complete a task (transition to completed)
     */
    public function completeTask(Task $task, User $actor, ?string $reason = null): Task
    {
        return $this->transitionTaskStatus($task, Task::STATUS_COMPLETED, $actor, $reason);
    }

    /**
     * Mark task as overdue
     */
    public function markOverdue(Task $task, User $actor, ?string $reason = null): Task
    {
        // Overdue can be set from any status if due_date has passed
        if ($task->due_date && $task->due_date->isPast() && $task->status !== Task::STATUS_COMPLETED) {
            return $this->transitionTaskStatus($task, 'overdue', $actor, $reason);
        }

        return $task;
    }
}
