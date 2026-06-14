<?php

namespace App\WorkflowEngine\Listeners;

use App\WorkflowEngine\Engine;
use App\WorkflowEngine\WorkflowEvent;
use Illuminate\Contracts\Queue\ShouldQueue;

class WorkflowEventListener implements ShouldQueue
{
    public string $queue = 'workflows';

    public function __construct(protected Engine $engine) {}

    public function handle(WorkflowEvent $event): void
    {
        $this->engine->handleEvent(
            $event->eventKey,
            $event->payload,
            $event->organizationId,
            $event->triggeredById,
            $event->correlationId,
        );
    }
}
