<?php

namespace App\Modules\Projects\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Modules\Core\Traits\ScopesToProfile;
use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Requests\CreateProjectRequest;
use App\Modules\Projects\Requests\UpdateProjectRequest;
use App\Modules\Projects\Resources\ProjectResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    use ApiResponses, ScopesToProfile;

    public function index(Request $request): AnonymousResourceCollection
    {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        
        if (!$teamId) {
            abort(400, 'Team context required');
        }

        $query = Project::where('team_id', $teamId)
            ->forUser($request->user())
            ->with(['owner', 'members'])
            ->withCount('tasks');

        // Scope to current profile
        $this->scopeToProfile($query, $request);

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('code', 'ilike', "%{$request->search}%");
            });
        }

        // Sort
        $sortField = $request->get('sort', 'updated_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDir);

        $projects = $query->paginate($request->get('per_page', 20));

        return ProjectResource::collection($projects);
    }

    public function store(CreateProjectRequest $request): JsonResponse
    {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        
        if (!$teamId) {
            abort(400, 'Team context required');
        }

        $project = Project::create([
            'team_id' => $teamId,
            'profile_id' => $this->getCurrentProfileId($request),
            'owner_id' => $request->user()->id,
            ...$request->validated(),
        ]);

        // Add creator as owner member
        $project->members()->attach($request->user()->id, ['role' => 'owner']);

        return response()->json([
            'data' => new ProjectResource($project->load(['owner', 'members'])),
        ], 201);
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        return response()->json([
            'data' => new ProjectResource($project->load(['owner', 'members'])),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        $project->update($request->validated());

        return response()->json([
            'data' => new ProjectResource($project->fresh(['owner', 'members'])),
        ]);
    }

    public function destroy(Request $request, Project $project): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        $project->delete();

        return response()->json(null, 204);
    }

    public function stats(Request $request, Project $project): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        $taskStats = $project->getTaskStats();
        $healthScore = $project->calculateHealthScore();

        return response()->json([
            'tasks' => $taskStats,
            'health_score' => $healthScore,
        ]);
    }
}

