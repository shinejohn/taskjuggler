<?php

namespace App\Listeners;

use App\Events\TaskUpdated;
use App\Modules\Processes\Services\ProcessTriggerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class TriggerProcessOnTaskUpdated implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected ProcessTriggerService $triggerService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(TaskUpdated $event): void
    {
        try {
            $this->triggerService->handleTaskUpdated($event->task);
        } catch (\Exception $e) {
            Log::error('Failed to trigger process on task updated', [
                'task_id' => $event->task->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

