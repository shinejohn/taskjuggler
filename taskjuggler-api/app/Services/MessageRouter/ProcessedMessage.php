<?php

namespace App\Services\MessageRouter;

use App\Models\Task;
use App\Models\User;

class ProcessedMessage
{
    public function __construct(
        public InboundMessage $original,
        public ?User $user = null,
        public ?Task $task = null,
        public ?MessageIntent $intent = null,
    ) {}
}
