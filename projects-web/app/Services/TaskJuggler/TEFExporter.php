<?php

namespace App\Services\TaskJuggler;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
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


