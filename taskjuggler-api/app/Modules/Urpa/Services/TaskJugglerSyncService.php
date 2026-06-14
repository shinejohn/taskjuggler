<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Events\TaskCreated;
use App\Models\Task;
use App\Models\User;
use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaAiTask;
use App\Modules\Urpa\Models\UrpaTaskjugglerLink;
use Illuminate\Support\Facades\Log;

/**
 * Syncs tasks between URPA and TaskJuggler.
 *
 * URPA and TaskJuggler are modules of the same Laravel monolith sharing one
 * database and one users table, so this service talks to the Task model
 * directly instead of making authenticated HTTP calls back into our own API.
 */
final class TaskJugglerSyncService
{
    /**
     * Sync a user's not-yet-synced URPA AI tasks into TaskJuggler tasks.
     *
     * @return array{synced: int, skipped: int}
     */
    public function syncAITasks(string $userId): array
    {
        $link = UrpaTaskjugglerLink::where('urpa_user_id', $userId)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (! $link || ! $link->sync_tasks) {
            return ['synced' => 0, 'skipped' => 0];
        }

        $tasks = UrpaAiTask::where('user_id', $userId)
            ->notSynced()
            ->pending()
            ->get();

        $synced = 0;
        $skipped = 0;

        foreach ($tasks as $task) {
            try {
                $taskjugglerTaskId = $this->createTaskFromAiTask($link, $task);
                $task->markAsSynced($taskjugglerTaskId);
                $synced++;
            } catch (\Throwable $e) {
                Log::error("Failed to sync URPA AI task {$task->id} to TaskJuggler", [
                    'error' => $e->getMessage(),
                ]);
                $skipped++;
            }
        }

        $link->update(['last_synced_at' => now()]);

        return [
            'synced' => $synced,
            'skipped' => $skipped,
        ];
    }

    /**
     * Create a TaskJuggler task from a URPA AI task and return its id.
     */
    private function createTaskFromAiTask(UrpaTaskjugglerLink $link, UrpaAiTask $task): string
    {
        $created = $this->createTask($link, [
            'title' => $task->title,
            'description' => $task->description,
            'due_date' => $task->due_at,
            'source_type' => 'urpa',
            'source_channel_ref' => $task->id,
        ]);

        return $created->id;
    }

    /**
     * Create a TaskJuggler task owned by the linked TaskJuggler user.
     *
     * @param array{
     *     title: string,
     *     description?: string|null,
     *     priority?: string|null,
     *     due_date?: \DateTimeInterface|string|null,
     *     source_type?: string|null,
     *     source_channel_ref?: string|null
     * } $attributes
     */
    public function createTask(UrpaTaskjugglerLink $link, array $attributes): Task
    {
        $task = Task::create([
            'title' => $attributes['title'],
            'description' => $attributes['description'] ?? null,
            'status' => Task::STATUS_PENDING,
            'priority' => $this->normalizePriority($attributes['priority'] ?? null),
            'requestor_id' => $link->taskjuggler_user_id,
            'due_date' => $attributes['due_date'] ?? null,
            'source_type' => $attributes['source_type'] ?? 'urpa',
            'source_channel' => 'urpa_ai',
            'source_channel_ref' => $attributes['source_channel_ref'] ?? null,
        ]);

        event(new TaskCreated($task));

        return $task;
    }

    /**
     * Sync TaskJuggler tasks belonging to the linked user into URPA activities.
     *
     * @return array{synced: int}
     */
    public function syncFromTaskJuggler(string $userId): array
    {
        $link = UrpaTaskjugglerLink::where('urpa_user_id', $userId)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (! $link || ! $link->sync_tasks) {
            return ['synced' => 0];
        }

        $tjUserId = $link->taskjuggler_user_id;

        $tasks = Task::where(function ($q) use ($tjUserId) {
            $q->where('requestor_id', $tjUserId)
                ->orWhere('owner_id', $tjUserId);
        })
            // Don't mirror tasks that originated in URPA back into URPA.
            ->where(function ($q) {
                $q->whereNull('source_type')
                    ->orWhere('source_type', '!=', 'urpa');
            })
            ->orderBy('updated_at', 'desc')
            ->limit(200)
            ->get();

        $synced = 0;

        foreach ($tasks as $task) {
            try {
                UrpaActivity::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'source' => 'taskjuggler',
                        'external_id' => $task->id,
                    ],
                    [
                        'activity_type' => 'task',
                        'title' => $task->title ?? 'Untitled Task',
                        'description' => $task->description,
                        'status' => $this->mapTaskJugglerStatus($task->status ?? 'pending'),
                        'raw_content' => $task->only(['id', 'title', 'description', 'status', 'priority', 'due_date']),
                        'activity_timestamp' => $task->updated_at ?? now(),
                    ]
                );

                $synced++;
            } catch (\Throwable $e) {
                Log::error('Failed to create URPA activity from TaskJuggler task', [
                    'task_id' => $task->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $link->update(['last_synced_at' => now()]);

        return ['synced' => $synced];
    }

    /**
     * Fetch upcoming TaskJuggler tasks for a user (used by the URPA assistant).
     *
     * @return array<int, array{id: string, title: string, description: ?string, priority: string, status: string, due_date: ?string}>
     */
    public function fetchTasks(User $user, int $limit = 10): array
    {
        $link = UrpaTaskjugglerLink::where('urpa_user_id', $user->id)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (! $link || ! $link->sync_tasks) {
            return [];
        }

        $tjUserId = $link->taskjuggler_user_id;

        return Task::where(function ($q) use ($tjUserId) {
            $q->where('requestor_id', $tjUserId)
                ->orWhere('owner_id', $tjUserId);
        })
            ->where('status', Task::STATUS_PENDING)
            ->orderBy('due_date', 'asc')
            ->limit($limit)
            ->get()
            ->map(fn (Task $task): array => [
                'id' => $task->id,
                'title' => $task->title ?? 'Untitled Task',
                'description' => $task->description,
                'priority' => $task->priority ?? Task::PRIORITY_NORMAL,
                'status' => $task->status,
                'due_date' => $task->due_date?->toIso8601String(),
            ])
            ->all();
    }

    /**
     * Run bidirectional sync for every linked, sync-enabled user.
     * Invoked by the scheduler.
     */
    public function syncAllLinked(): void
    {
        $links = UrpaTaskjugglerLink::whereNotNull('taskjuggler_user_id')
            ->where('sync_tasks', true)
            ->get();

        foreach ($links as $link) {
            try {
                $this->syncAITasks($link->urpa_user_id);
                $this->syncFromTaskJuggler($link->urpa_user_id);
            } catch (\Throwable $e) {
                Log::error("Scheduled URPA<->TaskJuggler sync failed for link {$link->id}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Normalize an arbitrary priority string to a valid Task priority.
     */
    private function normalizePriority(?string $priority): string
    {
        return match ($priority) {
            Task::PRIORITY_LOW => Task::PRIORITY_LOW,
            Task::PRIORITY_HIGH => Task::PRIORITY_HIGH,
            Task::PRIORITY_URGENT => Task::PRIORITY_URGENT,
            // 'medium' (legacy) and anything unknown collapse to normal.
            default => Task::PRIORITY_NORMAL,
        };
    }

    /**
     * Map a TaskJuggler task status to a URPA activity status.
     */
    private function mapTaskJugglerStatus(string $status): string
    {
        return match ($status) {
            Task::STATUS_COMPLETED => 'completed',
            Task::STATUS_CANCELLED, Task::STATUS_DECLINED => 'archived',
            default => 'pending',
        };
    }
}
