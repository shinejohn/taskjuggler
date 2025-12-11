<?php

namespace App\Services\MessageRouter;

class MessageIntent
{
    public function __construct(
        public string $type,        // 'create_task', 'accept', 'decline', 'complete', 'watch', 'message'
        public float $confidence = 0.7,  // Confidence score 0.0 - 1.0
    ) {}
}
