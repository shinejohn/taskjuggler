<?php

namespace App\Services\TaskJuggler;

use App\Enums\TaskState;
use App\Events\TaskStateChanged;
use App\Models\Task;
use App\Models\TaskAction;
use App\Models\User;
use InvalidArgumentException;

class TaskStateMachine
{
    protected Task $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Get valid transitions from current state
     */
    public function getAvailableTransitions(): array
    {
        return $this->task->state->canTransitionTo();
    }

    /**
     * Check if transition is valid
     */
    public function canTransitionTo(TaskState $state): bool
    {
        return in_array($state, $this->getAvailableTransitions());
    }

    /**
     * Perform state transition
     */
    public function transitionTo(
        TaskState $state, 
        ?User $user = null, 
        ?string $comment = null
    ): bool {
        if (!$this->canTransitionTo($state)) {
            throw new InvalidArgumentException(
                "Cannot transition from {$this->task->state->value} to {$state->value}"
            );
        }

        $fromState = $this->task->state;
        
        // Update task state
        $this->task->state = $state;

        // Update timestamps based on state
        match($state) {
            TaskState::IN_PROGRESS => $this->task->started_at ??= now(),
            TaskState::COMPLETED => $this->task->completed_at = now(),
            default => null,
        };

        $this->task->save();

        // Record action in audit trail
        TaskAction::create([
            'task_id' => $this->task->id,
            'user_id' => $user?->id,
            'action_type' => TaskAction::TYPE_STATE_CHANGED,
            'from_state' => $fromState->value,
            'to_state' => $state->value,
            'comment' => $comment,
        ]);

        // Broadcast event for real-time updates
        event(new TaskStateChanged($this->task, $fromState, $state, $user));

        return true;
    }

    /**
     * Helper methods for common transitions
     */
    public function accept(?User $user = null): bool
    {
        return $this->transitionTo(TaskState::ACCEPTED, $user);
    }

    public function decline(?User $user = null, ?string $reason = null): bool
    {
        return $this->transitionTo(TaskState::DECLINED, $user, $reason);
    }

    public function start(?User $user = null): bool
    {
        return $this->transitionTo(TaskState::IN_PROGRESS, $user);
    }

    public function complete(?User $user = null, ?string $notes = null): bool
    {
        return $this->transitionTo(TaskState::COMPLETED, $user, $notes);
    }

    public function cancel(?User $user = null, ?string $reason = null): bool
    {
        return $this->transitionTo(TaskState::CANCELLED, $user, $reason);
    }

    public function markOverdue(): bool
    {
        if ($this->canTransitionTo(TaskState::OVERDUE)) {
            return $this->transitionTo(TaskState::OVERDUE);
        }
        return false;
    }
}


