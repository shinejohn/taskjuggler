<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel("organization.{$this->task->organization_id}");
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task->load(['requestor', 'owner', 'project'])->toArray(),
        ];
    }
}


