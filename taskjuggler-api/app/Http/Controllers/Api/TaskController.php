<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()
            ->tasks()
            ->with(['owner', 'teamMember', 'marketplaceVendor'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->priority, fn($q, $priority) => $q->where('priority', $priority))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,normal,high,urgent',
            'due_date' => 'nullable|date',
            'contact_name' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'location_address' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
        ]);

        $task = Task::create([
            ...$validated,
            'requestor_id' => $request->user()->id,
            'status' => Task::STATUS_PENDING,
            'priority' => $validated['priority'] ?? Task::PRIORITY_NORMAL,
        ]);

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        
        $task->load(['owner', 'teamMember', 'marketplaceVendor', 'marketplaceListing', 'routingRule']);

        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:500',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,accepted,in_progress,completed,cancelled',
            'priority' => 'sometimes|in:low,normal,high,urgent',
            'due_date' => 'nullable|date',
            'contact_name' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'location_address' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
        ]);
        
        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();

        return response()->json(null, 204);
    }

    public function complete(Task $task)
    {
        $this->authorize('update', $task);
        
        $task->markCompleted();

        return response()->json($task);
    }

    public function assign(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $request->validate([
            'assignee_type' => 'required|in:user,team_member,vendor',
            'assignee_id' => 'required|uuid',
        ]);

        match ($request->assignee_type) {
            'user' => $task->update(['owner_id' => $request->assignee_id]),
            'team_member' => $task->update(['team_member_id' => $request->assignee_id]),
            'vendor' => $task->update(['marketplace_vendor_id' => $request->assignee_id]),
        };

        $task->update(['status' => Task::STATUS_ACCEPTED]);

        return response()->json($task->fresh());
    }
}
