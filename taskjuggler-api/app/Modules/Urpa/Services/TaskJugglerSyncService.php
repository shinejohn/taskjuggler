<?php

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaAiTask;
use App\Modules\Urpa\Models\UrpaTaskjugglerLink;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TaskJugglerSyncService
{
    private string $taskjugglerApiUrl;

    public function __construct()
    {
        $this->taskjugglerApiUrl = config('services.taskjuggler.api_url', env('TASKJUGGLER_API_URL', 'http://localhost:8000/api'));
    }

    /**
     * Sync URPA AI tasks to TaskJuggler
     */
    public function syncAITasks(string $userId): array
    {
        $link = UrpaTaskjugglerLink::where('urpa_user_id', $userId)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (!$link || !$link->sync_tasks) {
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
                $taskjugglerTaskId = $this->createTaskInTaskJugglerFromAiTask($link, $task);
                
                if ($taskjugglerTaskId) {
                    $task->markAsSynced($taskjugglerTaskId);
                    $synced++;
                } else {
                    $skipped++;
                }
            } catch (\Exception $e) {
                Log::error("Failed to sync task {$task->id} to TaskJuggler", [
                    'error' => $e->getMessage(),
                ]);
                $skipped++;
            }
        }

        return [
            'synced' => $synced,
            'skipped' => $skipped,
        ];
    }

    /**
     * Create task in TaskJuggler from AI task
     */
    private function createTaskInTaskJugglerFromAiTask(UrpaTaskjugglerLink $link, UrpaAiTask $task): ?string
    {
        return $this->createTaskInTaskJuggler($link, $task);
    }

    /**
     * Create task in TaskJuggler
     */
    private function createTaskInTaskJuggler(UrpaTaskjugglerLink $link, UrpaAiTask $task): ?string
    {
        // TODO: Get auth token for TaskJuggler user
        $token = $this->getTaskJugglerToken($link->taskjuggler_user_id);

        if (!$token) {
            return null;
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Content-Type' => 'application/json',
        ])->post($this->taskjugglerApiUrl . '/tasks', [
            'title' => $task->title,
            'description' => $task->description,
            'status' => 'pending',
            'priority' => 'normal',
            'due_date' => $task->due_at?->toIso8601String(),
            'source_type' => 'urpa',
            'source_channel' => 'urpa_ai',
            'source_channel_ref' => $task->id,
        ]);

        if ($response->failed()) {
            Log::error("TaskJuggler API error", [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return null;
        }

        $taskjugglerTask = $response->json();
        return $taskjugglerTask['id'] ?? null;
    }

    /**
     * Get TaskJuggler auth token
     */
    private function getTaskJugglerToken(string $userId): ?string
    {
        // TODO: Implement token retrieval
        // This might require storing tokens or using OAuth
        return null;
    }

    /**
     * Sync TaskJuggler tasks to URPA
     */
    public function syncFromTaskJuggler(string $userId): array
    {
        $link = UrpaTaskjugglerLink::where('urpa_user_id', $userId)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (!$link || !$link->sync_tasks) {
            return ['synced' => 0];
        }

        $token = $this->getTaskJugglerToken($link->taskjuggler_user_id);
        if (!$token) {
            Log::warning("No token available for TaskJuggler sync for user: {$userId}");
            return ['synced' => 0];
        }

        try {
            // Fetch tasks from TaskJuggler API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
            ])->get($this->taskjugglerApiUrl . '/tasks', [
                'status' => 'pending',
                'per_page' => 100,
            ]);

            if ($response->failed()) {
                Log::error("TaskJuggler API error fetching tasks", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return ['synced' => 0];
            }

            $tasks = $response->json()['data'] ?? [];
            $synced = 0;

            foreach ($tasks as $task) {
                try {
                    // Check if activity already exists
                    $existing = \App\Modules\Urpa\Models\UrpaActivity::where('user_id', $userId)
                        ->where('external_id', $task['id'])
                        ->where('source', 'taskjuggler')
                        ->first();

                    if ($existing) {
                        continue;
                    }

                    // Create URPA activity from TaskJuggler task
                    \App\Modules\Urpa\Models\UrpaActivity::create([
                        'user_id' => $userId,
                        'activity_type' => 'task',
                        'source' => 'taskjuggler',
                        'title' => $task['title'] ?? 'Untitled Task',
                        'description' => $task['description'] ?? null,
                        'status' => $this->mapTaskJugglerStatus($task['status'] ?? 'pending'),
                        'external_id' => $task['id'],
                        'raw_content' => $task,
                        'activity_timestamp' => $task['created_at'] ?? now(),
                    ]);

                    $synced++;
                } catch (\Exception $e) {
                    Log::error("Failed to create URPA activity from TaskJuggler task", [
                        'task_id' => $task['id'] ?? null,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            return ['synced' => $synced];
        } catch (\Exception $e) {
            Log::error("TaskJuggler sync failed", [
                'error' => $e->getMessage(),
            ]);
            return ['synced' => 0];
        }
    }

    /**
     * Fetch tasks from TaskJuggler for a user
     */
    public function fetchTasks(\App\Models\User $user, int $limit = 10): array
    {
        $link = UrpaTaskjugglerLink::where('urpa_user_id', $user->id)
            ->whereNotNull('taskjuggler_user_id')
            ->first();

        if (!$link || !$link->sync_tasks) {
            return [];
        }

        $token = $this->getTaskJugglerToken($link->taskjuggler_user_id);
        if (!$token) {
            return [];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
            ])->get($this->taskjugglerApiUrl . '/tasks', [
                'status' => 'pending',
                'per_page' => $limit,
            ]);

            if ($response->failed()) {
                return [];
            }

            $tasks = $response->json()['data'] ?? [];

            return array_map(function ($task) {
                return [
                    'id' => $task['id'],
                    'title' => $task['title'] ?? 'Untitled Task',
                    'description' => $task['description'] ?? null,
                    'priority' => $task['priority'] ?? 'medium',
                    'status' => $task['status'] ?? 'pending',
                    'due_date' => $task['due_date'] ?? null,
                ];
            }, $tasks);
        } catch (\Exception $e) {
            Log::error('Failed to fetch tasks from TaskJuggler', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Map TaskJuggler status to URPA activity status
     */
    private function mapTaskJugglerStatus(string $status): string
    {
        return match($status) {
            'completed', 'done' => 'completed',
            'urgent', 'high' => 'urgent',
            'archived' => 'archived',
            default => 'pending',
        };
    }
}

