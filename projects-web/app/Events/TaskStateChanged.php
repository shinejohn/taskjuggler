<?php

namespace App\Events;

use App\Enums\TaskState;
use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskStateChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task,
        public TaskState $fromState,
        public TaskState $toState,
        public ?User $user = null
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel("organization.{$this->task->organization_id}");
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task->load(['owner', 'requestor'])->toArray(),
            'from_state' => $this->fromState->value,
            'to_state' => $this->toState->value,
            'user' => $this->user?->toArray(),
        ];
    }
}


