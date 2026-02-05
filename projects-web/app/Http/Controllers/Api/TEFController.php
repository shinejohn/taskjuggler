<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Services\TaskJuggler\TEFExporter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TEFController extends Controller
{
    public function __construct(
        protected TEFExporter $exporter
    ) {}

    public function exportTask(Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $tef = $this->exporter->exportTask($task);

        return response()->json($tef);
    }

    public function exportProject(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $tef = $this->exporter->exportProject($project);

        return response()->json($tef);
    }

    public function importTasks(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'tef_data' => ['required', 'array'],
        ]);

        $tasks = $this->exporter->importTasks($validated['tef_data'], $project, $request->user());

        return response()->json([
            'message' => 'Tasks imported successfully',
            'count' => $tasks->count(),
            'data' => $tasks,
        ], 201);
    }
}


