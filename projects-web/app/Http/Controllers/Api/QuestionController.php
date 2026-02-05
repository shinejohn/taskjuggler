<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
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

    public function show(Project $project, $question)
    {
        $this->authorize('view', $project);
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function update(Request $request, Project $project, $question)
    {
        $this->authorize('update', $project);
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function destroy(Project $project, $question)
    {
        $this->authorize('update', $project);
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function vote(Request $request, Project $project, $question)
    {
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function convertToTask(Request $request, Project $project, $question)
    {
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function addAnswer(Request $request, Project $project, $question)
    {
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function acceptAnswer(Request $request, Project $project, $question, $answer)
    {
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function voteAnswer(Request $request, $answer)
    {
        // TODO: Implement
        return response()->json(['message' => 'Not implemented'], 501);
    }
}


