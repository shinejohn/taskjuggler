<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task
    ) {}

    public function broadcastOn(): array
    {
        $channels = [new Channel('user.' . $this->task->requestor_id)];
        
        if ($this->task->owner_id) {
            $channels[] = new Channel('user.' . $this->task->owner_id);
        }
        
        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'task.completed';
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task->load(['owner', 'teamMember', 'marketplaceVendor']),
        ];
    }
}
