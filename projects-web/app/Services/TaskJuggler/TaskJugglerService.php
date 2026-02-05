<?php

namespace App\Services\TaskJuggler;

use App\Enums\TaskChannel;
use App\Enums\TaskState;
use App\Events\TaskCreated;
use App\Events\TaskAssigned;
use App\Models\Task;
use App\Models\TaskAction;
use App\Models\User;
use App\Services\AI\NLPExtractor;
use App\Services\AI\TaskAssignmentAI;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaskJugglerService
{
    public function __construct(
        protected NLPExtractor $nlpExtractor,
        protected TaskAssignmentAI $assignmentAI
    ) {}

    /**
     * Create a new task from any channel
     */
    public function createTask(
        array $data, 
        TaskChannel $channel, 
        ?User $requestor = null
    ): Task {
        return DB::transaction(function () use ($data, $channel, $requestor) {
            // If raw text provided (from email/SMS/voice), extract details
            if (!empty($data['raw_text']) && $this->isNLPChannel($channel)) {
                $extracted = $this->nlpExtractor->extract($data['raw_text']);
                $data = array_merge($extracted, $data); // Original data takes precedence
            }

            // Create the task
            $task = Task::create([
                'organization_id' => $data['organization_id'],
                'project_id' => $data['project_id'],
                'requestor_id' => $requestor?->id ?? $data['requestor_id'],
                'owner_id' => $data['owner_id'] ?? null,
                'parent_id' => $data['parent_id'] ?? null,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'state' => TaskState::PENDING,
                'source_channel' => $channel,
                'source_metadata' => $data['source_metadata'] ?? null,
                'priority' => $data['priority'] ?? 'medium',
                'due_date' => $data['due_date'] ?? null,
                'estimated_hours' => $data['estimated_hours'] ?? null,
                'tags' => $data['tags'] ?? null,
                'extracted_entities' => $data['extracted_entities'] ?? null,
            ]);

            // Record creation action
            TaskAction::create([
                'task_id' => $task->id,
                'user_id' => $requestor?->id,
                'action_type' => TaskAction::TYPE_CREATED,
                'to_state' => TaskState::PENDING->value,
                'channel' => $channel->value,
            ]);

            // If no owner specified, get AI suggestion
            if (!$task->owner_id) {
                $this->suggestOwner($task);
            }

            // Broadcast event
            event(new TaskCreated($task));

            return $task->fresh(['requestor', 'owner', 'project']);
        });
    }

    /**
     * Assign an owner to a task
     */
    public function assignOwner(
        Task $task, 
        User $owner, 
        ?User $assignedBy = null
    ): Task {
        $previousOwner = $task->owner_id;
        
        $task->update(['owner_id' => $owner->id]);

        TaskAction::create([
            'task_id' => $task->id,
            'user_id' => $assignedBy?->id,
            'action_type' => TaskAction::TYPE_ASSIGNED,
            'changes' => [
                'previous_owner_id' => $previousOwner,
                'new_owner_id' => $owner->id,
            ],
        ]);

        event(new TaskAssigned($task, $owner, $assignedBy));

        return $task->fresh(['owner']);
    }

    /**
     * Accept a task
     */
    public function acceptTask(Task $task, User $owner): Task
    {
        $stateMachine = new TaskStateMachine($task);
        $stateMachine->accept($owner);
        return $task->fresh();
    }

    /**
     * Decline a task
     */
    public function declineTask(Task $task, User $owner, string $reason): Task
    {
        $stateMachine = new TaskStateMachine($task);
        $stateMachine->decline($owner, $reason);
        return $task->fresh();
    }

    /**
     * Start working on a task
     */
    public function startTask(Task $task, User $user): Task
    {
        $stateMachine = new TaskStateMachine($task);
        $stateMachine->start($user);
        return $task->fresh();
    }

    /**
     * Complete a task
     */
    public function completeTask(Task $task, User $user, ?string $notes = null): Task
    {
        $stateMachine = new TaskStateMachine($task);
        $stateMachine->complete($user, $notes);
        return $task->fresh();
    }

    /**
     * Cancel a task
     */
    public function cancelTask(Task $task, User $user, ?string $reason = null): Task
    {
        $stateMachine = new TaskStateMachine($task);
        $stateMachine->cancel($user, $reason);
        return $task->fresh();
    }

    /**
     * Add a message/comment to a task
     */
    public function addMessage(
        Task $task, 
        User $user, 
        string $content, 
        string $channel = 'web'
    ): void {
        $task->addMessage($user, $content, $channel);
    }

    /**
     * Update task fields
     */
    public function updateTask(Task $task, array $data, ?User $user = null): Task
    {
        $changes = [];
        
        foreach ($data as $key => $value) {
            if ($task->$key !== $value) {
                $changes[$key] = [
                    'from' => $task->$key,
                    'to' => $value,
                ];
            }
        }

        if (!empty($changes)) {
            $task->update($data);

            TaskAction::create([
                'task_id' => $task->id,
                'user_id' => $user?->id,
                'action_type' => TaskAction::TYPE_UPDATED,
                'changes' => $changes,
            ]);
        }

        return $task->fresh();
    }

    /**
     * Get AI suggestion for task owner
     */
    protected function suggestOwner(Task $task): void
    {
        try {
            $suggestedOwner = $this->assignmentAI->suggestOwner($task);
            
            if ($suggestedOwner) {
                $task->update([
                    'ai_suggestions' => [
                        'suggested_owner' => [
                            'user_id' => $suggestedOwner->id,
                            'user_name' => $suggestedOwner->name,
                            'confidence' => $this->assignmentAI->getLastConfidence(),
                            'reason' => $this->assignmentAI->getLastReason(),
                        ],
                    ],
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get AI owner suggestion', [
                'task_id' => $task->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Check if channel uses NLP processing
     */
    protected function isNLPChannel(TaskChannel $channel): bool
    {
        return in_array($channel, [
            TaskChannel::EMAIL,
            TaskChannel::SMS,
            TaskChannel::VOICE,
        ]);
    }

    /**
     * Check and mark overdue tasks
     */
    public function processOverdueTasks(): int
    {
        $count = 0;
        
        $overdueTasks = Task::where('due_date', '<', now())
            ->whereIn('state', [TaskState::ACCEPTED, TaskState::IN_PROGRESS])
            ->get();

        foreach ($overdueTasks as $task) {
            try {
                $stateMachine = new TaskStateMachine($task);
                if ($stateMachine->markOverdue()) {
                    $count++;
                }
            } catch (\Exception $e) {
                // Log error but continue
                Log::warning("Failed to mark task {$task->id} as overdue: {$e->getMessage()}");
            }
        }

        return $count;
    }
}


