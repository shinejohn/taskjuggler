<?php

declare(strict_types=1);

namespace App\AiTools\Domain;

use App\Models\Task;
use App\Lib\Fibonacco\AiToolsCore\Tools\BaseTool;

class TaskTool extends BaseTool
{
    protected string $toolCategory = 'domain';

    public function name(): string
    {
        return 'task';
    }

    public function description(): string
    {
        return 'Manage tasks. Actions: list, get, create, update, complete, assign, search, overdue, my_tasks, by_project.';
    }

    public function parameters(): array
    {
        return [
            'action' => [
                'type' => 'enum',
                'enum' => ['list', 'get', 'create', 'update', 'complete', 'assign', 'search', 'overdue', 'my_tasks', 'by_project'],
                'required' => true,
            ],
            'id' => ['type' => 'string', 'required' => false],
            'project_id' => ['type' => 'string', 'required' => false],
            'owner_id' => ['type' => 'string', 'required' => false],
            'status' => [
                'type' => 'enum',
                'enum' => ['pending', 'in_progress', 'review', 'completed', 'blocked'],
                'required' => false,
            ],
            'priority' => [
                'type' => 'enum',
                'enum' => ['low', 'medium', 'high', 'urgent'],
                'required' => false,
            ],
            'title' => ['type' => 'string', 'required' => false],
            'description' => ['type' => 'string', 'required' => false],
            'due_date' => ['type' => 'string', 'description' => 'YYYY-MM-DD format', 'required' => false],
            'search' => ['type' => 'string', 'required' => false],
            'limit' => ['type' => 'integer', 'required' => false],
        ];
    }

    public function execute(array $params): array
    {
        return match ($params['action']) {
            'list' => $this->listTasks($params),
            'get' => $this->getTask($params['id'] ?? ''),
            'create' => $this->createTask($params),
            'update' => $this->updateTask($params),
            'complete' => $this->completeTask($params),
            'assign' => $this->assignTask($params['id'] ?? '', $params['owner_id'] ?? ''),
            'search' => $this->searchTasks($params['search'] ?? '', (int) ($params['limit'] ?? 20)),
            'overdue' => $this->getOverdueTasks($params),
            'my_tasks' => $this->getMyTasks($params),
            'by_project' => $this->getByProject($params['project_id'] ?? '', $params),
            default => ['error' => true, 'message' => 'Unknown action'],
        };
    }

    protected function listTasks(array $params): array
    {
        $query = Task::with(['project', 'owner']);

        if (!empty($params['project_id'])) {
            $query->where('project_id', $params['project_id']);
        }
        if (!empty($params['owner_id'])) {
            $query->where('owner_id', $params['owner_id']);
        }
        if (!empty($params['status'])) {
            $query->where('status', $params['status']);
        }
        if (!empty($params['priority'])) {
            $query->where('priority', $params['priority']);
        }

        $tasks = $query->orderBy('due_date')
            ->limit($params['limit'] ?? 20)
            ->get();

        return [
            'count' => $tasks->count(),
            'tasks' => $tasks->map(fn($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'status' => $t->status,
                'priority' => $t->priority,
                'due_date' => $t->due_date?->format('Y-m-d'),
                'owner' => $t->owner?->name,
                'project' => $t->project?->name,
            ])->toArray(),
        ];
    }

    protected function getTask(string $id): array
    {
        $task = Task::with(['project', 'owner', 'messages'])->find($id);

        if (!$task) {
            return ['error' => true, 'message' => 'Task not found'];
        }

        return ['task' => $task->toArray()];
    }

    protected function createTask(array $params): array
    {
        if (empty($params['title'])) {
            return ['error' => true, 'message' => 'title required'];
        }

        $task = Task::create([
            'title' => $params['title'],
            'description' => $params['description'] ?? null,
            'project_id' => $params['project_id'] ?? null,
            'owner_id' => $params['owner_id'] ?? auth()->id(),
            'status' => $params['status'] ?? 'pending',
            'priority' => $params['priority'] ?? 'medium',
            'due_date' => $params['due_date'] ?? null,
            'tags' => $params['tags'] ?? [],
            'requestor_id' => auth()->id(),
        ]);

        return [
            'success' => true,
            'task' => ['id' => $task->id, 'title' => $task->title],
        ];
    }

    protected function updateTask(array $params): array
    {
        $task = Task::find($params['id'] ?? '');

        if (!$task) {
            return ['error' => true, 'message' => 'Task not found'];
        }

        $updateable = ['title', 'description', 'status', 'priority', 'due_date', 'owner_id', 'project_id'];
        $data = array_intersect_key($params, array_flip($updateable));

        $task->update($data);

        return ['success' => true, 'updated' => array_keys($data)];
    }

    protected function completeTask(array $params): array
    {
        $id = $params['id'] ?? '';
        $task = Task::find($id);

        if (!$task) {
            return ['error' => true, 'message' => 'Task not found'];
        }

        $updateData = [
            'status' => 'completed',
            'completed_at' => now(),
        ];

        if (isset($params['completion_notes'])) {
            $metadata = $task->metadata ?? [];
            $metadata['completion_notes'] = $params['completion_notes'];
            $updateData['metadata'] = $metadata;
        }

        if (isset($params['output_data'])) {
            $metadata = $task->metadata ?? [];
            $metadata['output_data'] = $params['output_data'];
            $updateData['metadata'] = $metadata;
        }

        $task->update($updateData);

        return ['success' => true, 'task_id' => $id, 'status' => 'completed'];
    }

    protected function assignTask(string $id, string $ownerId): array
    {
        $task = Task::find($id);

        if (!$task) {
            return ['error' => true, 'message' => 'Task not found'];
        }

        $task->update(['owner_id' => $ownerId]);

        return ['success' => true, 'task_id' => $id, 'owner_id' => $ownerId];
    }

    protected function searchTasks(string $term, int $limit): array
    {
        $tasks = Task::where('title', 'ILIKE', "%{$term}%")
            ->orWhere('description', 'ILIKE', "%{$term}%")
            ->limit($limit)
            ->get(['id', 'title', 'status', 'priority', 'due_date']);

        return ['count' => $tasks->count(), 'tasks' => $tasks->toArray()];
    }

    protected function getOverdueTasks(array $params): array
    {
        $query = Task::where('due_date', '<', now())
            ->whereNotIn('status', ['completed']);

        if (!empty($params['owner_id'])) {
            $query->where('owner_id', $params['owner_id']);
        }
        if (!empty($params['project_id'])) {
            $query->where('project_id', $params['project_id']);
        }

        $tasks = $query->orderBy('due_date')
            ->limit($params['limit'] ?? 20)
            ->with(['project', 'owner'])
            ->get();

        return [
            'count' => $tasks->count(),
            'description' => 'Overdue tasks',
            'tasks' => $tasks->map(fn($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'due_date' => $t->due_date?->format('Y-m-d'),
                'days_overdue' => $t->due_date?->diffInDays(now()),
                'owner' => $t->owner?->name,
                'project' => $t->project?->name,
            ])->toArray(),
        ];
    }

    protected function getMyTasks(array $params): array
    {
        $params['owner_id'] = auth()->id();
        return $this->listTasks($params);
    }

    protected function getByProject(string $projectId, array $params): array
    {
        $params['project_id'] = $projectId;
        return $this->listTasks($params);
    }
}
