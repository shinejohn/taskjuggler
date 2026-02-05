<?php

namespace App\Services\Routing;

class RoutingDecision
{
    public function __construct(
        public ?string $ruleId,
        public string $ruleName,
        public bool $createTask,
        public string $requestorId,
        public string $assigneeType,
        public ?string $assigneeId,
        public string $priority,
        public array $notifications,
        public ?string $autoResponse,
        public array $tags,
        public string $taskTitle,
        public string $taskDescription,
    ) {}

    public function matched(): bool
    {
        return $this->ruleId !== null;
    }
}
