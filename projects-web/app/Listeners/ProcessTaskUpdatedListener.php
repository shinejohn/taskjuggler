<?php

namespace App\Listeners;

use App\Events\TaskStateChanged;
use App\Services\Process\ProcessTriggerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ProcessTaskUpdatedListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected ProcessTriggerService $triggerService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(TaskStateChanged $event): void
    {
        $this->triggerService->handleTaskUpdated($event->task);
    }
}
