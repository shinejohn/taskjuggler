<?php

namespace App\Services\AI;

use App\Models\Task;
use App\Models\Project;

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

        return $bottlenecks;
    }
}


