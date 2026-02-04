<?php

declare(strict_types=1);

namespace App\AiTools\Domain;

use App\Models\Project;
use App\Lib\Fibonacco\AiToolsCore\Tools\BaseTool;

class ProjectTool extends BaseTool
{
    protected string $toolCategory = 'domain';

    public function name(): string
    {
        return 'project';
    }

    public function description(): string
    {
        return 'Manage projects. Actions: list, get, create, stats, active.';
    }

    public function parameters(): array
    {
        return [
            'action' => [
                'type' => 'enum',
                'enum' => ['list', 'get', 'create', 'stats', 'active'],
                'required' => true,
            ],
            'id' => ['type' => 'string', 'required' => false],
            'name' => ['type' => 'string', 'required' => false],
            'description' => ['type' => 'string', 'required' => false],
            'team_id' => ['type' => 'string', 'required' => false],
            'limit' => ['type' => 'integer', 'required' => false],
        ];
    }

    public function execute(array $params): array
    {
        return match ($params['action']) {
            'list' => $this->listProjects($params),
            'get' => $this->getProject($params['id'] ?? ''),
            'create' => $this->createProject($params),
            'stats' => $this->getStats($params['id'] ?? ''),
            'active' => $this->getActive((int) ($params['limit'] ?? 20)),
            default => ['error' => true, 'message' => 'Unknown action'],
        };
    }

    protected function listProjects(array $params): array
    {
        $query = Project::withCount([
            'tasks',
            'tasks as completed_tasks_count' => function ($q) {
                $q->where('status', 'completed');
            }
        ]);

        if (!empty($params['team_id'])) {
            $query->where('team_id', $params['team_id']);
        }

        $projects = $query->limit($params['limit'] ?? 20)->get();

        return [
            'count' => $projects->count(),
            'projects' => $projects->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'status' => $p->status,
                'tasks_count' => $p->tasks_count,
                'completed_tasks_count' => $p->completed_tasks_count,
                'progress' => $p->tasks_count > 0
                    ? round(($p->completed_tasks_count / $p->tasks_count) * 100)
                    : 0,
            ])->toArray(),
        ];
    }

    protected function getProject(string $id): array
    {
        $project = Project::with(['team', 'tasks'])->find($id);

        if (!$project) {
            return ['error' => true, 'message' => 'Project not found'];
        }

        return ['project' => $project->toArray()];
    }

    protected function createProject(array $params): array
    {
        if (empty($params['name'])) {
            return ['error' => true, 'message' => 'name required'];
        }

        $project = Project::create([
            'name' => $params['name'],
            'description' => $params['description'] ?? null,
            'team_id' => $params['team_id'] ?? null,
            'status' => 'active',
            'created_by' => auth()->id(),
        ]);

        return ['success' => true, 'project' => ['id' => $project->id, 'name' => $project->name]];
    }

    protected function getStats(string $id): array
    {
        // Need to check if relation 'tasks' works with the alias. It should.
        // Assuming 'tasks' relationship exists on Project model.

        $project = Project::withCount([
            'tasks',
            'tasks as pending_count' => fn($q) => $q->where('status', 'pending'),
            'tasks as in_progress_count' => fn($q) => $q->where('status', 'in_progress'),
            'tasks as completed_count' => fn($q) => $q->where('status', 'completed'),
            'tasks as overdue_count' => fn($q) => $q->where('due_date', '<', now())->whereNot('status', 'completed'),
        ])->find($id);

        if (!$project) {
            return ['error' => true, 'message' => 'Project not found'];
        }

        return [
            'project' => $project->name,
            'stats' => [
                'total_tasks' => $project->tasks_count,
                'pending' => $project->pending_count,
                'in_progress' => $project->in_progress_count,
                'completed' => $project->completed_count,
                'overdue' => $project->overdue_count,
                'completion_rate' => $project->tasks_count > 0
                    ? round(($project->completed_count / $project->tasks_count) * 100, 1)
                    : 0,
            ],
        ];
    }

    protected function getActive(int $limit): array
    {
        $projects = Project::where('status', 'active')
            ->withCount('tasks')
            ->limit($limit)
            ->get(['id', 'name', 'created_at']);

        return ['count' => $projects->count(), 'projects' => $projects->toArray()];
    }
}
