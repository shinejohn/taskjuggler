<?php

namespace App\Listeners;

use App\Events\TaskCreated;
use App\Services\Process\ProcessTriggerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ProcessTaskCreatedListener implements ShouldQueue
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
        $this->triggerService->handleTaskCreated($event->task);
    }
}
