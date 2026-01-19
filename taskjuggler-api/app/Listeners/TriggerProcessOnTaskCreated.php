<?php

namespace App\Listeners;

use App\Events\TaskCreated;
use App\Modules\Processes\Services\ProcessTriggerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class TriggerProcessOnTaskCreated implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected ProcessTriggerService $triggerService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(TaskCreated $event): void
    {
        try {
            $this->triggerService->handleTaskCreated($event->task);
        } catch (\Exception $e) {
            Log::error('Failed to trigger process on task created', [
                'task_id' => $event->task->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

