<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskApiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|uuid|exists:projects,id',
            'owner_id' => 'nullable|uuid|exists:users,id',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create([
            ...$validated,
            'status' => 'pending',
            'requestor_id' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'task' => $task->only(['id', 'title', 'status']),
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,review,completed,blocked',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'owner_id' => 'nullable|uuid|exists:users,id',
        ]);

        $task->update($validated);

        return response()->json(['success' => true, 'task' => $task]);
    }

    public function complete(string $id)
    {
        $task = Task::findOrFail($id);

        $task->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json(['success' => true, 'task' => $task]);
    }

    public function assign(Request $request, string $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'owner_id' => 'required|uuid|exists:users,id',
        ]);

        $task->update($validated);

        return response()->json(['success' => true, 'task' => $task]);
    }
}
