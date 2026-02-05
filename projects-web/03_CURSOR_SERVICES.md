# 03 - Cursor Services Guide

All service classes for 4 Projects.ai including TaskJuggler engine, AI services, and channel handlers.

---

## Directory Structure

```
app/Services/
├── AI/
│   ├── OpenRouterService.php
│   ├── NLPExtractor.php
│   ├── TaskAssignmentAI.php
│   └── PredictiveAnalytics.php
└── TaskJuggler/
    ├── TaskJugglerService.php
    ├── TaskStateMachine.php
    ├── TEFExporter.php
    └── Channels/
        ├── ChannelInterface.php
        ├── WebChannel.php
        ├── EmailChannel.php
        ├── SMSChannel.php
        ├── VoiceChannel.php
        └── SlackChannel.php
```

---

## TaskJuggler Services

### TaskStateMachine
```php
<?php
// app/Services/TaskJuggler/TaskStateMachine.php

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
```

### TaskJugglerService
```php
<?php
// app/Services/TaskJuggler/TaskJugglerService.php

namespace App\Services\TaskJuggler;

use App\Enums\TaskChannel;
use App\Enums\TaskState;
use App\Events\TaskCreated;
use App\Events\TaskAssigned;
use App\Models\Task;
use App\Models\TaskAction;
use App\Models\User;
use App\Models\Project;
use App\Services\AI\NLPExtractor;
use App\Services\AI\TaskAssignmentAI;
use Illuminate\Support\Facades\DB;

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
                \Log::warning("Failed to mark task {$task->id} as overdue: {$e->getMessage()}");
            }
        }

        return $count;
    }
}
```

### TEFExporter
```php
<?php
// app/Services/TaskJuggler/TEFExporter.php

namespace App\Services\TaskJuggler;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Support\Collection;

class TEFExporter
{
    const VERSION = '1.0';

    /**
     * Export a single task to TEF format
     */
    public function exportTask(Task $task): array
    {
        $task->load(['requestor', 'owner', 'actions.user', 'messages.user']);
        
        return $this->formatTask($task);
    }

    /**
     * Export all tasks from a project
     */
    public function exportProject(Project $project): array
    {
        $project->load(['owner', 'members.user']);
        $tasks = $project->tasks()
            ->with(['requestor', 'owner', 'actions.user', 'messages.user'])
            ->get();

        return [
            'tef_version' => self::VERSION,
            'export_date' => now()->toIso8601String(),
            'project' => $this->formatProject($project),
            'tasks' => $tasks->map(fn($task) => $this->formatTask($task))->toArray(),
        ];
    }

    /**
     * Import tasks from TEF format
     */
    public function importTasks(array $tefData, Project $project, User $importer): Collection
    {
        $importedTasks = collect();
        $userMapping = $this->buildUserMapping($project);

        foreach ($tefData['tasks'] ?? [] as $taskData) {
            $task = $this->importTask($taskData, $project, $importer, $userMapping);
            $importedTasks->push($task);
        }

        return $importedTasks;
    }

    /**
     * Format a task for TEF export
     */
    protected function formatTask(Task $task): array
    {
        return [
            'tef_version' => self::VERSION,
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'state' => $task->state->value,
            'priority' => $task->priority->value,
            'source_channel' => $task->source_channel->value,
            'requestor' => $task->requestor ? [
                'id' => $task->requestor_id,
                'name' => $task->requestor->name,
                'email' => $task->requestor->email,
            ] : null,
            'owner' => $task->owner ? [
                'id' => $task->owner_id,
                'name' => $task->owner->name,
                'email' => $task->owner->email,
            ] : null,
            'due_date' => $task->due_date?->toIso8601String(),
            'started_at' => $task->started_at?->toIso8601String(),
            'completed_at' => $task->completed_at?->toIso8601String(),
            'estimated_hours' => $task->estimated_hours,
            'actual_hours' => $task->actual_hours,
            'tags' => $task->tags,
            'custom_fields' => $task->custom_fields,
            'created_at' => $task->created_at->toIso8601String(),
            'updated_at' => $task->updated_at->toIso8601String(),
            'actions' => $task->actions->map(fn($action) => [
                'type' => $action->action_type,
                'user' => $action->user?->name,
                'from_state' => $action->from_state,
                'to_state' => $action->to_state,
                'comment' => $action->comment,
                'timestamp' => $action->created_at->toIso8601String(),
            ])->toArray(),
            'messages' => $task->messages->map(fn($message) => [
                'author' => $message->user->name,
                'author_email' => $message->user->email,
                'content' => $message->content,
                'channel' => $message->channel,
                'timestamp' => $message->created_at->toIso8601String(),
            ])->toArray(),
        ];
    }

    /**
     * Format project metadata
     */
    protected function formatProject(Project $project): array
    {
        return [
            'id' => $project->id,
            'name' => $project->name,
            'code' => $project->code,
            'description' => $project->description,
            'methodology' => $project->methodology->value,
            'status' => $project->status->value,
            'owner' => [
                'name' => $project->owner->name,
                'email' => $project->owner->email,
            ],
            'members' => $project->members->map(fn($member) => [
                'name' => $member->name,
                'email' => $member->email,
                'role' => $member->pivot->role,
            ])->toArray(),
        ];
    }

    /**
     * Build user mapping for import
     */
    protected function buildUserMapping(Project $project): array
    {
        $mapping = [];
        
        foreach ($project->members as $member) {
            $mapping[strtolower($member->email)] = $member->id;
        }
        
        return $mapping;
    }

    /**
     * Import a single task
     */
    protected function importTask(
        array $taskData, 
        Project $project, 
        User $importer,
        array $userMapping
    ): Task {
        // Map user emails to IDs
        $ownerId = null;
        if (isset($taskData['owner']['email'])) {
            $ownerId = $userMapping[strtolower($taskData['owner']['email'])] ?? null;
        }

        return Task::create([
            'organization_id' => $project->organization_id,
            'project_id' => $project->id,
            'requestor_id' => $importer->id,
            'owner_id' => $ownerId,
            'title' => $taskData['title'],
            'description' => $taskData['description'] ?? null,
            'state' => 'pending', // Always start as pending on import
            'source_channel' => 'web',
            'source_metadata' => [
                'imported_from_tef' => true,
                'original_id' => $taskData['id'] ?? null,
                'import_date' => now()->toIso8601String(),
            ],
            'priority' => $taskData['priority'] ?? 'medium',
            'due_date' => isset($taskData['due_date']) ? \Carbon\Carbon::parse($taskData['due_date']) : null,
            'estimated_hours' => $taskData['estimated_hours'] ?? null,
            'tags' => $taskData['tags'] ?? null,
            'custom_fields' => $taskData['custom_fields'] ?? null,
        ]);
    }
}
```

---

## AI Services

### NLPExtractor
```php
<?php
// app/Services/AI/NLPExtractor.php

namespace App\Services\AI;

use Carbon\Carbon;

class NLPExtractor
{
    public function __construct(
        protected OpenRouterService $openRouter
    ) {}

    /**
     * Extract task details from raw text
     */
    public function extract(string $text): array
    {
        $prompt = <<<PROMPT
Extract task information from the following text and return a JSON object with these fields:
- title: A concise task title (max 100 characters, action-oriented)
- description: The full task description with context
- priority: One of "low", "medium", "high", or "critical" based on urgency words like ASAP, urgent, immediately
- due_date: ISO 8601 date string if a deadline is mentioned (e.g., "by Friday" = this Friday), otherwise null
- owner_mention: Name or email of person mentioned as responsible (after @ or words like "assigned to"), null if none
- tags: Array of relevant category tags (max 5)
- extracted_entities: Object with named entities like {people: [], companies: [], dates: []}

Current date for reference: {$this->getCurrentDate()}

Text to analyze:
---
{$text}
---

Respond with valid JSON only, no markdown formatting.
PROMPT;

        $result = $this->openRouter->extractJson($prompt);

        if (!$result) {
            // Fallback: basic extraction
            return $this->basicExtraction($text);
        }

        return [
            'title' => $this->sanitizeTitle($result['title'] ?? $this->extractTitleFallback($text)),
            'description' => $result['description'] ?? $text,
            'priority' => $this->validatePriority($result['priority'] ?? 'medium'),
            'due_date' => $this->parseDueDate($result['due_date'] ?? null),
            'owner_mention' => $result['owner_mention'] ?? null,
            'tags' => array_slice($result['tags'] ?? [], 0, 5),
            'extracted_entities' => $result['extracted_entities'] ?? [],
        ];
    }

    /**
     * Basic extraction without AI (fallback)
     */
    protected function basicExtraction(string $text): array
    {
        return [
            'title' => $this->extractTitleFallback($text),
            'description' => $text,
            'priority' => $this->detectPriorityFromKeywords($text),
            'due_date' => $this->extractDateFromText($text),
            'owner_mention' => $this->extractMention($text),
            'tags' => [],
            'extracted_entities' => [],
        ];
    }

    /**
     * Extract title from first sentence
     */
    protected function extractTitleFallback(string $text): string
    {
        $firstLine = strtok($text, "\n");
        $firstSentence = preg_split('/[.!?]/', $firstLine)[0] ?? $firstLine;
        return $this->sanitizeTitle($firstSentence);
    }

    /**
     * Clean and truncate title
     */
    protected function sanitizeTitle(string $title): string
    {
        $title = trim(preg_replace('/\s+/', ' ', $title));
        return mb_substr($title, 0, 100);
    }

    /**
     * Validate priority value
     */
    protected function validatePriority(string $priority): string
    {
        $valid = ['low', 'medium', 'high', 'critical'];
        return in_array(strtolower($priority), $valid) ? strtolower($priority) : 'medium';
    }

    /**
     * Detect priority from keywords
     */
    protected function detectPriorityFromKeywords(string $text): string
    {
        $text = strtolower($text);
        
        if (preg_match('/\b(asap|urgent|immediately|critical|emergency)\b/', $text)) {
            return 'critical';
        }
        if (preg_match('/\b(important|high priority|soon)\b/', $text)) {
            return 'high';
        }
        if (preg_match('/\b(when you can|low priority|whenever)\b/', $text)) {
            return 'low';
        }
        
        return 'medium';
    }

    /**
     * Parse due date from various formats
     */
    protected function parseDueDate(?string $date): ?Carbon
    {
        if (!$date) return null;
        
        try {
            return Carbon::parse($date);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Extract date from text using patterns
     */
    protected function extractDateFromText(string $text): ?Carbon
    {
        // Match common patterns
        $patterns = [
            '/by (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i',
            '/by (\d{1,2}\/\d{1,2}\/\d{2,4})/',
            '/due (\d{1,2}\/\d{1,2}\/\d{2,4})/',
            '/by end of (week|month|day)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                try {
                    return Carbon::parse($matches[1]);
                } catch (\Exception $e) {
                    continue;
                }
            }
        }

        return null;
    }

    /**
     * Extract @mention from text
     */
    protected function extractMention(string $text): ?string
    {
        if (preg_match('/@(\w+)/', $text, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Get current date for AI context
     */
    protected function getCurrentDate(): string
    {
        return now()->format('Y-m-d (l)');
    }
}
```

### TaskAssignmentAI
```php
<?php
// app/Services/AI/TaskAssignmentAI.php

namespace App\Services\AI;

use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use Illuminate\Support\Collection;

class TaskAssignmentAI
{
    protected float $lastConfidence = 0;
    protected string $lastReason = '';

    public function __construct(
        protected OpenRouterService $openRouter
    ) {}

    /**
     * Suggest the best owner for a task
     */
    public function suggestOwner(Task $task): ?User
    {
        $project = $task->project;
        $candidates = $project->members()->get();

        if ($candidates->isEmpty()) {
            return null;
        }

        // Gather candidate data
        $candidateData = $this->gatherCandidateData($candidates, $project);

        // If only one candidate, return them
        if ($candidates->count() === 1) {
            $this->lastConfidence = 100;
            $this->lastReason = 'Only team member available';
            return $candidates->first();
        }

        // Use AI to select best candidate
        $prompt = $this->buildAssignmentPrompt($task, $candidateData);
        $result = $this->openRouter->extractJson($prompt);

        if (!$result || !isset($result['selected_user_id'])) {
            return $this->fallbackSelection($candidateData);
        }

        $this->lastConfidence = $result['confidence'] ?? 75;
        $this->lastReason = $result['reason'] ?? 'AI suggested based on analysis';

        return User::find($result['selected_user_id']);
    }

    /**
     * Get last confidence score
     */
    public function getLastConfidence(): float
    {
        return $this->lastConfidence;
    }

    /**
     * Get last reason
     */
    public function getLastReason(): string
    {
        return $this->lastReason;
    }

    /**
     * Gather data about each candidate
     */
    protected function gatherCandidateData(Collection $candidates, Project $project): Collection
    {
        return $candidates->map(function (User $user) use ($project) {
            // Get task statistics for this user in this project
            $stats = Task::where('owner_id', $user->id)
                ->where('project_id', $project->id)
                ->selectRaw("
                    COUNT(*) as total_tasks,
                    SUM(CASE WHEN state IN ('pending', 'accepted', 'in_progress') THEN 1 ELSE 0 END) as active_tasks,
                    SUM(CASE WHEN state = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                    AVG(CASE WHEN completed_at IS NOT NULL AND started_at IS NOT NULL THEN 
                        EXTRACT(EPOCH FROM (completed_at - started_at))/3600 
                    END) as avg_completion_hours
                ")
                ->first();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'skills' => $user->skills ?? [],
                'capacity_hours' => $user->capacity_hours_per_week,
                'active_tasks' => (int) ($stats->active_tasks ?? 0),
                'completed_tasks' => (int) ($stats->completed_tasks ?? 0),
                'avg_completion_hours' => round($stats->avg_completion_hours ?? 0, 1),
                'workload_hours' => $user->getWorkloadHours(),
            ];
        });
    }

    /**
     * Build prompt for AI assignment
     */
    protected function buildAssignmentPrompt(Task $task, Collection $candidateData): string
    {
        $candidatesText = $candidateData->map(function ($c) {
            $skills = !empty($c['skills']) ? implode(', ', $c['skills']) : 'Not specified';
            return "- {$c['name']} (ID: {$c['id']}): " .
                   "Active tasks: {$c['active_tasks']}, " .
                   "Completed: {$c['completed_tasks']}, " .
                   "Workload: {$c['workload_hours']}/{$c['capacity_hours']} hours, " .
                   "Avg completion time: {$c['avg_completion_hours']}h, " .
                   "Skills: {$skills}";
        })->join("\n");

        $tags = $task->tags ? implode(', ', $task->tags) : 'None';

        return <<<PROMPT
You are a project management AI. Select the best team member to assign this task to.

TASK DETAILS:
- Title: {$task->title}
- Description: {$task->description}
- Priority: {$task->priority->value}
- Tags: {$tags}
- Estimated Hours: {$task->estimated_hours}

TEAM MEMBERS:
{$candidatesText}

SELECTION CRITERIA (in order of importance):
1. Skills match - prefer members whose skills match task tags/description
2. Workload balance - prefer members with lower current workload relative to capacity
3. Track record - prefer members with good completion rates
4. Availability - consider members with fewer active tasks

Return JSON with:
- selected_user_id: UUID of the best candidate
- confidence: 0-100 confidence score
- reason: Brief explanation (1-2 sentences)
PROMPT;
    }

    /**
     * Fallback selection when AI fails
     */
    protected function fallbackSelection(Collection $candidateData): ?User
    {
        // Select candidate with lowest active tasks
        $selected = $candidateData->sortBy('active_tasks')->first();
        
        if ($selected) {
            $this->lastConfidence = 50;
            $this->lastReason = 'Assigned to member with lowest workload (AI fallback)';
            return User::find($selected['id']);
        }

        return null;
    }
}
```

### PredictiveAnalytics
```php
<?php
// app/Services/AI/PredictiveAnalytics.php

namespace App\Services\AI;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Support\Collection;

class PredictiveAnalytics
{
    public function __construct(
        protected OpenRouterService $openRouter
    ) {}

    /**
     * Calculate overdue risk score for a task (0-100)
     */
    public function calculateOverdueRisk(Task $task): float
    {
        // If no due date, no risk
        if (!$task->due_date) {
            return 0;
        }

        // If already completed/cancelled, no risk
        if ($task->state->isTerminal()) {
            return 0;
        }

        $factors = [];

        // Factor 1: Time remaining (40% weight)
        $daysUntilDue = now()->diffInDays($task->due_date, false);
        if ($daysUntilDue < 0) {
            $factors['time'] = 100; // Already overdue
        } elseif ($daysUntilDue === 0) {
            $factors['time'] = 80;
        } elseif ($daysUntilDue <= 2) {
            $factors['time'] = 60;
        } elseif ($daysUntilDue <= 7) {
            $factors['time'] = 30;
        } else {
            $factors['time'] = max(0, 20 - $daysUntilDue);
        }

        // Factor 2: Task state (30% weight)
        $factors['state'] = match($task->state->value) {
            'pending' => 70,      // Not even accepted yet
            'accepted' => 50,     // Accepted but not started
            'in_progress' => 20,  // Work in progress
            default => 0,
        };

        // Factor 3: Owner workload (20% weight)
        $factors['workload'] = 0;
        if ($task->owner) {
            $activeTaskCount = $task->owner->getActiveTaskCount();
            $factors['workload'] = min(100, $activeTaskCount * 10);
        }

        // Factor 4: Task complexity (10% weight)
        $factors['complexity'] = match($task->priority->value) {
            'critical' => 50,
            'high' => 30,
            'medium' => 10,
            'low' => 0,
        };

        // Calculate weighted score
        $score = 
            ($factors['time'] * 0.4) +
            ($factors['state'] * 0.3) +
            ($factors['workload'] * 0.2) +
            ($factors['complexity'] * 0.1);

        return round(min(100, max(0, $score)), 2);
    }

    /**
     * Calculate project health score (0-100)
     */
    public function calculateProjectHealth(Project $project): int
    {
        $stats = $project->getTaskStats();
        
        if ($stats['total'] === 0) {
            return 100; // No tasks = healthy
        }

        $score = 100;

        // Penalty for overdue tasks (up to -40 points)
        $overdueRatio = $stats['overdue'] / $stats['total'];
        $score -= $overdueRatio * 40;

        // Penalty for too many pending tasks (up to -20 points)
        $pendingRatio = $stats['pending'] / $stats['total'];
        if ($pendingRatio > 0.5) {
            $score -= ($pendingRatio - 0.5) * 40;
        }

        // Bonus for completed tasks (up to +10 points)
        $completionRatio = $stats['completed'] / $stats['total'];
        $score += $completionRatio * 10;

        return max(0, min(100, (int) round($score)));
    }

    /**
     * Predict project completion probability
     */
    public function predictCompletion(Project $project): array
    {
        $stats = $project->getTaskStats();
        $health = $this->calculateProjectHealth($project);
        
        // Calculate velocity (tasks completed per week)
        $completedLastWeek = $project->tasks()
            ->where('state', 'completed')
            ->where('completed_at', '>=', now()->subWeek())
            ->count();

        $remainingTasks = $stats['pending'] + $stats['active'];
        
        // Estimate weeks to complete
        $velocity = max($completedLastWeek, 1);
        $estimatedWeeks = ceil($remainingTasks / $velocity);

        // On-time probability based on health and deadline
        $probability = min(100, $health + ($stats['completed'] > 0 ? 10 : 0));

        return [
            'health_score' => $health,
            'velocity_per_week' => $completedLastWeek,
            'remaining_tasks' => $remainingTasks,
            'estimated_weeks' => $estimatedWeeks,
            'on_time_probability' => $probability,
        ];
    }

    /**
     * Identify bottlenecks in a project
     */
    public function identifyBottlenecks(Project $project): array
    {
        $bottlenecks = [];

        // Check for users with too many tasks
        $overloadedUsers = $project->members()
            ->withCount(['ownedTasks' => function ($query) use ($project) {
                $query->where('project_id', $project->id)
                      ->whereIn('state', ['pending', 'accepted', 'in_progress']);
            }])
            ->having('owned_tasks_count', '>', 10)
            ->get();

        foreach ($overloadedUsers as $user) {
            $bottlenecks[] = [
                'type' => 'overloaded_user',
                'severity' => 'high',
                'description' => "{$user->name} has {$user->owned_tasks_count} active tasks",
                'suggestion' => "Consider redistributing tasks from {$user->name}",
            ];
        }

        // Check for blocked tasks (dependencies)
        $blockedTasks = Task::where('project_id', $project->id)
            ->whereIn('state', ['pending', 'accepted'])
            ->whereHas('dependencies', function ($query) {
                $query->whereHas('dependsOn', function ($q) {
                    $q->whereNotIn('state', ['completed', 'cancelled']);
                });
            })
            ->count();

        if ($blockedTasks > 0) {
            $bottlenecks[] = [
                'type' => 'blocked_tasks',
                'severity' => 'medium',
                'description' => "{$blockedTasks} tasks are blocked by dependencies",
                'suggestion' => 'Focus on completing blocking tasks first',
            ];
        }

        // Check for old pending tasks
        $staleTasks = Task::where('project_id', $project->id)
            ->where('state', 'pending')
            ->where('created_at', '<', now()->subWeek())
            ->count();

        if ($staleTasks > 0) {
            $bottlenecks[] = [
                'type' => 'stale_tasks',
                'severity' => 'medium',
                'description' => "{$staleTasks} tasks have been pending for over a week",
                'suggestion' => 'Review and assign or close stale tasks',
            ];
        }

        return $bottlenecks;
    }
}
```

---

## Queue Jobs

### ProcessIncomingEmail
```php
<?php
// app/Jobs/ProcessIncomingEmail.php

namespace App\Jobs;

use App\Enums\TaskChannel;
use App\Models\User;
use App\Models\Project;
use App\Services\TaskJuggler\TaskJugglerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessIncomingEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        protected array $emailData
    ) {}

    public function handle(TaskJugglerService $taskJuggler): void
    {
        $from = $this->emailData['from'];
        $subject = $this->emailData['subject'];
        $body = $this->emailData['body'];
        $cc = $this->emailData['cc'] ?? [];

        // Find requestor
        $requestor = User::where('email', $from)->first();
        if (!$requestor) {
            Log::warning("Email from unknown user: {$from}");
            return;
        }

        // Find project
        $project = $this->findProject($subject, $requestor);
        if (!$project) {
            Log::warning("Could not determine project for email from: {$from}");
            return;
        }

        // Find owner from CC
        $owner = null;
        if (!empty($cc)) {
            $owner = User::whereIn('email', $cc)
                ->where('organization_id', $requestor->organization_id)
                ->first();
        }

        // Create task
        $task = $taskJuggler->createTask([
            'organization_id' => $project->organization_id,
            'project_id' => $project->id,
            'owner_id' => $owner?->id,
            'title' => $this->cleanSubject($subject),
            'raw_text' => $body,
            'source_metadata' => [
                'email_from' => $from,
                'email_subject' => $subject,
                'email_cc' => $cc,
            ],
        ], TaskChannel::EMAIL, $requestor);

        Log::info("Created task {$task->id} from email");
    }

    protected function findProject(string $subject, User $user): ?Project
    {
        // Look for #project-code
        if (preg_match('/#([\w-]+)/', $subject, $matches)) {
            $project = Project::where('organization_id', $user->organization_id)
                ->where(fn($q) => $q->where('code', $matches[1])->orWhere('slug', $matches[1]))
                ->first();
            
            if ($project) return $project;
        }

        // Fallback: most recent project
        return Project::where('organization_id', $user->organization_id)
            ->whereHas('members', fn($q) => $q->where('user_id', $user->id))
            ->where('status', 'active')
            ->orderByDesc('updated_at')
            ->first();
    }

    protected function cleanSubject(string $subject): string
    {
        $subject = preg_replace('/#[\w-]+/', '', $subject);
        $subject = preg_replace('/^(Re:|Fwd?:|FW:)\s*/i', '', $subject);
        return trim($subject);
    }
}
```

### AnalyzeTaskRisk (Scheduled Job)
```php
<?php
// app/Jobs/AnalyzeTaskRisk.php

namespace App\Jobs;

use App\Models\Task;
use App\Services\AI\PredictiveAnalytics;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AnalyzeTaskRisk implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(PredictiveAnalytics $analytics): void
    {
        // Get all active tasks with due dates
        Task::whereIn('state', ['pending', 'accepted', 'in_progress'])
            ->whereNotNull('due_date')
            ->chunk(100, function ($tasks) use ($analytics) {
                foreach ($tasks as $task) {
                    $riskScore = $analytics->calculateOverdueRisk($task);
                    $task->update(['overdue_risk_score' => $riskScore]);
                }
            });
    }
}
```

---

## Event Classes

### TaskCreated
```php
<?php
// app/Events/TaskCreated.php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task
    ) {}

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel("project.{$this->task->project_id}"),
        ];

        if ($this->task->owner_id) {
            $channels[] = new PrivateChannel("user.{$this->task->owner_id}");
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'task.created';
    }

    public function broadcastWith(): array
    {
        return [
            'task' => [
                'id' => $this->task->id,
                'title' => $this->task->title,
                'state' => $this->task->state->value,
                'priority' => $this->task->priority->value,
                'source_channel' => $this->task->source_channel->value,
                'requestor' => [
                    'id' => $this->task->requestor_id,
                    'name' => $this->task->requestor?->name,
                ],
                'owner' => $this->task->owner ? [
                    'id' => $this->task->owner_id,
                    'name' => $this->task->owner->name,
                ] : null,
            ],
        ];
    }
}
```

### TaskStateChanged
```php
<?php
// app/Events/TaskStateChanged.php

namespace App\Events;

use App\Enums\TaskState;
use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskStateChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task,
        public TaskState $fromState,
        public TaskState $toState,
        public ?User $changedBy = null
    ) {}

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel("project.{$this->task->project_id}"),
        ];

        if ($this->task->owner_id) {
            $channels[] = new PrivateChannel("user.{$this->task->owner_id}");
        }
        
        if ($this->task->requestor_id !== $this->task->owner_id) {
            $channels[] = new PrivateChannel("user.{$this->task->requestor_id}");
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'task.state.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'from_state' => $this->fromState->value,
            'to_state' => $this->toState->value,
            'changed_by' => $this->changedBy?->only(['id', 'name']),
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
```

---

## ✅ Services Checklist

- [ ] TaskStateMachine with all transitions
- [ ] TaskJugglerService with CRUD + transitions
- [ ] TEFExporter for import/export
- [ ] OpenRouterService for AI API
- [ ] NLPExtractor for text parsing
- [ ] TaskAssignmentAI for owner suggestions
- [ ] PredictiveAnalytics for risk scoring
- [ ] ProcessIncomingEmail job
- [ ] AnalyzeTaskRisk scheduled job
- [ ] TaskCreated event
- [ ] TaskStateChanged event
- [ ] TaskAssigned event
