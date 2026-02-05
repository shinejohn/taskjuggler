<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProcessRequest;
use App\Http\Requests\UpdateProcessRequest;
use App\Http\Resources\ProcessExecutionResource;
use App\Http\Resources\ProcessResource;
use App\Models\Process;
use App\Services\Process\ProcessExecutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProcessController extends Controller
{
    public function __construct(
        protected ProcessExecutionService $executionService
    ) {}
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Process::where('organization_id', $request->user()->organization_id)
            ->with(['steps', 'project'])
            ->withCount(['steps', 'executions']);

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
        $process = Process::create([
            'organization_id' => $request->user()->organization_id,
            ...$request->validated(),
        ]);

        return response()->json([
            'data' => new ProcessResource($process->load(['steps', 'project'])),
        ], 201);
    }

    public function show(Process $process): JsonResponse
    {
        // Check organization access
        if ($process->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        return response()->json([
            'data' => new ProcessResource($process->load(['steps', 'project', 'executions'])),
        ]);
    }

    public function update(UpdateProcessRequest $request, Process $process): JsonResponse
    {
        // Check organization access
        if ($process->organization_id !== request()->user()->organization_id) {
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

    public function destroy(Process $process): JsonResponse
    {
        // Check organization access
        if ($process->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $process->delete();

        return response()->json(null, 204);
    }

    public function publish(Request $request, Process $process): JsonResponse
    {
        // Check organization access
        if ($process->organization_id !== request()->user()->organization_id) {
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
        // Check organization access
        if ($process->organization_id !== request()->user()->organization_id) {
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
