<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProcessStepRequest;
use App\Http\Requests\UpdateProcessStepRequest;
use App\Http\Resources\ProcessStepResource;
use App\Models\Process;
use App\Models\ProcessStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProcessStepController extends Controller
{
    public function index(Request $request, Process $process): AnonymousResourceCollection
    {
        // Check organization access
        if ($process->organization_id !== $request->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $steps = $process->steps()->orderBy('order')->get();

        return ProcessStepResource::collection($steps);
    }

    public function store(CreateProcessStepRequest $request, Process $process): JsonResponse
    {
        // Check organization access
        if ($process->organization_id !== $request->user()->organization_id) {
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

    public function show(Process $process, ProcessStep $step): JsonResponse
    {
        // Check organization access
        if ($process->organization_id !== request()->user()->organization_id) {
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
        // Check organization access
        if ($process->organization_id !== request()->user()->organization_id) {
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

    public function destroy(Process $process, ProcessStep $step): JsonResponse
    {
        // Check organization access
        if ($process->organization_id !== request()->user()->organization_id) {
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
