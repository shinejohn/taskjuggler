<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaAiTask;
use App\Modules\Urpa\Models\UrpaTaskjugglerLink;
use App\Modules\Urpa\Services\TaskJugglerSyncService;
use App\Modules\Urpa\Services\WebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskJugglerController extends Controller
{
    public function __construct(
        private TaskJugglerSyncService $syncService,
        private WebhookService $webhookService
    ) {}

    /**
     * Get TaskJuggler link status
     * GET /api/urpa/integrations/taskjuggler/status
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        $link = UrpaTaskjugglerLink::where('urpa_user_id', $user->id)->first();

        return response()->json([
            'linked' => $link !== null && $link->isLinked(),
            'link' => $link,
        ]);
    }

    /**
     * Link TaskJuggler account
     * POST /api/urpa/integrations/taskjuggler/link
     */
    public function link(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'taskjuggler_user_id' => 'nullable|uuid|exists:users,id',
            'sync_tasks' => 'sometimes|boolean',
            'sync_projects' => 'sometimes|boolean',
            'auto_create_tasks' => 'sometimes|boolean',
        ]);

        $user = $request->user();

        $link = UrpaTaskjugglerLink::updateOrCreate(
            ['urpa_user_id' => $user->id],
            [
                'taskjuggler_user_id' => $validated['taskjuggler_user_id'] ?? $user->id,
                'sync_tasks' => $validated['sync_tasks'] ?? true,
                'sync_projects' => $validated['sync_projects'] ?? true,
                'auto_create_tasks' => $validated['auto_create_tasks'] ?? true,
                'urpa_originated' => true,
            ]
        );

        return response()->json($link, 201);
    }

    /**
     * Sync tasks to TaskJuggler
     * POST /api/urpa/integrations/taskjuggler/sync
     */
    public function sync(Request $request): JsonResponse
    {
        $user = $request->user();

        $link = UrpaTaskjugglerLink::where('urpa_user_id', $user->id)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (! $link) {
            return response()->json([
                'error' => 'TaskJuggler account not linked',
            ], 400);
        }

        $result = $this->syncService->syncAITasks($user->id);

        return response()->json($result);
    }

    /**
     * Get TaskJuggler tasks
     * GET /api/urpa/integrations/taskjuggler/tasks
     */
    public function tasks(Request $request): JsonResponse
    {
        $user = $request->user();

        $link = UrpaTaskjugglerLink::where('urpa_user_id', $user->id)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (! $link) {
            return response()->json([
                'error' => 'TaskJuggler account not linked',
            ], 400);
        }

        $result = $this->syncService->syncFromTaskJuggler($user->id);

        // Fetch URPA activities created from TaskJuggler
        $activities = UrpaActivity::where('user_id', $user->id)
            ->where('source', 'taskjuggler')
            ->orderBy('activity_timestamp', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'data' => $activities,
            'sync_result' => $result,
        ]);
    }

    /**
     * Create task in TaskJuggler from URPA activity
     * POST /api/urpa/integrations/taskjuggler/tasks
     */
    public function createTask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'source_type' => 'nullable|string',
            'source_id' => 'nullable|uuid',
        ]);

        $user = $request->user();

        $link = UrpaTaskjugglerLink::where('urpa_user_id', $user->id)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (! $link) {
            return response()->json([
                'error' => 'TaskJuggler account not linked',
            ], 400);
        }

        // Create the URPA AI task first so the TaskJuggler task can reference it.
        $aiTask = UrpaAiTask::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => 'pending',
            'source_type' => $validated['source_type'] ?? 'manual',
            'source_id' => $validated['source_id'] ?? null,
        ]);

        // Create the matching TaskJuggler task via a direct in-process service call.
        $task = $this->syncService->createTask($link, [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'priority' => $validated['priority'] ?? 'normal',
            'due_date' => $validated['due_date'] ?? null,
            'source_type' => 'urpa',
            'source_channel_ref' => $aiTask->id,
        ]);

        $aiTask->markAsSynced($task->id);

        // Dispatch webhook
        $this->webhookService->dispatch('ai_task.created', [
            'id' => $aiTask->id,
            'title' => $aiTask->title,
            'description' => $aiTask->description,
            'status' => $aiTask->status,
            'source_type' => $aiTask->source_type,
            'taskjuggler_task_id' => $aiTask->taskjuggler_task_id,
        ], $user->id);

        return response()->json($aiTask, 201);
    }
}
