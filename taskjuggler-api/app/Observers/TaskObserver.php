<?php

namespace App\Observers;

use App\Models\Task;
use App\Services\TEF\TrustScoringService;
use App\Models\Relationship;
use App\Models\RelationshipHistory;
use Illuminate\Support\Facades\Log;

/**
 * Task Observer
 * 
 * Handles task lifecycle events and updates trust scores
 */
class TaskObserver
{
    public function __construct(
        private TrustScoringService $trustService
    ) {}

    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        // Task created - no trust score update needed yet
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        // Check if status changed
        if ($task->wasChanged('status')) {
            $this->handleStatusChange($task);
        }
    }

    /**
     * Handle the Task "completed" event.
     */
    public function completed(Task $task): void
    {
        $this->updateTrustScoreForTask($task, RelationshipHistory::OUTCOME_SUCCESS);
    }

    /**
     * Handle status change
     */
    private function handleStatusChange(Task $task): void
    {
        $newStatus = $task->status;
        $oldStatus = $task->getOriginal('status');

        $outcome = match ($newStatus) {
            Task::STATUS_COMPLETED => RelationshipHistory::OUTCOME_SUCCESS,
            Task::STATUS_CANCELLED => RelationshipHistory::OUTCOME_CANCELLED,
            Task::STATUS_DECLINED => RelationshipHistory::OUTCOME_FAILURE,
            default => null,
        };

        if ($outcome) {
            $this->updateTrustScoreForTask($task, $outcome);
        }
    }

    /**
     * Update trust score for task
     */
    private function updateTrustScoreForTask(Task $task, string $outcome): void
    {
        if (!$task->requestor_id || !$task->owner_id) {
            return;
        }

        try {
            // Find relationship between requestor and owner
            $requestorActor = \App\Models\Actor::where('user_id', $task->requestor_id)
                ->where('actor_type', \App\Models\Actor::TYPE_HUMAN)
                ->first();

            $ownerActor = \App\Models\Actor::where('user_id', $task->owner_id)
                ->whereIn('actor_type', [
                    \App\Models\Actor::TYPE_HUMAN,
                    \App\Models\Actor::TYPE_AI_AGENT,
                    \App\Models\Actor::TYPE_IOT_DEVICE,
                ])
                ->first();

            if (!$requestorActor || !$ownerActor) {
                return;
            }

            // Find or create relationship
            $relationship = Relationship::where(function ($query) use ($requestorActor, $ownerActor) {
                $query->where('actor_a_id', $requestorActor->id)
                    ->where('actor_b_id', $ownerActor->id);
            })->orWhere(function ($query) use ($requestorActor, $ownerActor) {
                $query->where('actor_a_id', $ownerActor->id)
                    ->where('actor_b_id', $requestorActor->id);
            })->first();

            if ($relationship) {
                $this->trustService->recordTaskOutcome($task, $relationship, $outcome);
            }
        } catch (\Exception $e) {
            Log::error('Failed to update trust score', [
                'task_id' => $task->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
