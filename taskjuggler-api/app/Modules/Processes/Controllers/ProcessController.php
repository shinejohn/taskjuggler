<?php

namespace App\Modules\Processes\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Modules\Core\Traits\ScopesToProfile;
use App\Http\Controllers\Controller;
use App\Modules\Processes\Models\Process;
use App\Modules\Processes\Requests\CreateProcessRequest;
use App\Modules\Processes\Requests\UpdateProcessRequest;
use App\Modules\Processes\Resources\ProcessExecutionResource;
use App\Modules\Processes\Resources\ProcessResource;
use App\Modules\Processes\Services\ProcessExecutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProcessController extends Controller
{
    use ApiResponses, ScopesToProfile;

    public function __construct(
        protected ProcessExecutionService $executionService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        
        if (!$teamId) {
            abort(400, 'Team context required');
        }

        $query = Process::where('team_id', $teamId)
            ->with(['steps', 'project'])
            ->withCount(['steps', 'executions']);

        // Scope to current profile
        $this->scopeToProfile($query, $request);

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('description', 'ilike', "%{$request->search}%");
            });
        }

        // Sort
        $sortField = $request->get('sort', 'updated_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDir);

        $processes = $query->paginate($request->get('per_page', 20));

        return ProcessResource::collection($processes);
    }

    public function store(CreateProcessRequest $request): JsonResponse
    {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        
        if (!$teamId) {
            abort(400, 'Team context required');
        }

        $process = Process::create([
            'team_id' => $teamId,
            'profile_id' => $this->getCurrentProfileId($request),
            ...$request->validated(),
        ]);

        return response()->json([
            'data' => new ProcessResource($process->load(['steps', 'project'])),
        ], 201);
    }

    public function show(Request $request, Process $process): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        return response()->json([
            'data' => new ProcessResource($process->load(['steps', 'project', 'executions'])),
        ]);
    }

    public function update(UpdateProcessRequest $request, Process $process): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        // Don't allow updating status directly - use publish endpoint
        $data = $request->validated();
        if (isset($data['status']) && $data['status'] === 'active') {
            unset($data['status']);
        }

        $process->update($data);

        return response()->json([
            'data' => new ProcessResource($process->fresh(['steps', 'project'])),
        ]);
    }

    public function destroy(Request $request, Process $process): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        $process->delete();

        return response()->json(null, 204);
    }

    public function publish(Request $request, Process $process): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        try {
            $process->publish();
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'data' => new ProcessResource($process->fresh(['steps', 'project'])),
        ]);
    }

    public function execute(Request $request, Process $process): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'task_id' => ['nullable', 'uuid', 'exists:tasks,id'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
        ]);

        $context = array_filter($validated);
        $execution = $this->executionService->execute($process, $context);

        return response()->json([
            'data' => new ProcessExecutionResource($execution),
        ], 201);
    }
}

