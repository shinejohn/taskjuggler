<?php

namespace App\Events;

use App\Models\AiToolExecution;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AiToolCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public AiToolExecution $execution
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('user.' . $this->execution->task->requestor_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ai.tool.completed';
    }

    public function broadcastWith(): array
    {
        $this->execution->load(['task', 'vendor']);
        return [
            'execution' => $this->execution,
        ];
    }
}
