<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProblemController extends Controller
{
    public function index(Project $project)
    {
        $this->authorize('view', $project);
        // TODO: Implement
        return response()->json(['data' => []]);
    }

    public function store(Request $request, Project $project)
    {
        $this->authorize('view', $project);
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function show(Project $project, $problem)
    {
        $this->authorize('view', $project);
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function update(Request $request, Project $project, $problem)
    {
        $this->authorize('update', $project);
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function destroy(Project $project, $problem)
    {
        $this->authorize('update', $project);
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function resolve(Request $request, Project $project, $problem)
    {
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }
}


