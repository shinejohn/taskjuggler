<?php

namespace App\Modules\Processes\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Http\Controllers\Controller;
use App\Modules\Processes\Models\Process;
use App\Modules\Processes\Models\ProcessStep;
use App\Modules\Processes\Requests\CreateProcessStepRequest;
use App\Modules\Processes\Requests\UpdateProcessStepRequest;
use App\Modules\Processes\Resources\ProcessStepResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProcessStepController extends Controller
{
    use ApiResponses;

    public function index(Request $request, Process $process): AnonymousResourceCollection
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        $steps = $process->steps()->orderBy('order')->get();

        return ProcessStepResource::collection($steps);
    }

    public function store(CreateProcessStepRequest $request, Process $process): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        // Check if order already exists
        $existingStep = $process->steps()->where('order', $request->order)->first();
        if ($existingStep) {
            // Shift existing steps
            $process->steps()
                ->where('order', '>=', $request->order)
                ->increment('order');
        }

        $step = $process->steps()->create($request->validated());

        return response()->json([
            'data' => new ProcessStepResource($step),
        ], 201);
    }

    public function show(Request $request, Process $process, ProcessStep $step): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        // Verify step belongs to process
        if ($step->process_id !== $process->id) {
            abort(404, 'Step not found');
        }

        return response()->json([
            'data' => new ProcessStepResource($step),
        ]);
    }

    public function update(UpdateProcessStepRequest $request, Process $process, ProcessStep $step): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        // Verify step belongs to process
        if ($step->process_id !== $process->id) {
            abort(404, 'Step not found');
        }

        // Handle order change
        if ($request->has('order') && $request->order !== $step->order) {
            $oldOrder = $step->order;
            $newOrder = $request->order;

            if ($newOrder > $oldOrder) {
                // Moving down
                $process->steps()
                    ->where('order', '>', $oldOrder)
                    ->where('order', '<=', $newOrder)
                    ->decrement('order');
            } else {
                // Moving up
                $process->steps()
                    ->where('order', '>=', $newOrder)
                    ->where('order', '<', $oldOrder)
                    ->increment('order');
            }
        }

        $step->update($request->validated());

        return response()->json([
            'data' => new ProcessStepResource($step->fresh()),
        ]);
    }

    public function destroy(Request $request, Process $process, ProcessStep $step): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($process->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        // Verify step belongs to process
        if ($step->process_id !== $process->id) {
            abort(404, 'Step not found');
        }

        $order = $step->order;
        $step->delete();

        // Reorder remaining steps
        $process->steps()
            ->where('order', '>', $order)
            ->decrement('order');

        return response()->json(null, 204);
    }
}

