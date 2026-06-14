<?php

namespace App\WorkflowEngine;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkflowEvent
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public string $eventKey,
        public array $payload,
        public int $organizationId,
        public ?int $triggeredById = null,
        public ?string $correlationId = null,
    ) {}
}
