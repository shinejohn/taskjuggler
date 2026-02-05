<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\ProjectCollection;
use App\Models\Project;
use App\Services\AI\PredictiveAnalytics;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        protected PredictiveAnalytics $analytics
    ) {}

    public function index(Request $request): ProjectCollection
    {
        $query = Project::where('organization_id', $request->user()->organization_id)
            ->forUser($request->user())
            ->with(['owner', 'members'])
            ->withCount('tasks');

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

        return new ProjectCollection(ProjectResource::collection($projects));
    }

    public function store(CreateProjectRequest $request): JsonResponse
    {
        $project = Project::create([
            'organization_id' => $request->user()->organization_id,
            'owner_id' => $request->user()->id,
            ...$request->validated(),
        ]);

        // Add creator as owner member
        $project->members()->attach($request->user()->id, ['role' => 'owner']);

        return response()->json([
            'data' => new ProjectResource($project->load(['owner', 'members'])),
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json([
            'data' => new ProjectResource($project->load(['owner', 'members'])),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return response()->json([
            'data' => new ProjectResource($project->fresh(['owner', 'members'])),
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(null, 204);
    }

    public function stats(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $taskStats = $project->getTaskStats();
        $healthScore = $this->analytics->calculateProjectHealth($project);
        $prediction = $this->analytics->predictCompletion($project);
        $bottlenecks = $this->analytics->identifyBottlenecks($project);

        return response()->json([
            'tasks' => $taskStats,
            'health_score' => $healthScore,
            'prediction' => $prediction,
            'bottlenecks' => $bottlenecks,
        ]);
    }
}


