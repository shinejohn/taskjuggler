<?php

namespace App\Events\IdeaCircuit;

use App\Models\IdeaCircuit\Meeting;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MeetingEnded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Meeting $meeting
    ) {
        // Load relationships for broadcasting
        $this->meeting->load(['user']);
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('meetings.' . $this->meeting->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'meeting.ended';
    }

    public function broadcastWith(): array
    {
        return [
            'meeting' => [
                'id' => $this->meeting->id,
                'title' => $this->meeting->title,
                'status' => $this->meeting->status,
                'ended_at' => $this->meeting->ended_at?->toISOString(),
                'duration_seconds' => $this->meeting->duration_seconds,
            ],
        ];
    }
}



