<?php

declare(strict_types=1);

namespace App\AiTools\Domain;

use App\Models\Team;
use App\Models\User;
use App\Lib\Fibonacco\AiToolsCore\Tools\BaseTool;

class TeamTool extends BaseTool
{
    protected string $toolCategory = 'domain';

    public function name(): string
    {
        return 'team';
    }

    public function description(): string
    {
        return 'Manage teams and members. Actions: list, get, members, workload.';
    }

    public function parameters(): array
    {
        return [
            'action' => [
                'type' => 'enum',
                'enum' => ['list', 'get', 'members', 'workload'],
                'required' => true,
            ],
            'id' => ['type' => 'string', 'required' => false],
            'limit' => ['type' => 'integer', 'required' => false],
        ];
    }

    public function execute(array $params): array
    {
        return match ($params['action']) {
            'list' => $this->listTeams((int) ($params['limit'] ?? 20)),
            'get' => $this->getTeam($params['id'] ?? ''),
            'members' => $this->getMembers($params['id'] ?? ''),
            'workload' => $this->getWorkload($params['id'] ?? ''),
            default => ['error' => true, 'message' => 'Unknown action'],
        };
    }

    protected function listTeams(int $limit): array
    {
        // Check if Team model uses 'members' relation correctly.
        // Assuming standard Laravel conventions or existing Team model.
        $teams = Team::withCount('members')->limit($limit)->get(['id', 'name']);

        return ['count' => $teams->count(), 'teams' => $teams->toArray()];
    }

    protected function getTeam(string $id): array
    {
        $team = Team::with('members')->find($id);

        if (!$team) {
            return ['error' => true, 'message' => 'Team not found'];
        }

        return ['team' => $team->toArray()];
    }

    protected function getMembers(string $id): array
    {
        $team = Team::with('members')->find($id);

        if (!$team) {
            return ['error' => true, 'message' => 'Team not found'];
        }

        return [
            'team' => $team->name,
            'members' => $team->members->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'email' => $m->email,
            ])->toArray(),
        ];
    }

    protected function getWorkload(string $id): array
    {
        $team = Team::find($id);

        if (!$team) {
            return ['error' => true, 'message' => 'Team not found'];
        }

        // Must verify 'assignedTasks' relationship on User model if it exists
        // Or 'tasks' relationship.
        // Assuming 'assignedTasks' based on spec.

        $members = $team->members()->withCount([
            'assignedTasks',
            'assignedTasks as pending_count' => fn($q) => $q->whereNot('status', 'completed'),
            'assignedTasks as overdue_count' => fn($q) => $q->where('due_date', '<', now())->whereNot('status', 'completed'),
        ])->get();

        return [
            'team' => $team->name,
            'workload' => $members->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'total_tasks' => $m->assigned_tasks_count,
                'pending_tasks' => $m->pending_count,
                'overdue_tasks' => $m->overdue_count,
            ])->toArray(),
        ];
    }
}
