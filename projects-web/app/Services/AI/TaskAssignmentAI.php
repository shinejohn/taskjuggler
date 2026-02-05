<?php

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


