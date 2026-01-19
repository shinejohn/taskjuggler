<?php

namespace App\Modules\Processes\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Http\Controllers\Controller;
use App\Modules\Processes\Models\Process;
use App\Modules\Processes\Models\ProcessExecution;
use App\Modules\Processes\Resources\ProcessExecutionResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProcessExecutionController extends Controller
{
    use ApiResponses;

    public function index(Request $request, ?Process $process = null): AnonymousResourceCollection
    {
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        
        if (!$teamId) {
            abort(400, 'Team context required');
        }

        $query = ProcessExecution::query()
            ->with(['process', 'task', 'project']);

        if ($process) {
            // Check team access
            if ($process->team_id !== $teamId) {
                abort(403, 'Unauthorized');
            }
            $query->where('process_id', $process->id);
        } else {
            // Filter by team through process relationship
            $query->whereHas('process', function ($q) use ($teamId) {
                $q->where('team_id', $teamId);
            });
        }

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('task_id')) {
            $query->where('task_id', $request->task_id);
        }

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Sort
        $query->orderBy('created_at', 'desc');

        $executions = $query->paginate($request->get('per_page', 20));

        return ProcessExecutionResource::collection($executions);
    }

    public function show(Request $request, ProcessExecution $execution): JsonResponse
    {
        // Check team access through process
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($execution->process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        return response()->json([
            'data' => new ProcessExecutionResource($execution->load(['process', 'task', 'project'])),
        ]);
    }
}



