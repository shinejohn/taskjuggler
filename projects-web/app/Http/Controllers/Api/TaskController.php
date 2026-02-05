<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskCollection;
use App\Models\Project;
use App\Models\Task;
use App\Enums\TaskChannel;
use App\Services\TaskJuggler\TaskJugglerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        protected TaskJugglerService $taskJuggler
    ) {}

    public function index(Request $request, Project $project): TaskCollection
    {
        $this->authorize('view', $project);

        $query = $project->tasks()
            ->with(['requestor', 'owner', 'project']);

        // Filters
        if ($request->has('state')) {
            $query->where('state', $request->state);
        }
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->has('owner_id')) {
            $query->where('owner_id', $request->owner_id);
        }
        if ($request->has('channel')) {
            $query->where('source_channel', $request->channel);
        }
        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'ilike', "%{$request->search}%")
                  ->orWhere('description', 'ilike', "%{$request->search}%");
            });
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDir);

        $tasks = $query->paginate($request->get('per_page', 50));

        return new TaskCollection(TaskResource::collection($tasks));
    }

    public function store(CreateTaskRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $task = $this->taskJuggler->createTask(
            array_merge($request->validated(), [
                'organization_id' => $project->organization_id,
                'project_id' => $project->id,
            ]),
            TaskChannel::WEB,
            $request->user()
        );

        return response()->json([
            'data' => new TaskResource($task),
        ], 201);
    }

    public function show(Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $task->load(['requestor', 'owner', 'project', 'actions.user', 'messages.user']);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function update(UpdateTaskRequest $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', $project);

        $task = $this->taskJuggler->updateTask($task, $request->validated(), $request->user());

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function destroy(Project $project, Task $task): JsonResponse
    {
        $this->authorize('delete', $project);

        $task->delete();

        return response()->json(null, 204);
    }

    // State Transitions

    public function accept(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $task = $this->taskJuggler->acceptTask($task, $request->user());

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function decline(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $task = $this->taskJuggler->declineTask($task, $request->user(), $validated['reason']);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function start(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $task = $this->taskJuggler->startTask($task, $request->user());

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function complete(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $task = $this->taskJuggler->completeTask($task, $request->user(), $validated['notes'] ?? null);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function cancel(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $task = $this->taskJuggler->cancelTask($task, $request->user(), $validated['reason'] ?? null);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    // Messages

    public function messages(Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json([
            'data' => $task->messages()->with('user')->orderBy('created_at')->get(),
        ]);
    }

    public function addMessage(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        $this->taskJuggler->addMessage($task, $request->user(), $validated['content']);

        return response()->json([
            'data' => $task->fresh('messages.user')->messages,
        ]);
    }

    // Cross-project task lists

    public function myTasks(Request $request): TaskCollection
    {
        $tasks = Task::ownedBy($request->user())
            ->whereIn('state', ['pending', 'accepted', 'in_progress', 'overdue'])
            ->with(['requestor', 'project'])
            ->orderByRaw("CASE state 
                WHEN 'overdue' THEN 1 
                WHEN 'in_progress' THEN 2 
                WHEN 'accepted' THEN 3 
                WHEN 'pending' THEN 4 
                ELSE 5 END")
            ->orderBy('due_date')
            ->paginate(50);

        return new TaskCollection(TaskResource::collection($tasks));
    }

    public function myRequests(Request $request): TaskCollection
    {
        $tasks = Task::requestedBy($request->user())
            ->whereNotIn('state', ['completed', 'cancelled'])
            ->with(['owner', 'project'])
            ->orderByDesc('created_at')
            ->paginate(50);

        return new TaskCollection(TaskResource::collection($tasks));
    }

    // Standalone tasks (not tied to a project)
    public function indexStandalone(Request $request): TaskCollection
    {
        $query = Task::where('organization_id', $request->user()->organization_id)
            ->whereNull('project_id')
            ->with(['requestor', 'owner', 'team', 'routingRule']);

        // Filters
        if ($request->has('state')) {
            $query->where('state', $request->state);
        }
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->has('owner_id')) {
            $query->where('owner_id', $request->owner_id);
        }
        if ($request->has('team_id')) {
            $query->where('team_id', $request->team_id);
        }
        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'ilike', "%{$request->search}%")
                  ->orWhere('description', 'ilike', "%{$request->search}%");
            });
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDir);

        $tasks = $query->paginate($request->get('per_page', 50));

        return new TaskCollection(TaskResource::collection($tasks));
    }

    public function storeStandalone(CreateTaskRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Validate that source_channel is provided for standalone tasks
        if (!isset($validated['source_channel'])) {
            return response()->json([
                'message' => 'source_channel is required for standalone tasks',
            ], 422);
        }

        $task = $this->taskJuggler->createTask(
            array_merge($validated, [
                'organization_id' => $request->user()->organization_id,
                'project_id' => null, // Standalone task
            ]),
            \App\Enums\TaskChannel::from($validated['source_channel']),
            $request->user()
        );

        return response()->json([
            'data' => new TaskResource($task),
        ], 201);
    }

    public function showStandalone(Task $task): JsonResponse
    {
        // Check organization access
        if ($task->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        // Verify it's a standalone task
        if ($task->project_id !== null) {
            abort(404, 'Task not found');
        }

        $task->load(['requestor', 'owner', 'team', 'routingRule', 'sourceChannel', 'actions.user', 'messages.user']);

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function updateStandalone(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        // Check organization access
        if ($task->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        // Verify it's a standalone task
        if ($task->project_id !== null) {
            abort(404, 'Task not found');
        }

        $task = $this->taskJuggler->updateTask($task, $request->validated(), $request->user());

        return response()->json([
            'data' => new TaskResource($task),
        ]);
    }

    public function destroyStandalone(Task $task): JsonResponse
    {
        // Check organization access
        if ($task->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        // Verify it's a standalone task
        if ($task->project_id !== null) {
            abort(404, 'Task not found');
        }

        $task->delete();

        return response()->json(null, 204);
    }
}


