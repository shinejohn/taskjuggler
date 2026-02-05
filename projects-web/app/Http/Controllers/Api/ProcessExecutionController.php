<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProcessExecutionResource;
use App\Models\Process;
use App\Models\ProcessExecution;
use App\Services\Process\ProcessExecutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProcessExecutionController extends Controller
{
    public function __construct(
        protected ProcessExecutionService $executionService
    ) {}

    public function index(Request $request, ?Process $process = null): AnonymousResourceCollection
    {
        $query = ProcessExecution::query()
            ->with(['process', 'task', 'project']);

        if ($process) {
            // Check organization access
            if ($process->organization_id !== $request->user()->organization_id) {
                abort(403, 'Unauthorized');
            }

            $query->where('process_id', $process->id);
        } else {
            // Get all executions for user's organization
            $query->whereHas('process', function ($q) use ($request) {
                $q->where('organization_id', $request->user()->organization_id);
            });
        }

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDir);

        $executions = $query->paginate($request->get('per_page', 20));

        return ProcessExecutionResource::collection($executions);
    }

    public function show(ProcessExecution $execution): JsonResponse
    {
        // Check organization access
        if ($execution->process->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        return response()->json([
            'data' => new ProcessExecutionResource($execution->load(['process', 'task', 'project'])),
        ]);
    }
}
