<?php

declare(strict_types=1);

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Traits\ApiResponses;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Models\ProjectMilestone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectMilestoneController extends Controller
{
    use ApiResponses;

    public function index(Request $request, Project $project): JsonResponse
    {
        $this->authorizeTeam($request, $project);

        $milestones = $project->milestones()
            ->orderBy('order')
            ->orderBy('target_date')
            ->get();

        return response()->json(['data' => $milestones]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        $this->authorizeTeam($request, $project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_date' => 'nullable|date',
            'status' => 'nullable|in:pending,in_progress,completed,missed',
            'order' => 'nullable|integer',
            'is_critical' => 'nullable|boolean',
        ]);

        $milestone = $project->milestones()->create($validated);

        return response()->json(['data' => $milestone], 201);
    }

    public function update(Request $request, Project $project, ProjectMilestone $milestone): JsonResponse
    {
        $this->authorizeTeam($request, $project);
        $this->authorizeMilestone($project, $milestone);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'target_date' => 'nullable|date',
            'status' => 'sometimes|in:pending,in_progress,completed,missed',
            'order' => 'nullable|integer',
            'is_critical' => 'nullable|boolean',
        ]);

        $milestone->update($validated);

        return response()->json(['data' => $milestone->fresh()]);
    }

    public function destroy(Request $request, Project $project, ProjectMilestone $milestone): JsonResponse
    {
        $this->authorizeTeam($request, $project);
        $this->authorizeMilestone($project, $milestone);

        $milestone->delete();

        return response()->json(null, 204);
    }

    public function complete(Request $request, Project $project, ProjectMilestone $milestone): JsonResponse
    {
        $this->authorizeTeam($request, $project);
        $this->authorizeMilestone($project, $milestone);

        $milestone->update([
            'status' => ProjectMilestone::STATUS_COMPLETED,
            'completed_date' => now()->toDateString(),
        ]);

        return response()->json(['data' => $milestone->fresh()]);
    }

    private function authorizeTeam(Request $request, Project $project): void
    {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }
    }

    private function authorizeMilestone(Project $project, ProjectMilestone $milestone): void
    {
        if ($milestone->project_id !== $project->id) {
            abort(404, 'Milestone not found in this project');
        }
    }
}
