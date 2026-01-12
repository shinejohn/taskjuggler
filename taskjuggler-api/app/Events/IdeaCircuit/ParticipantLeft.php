<?php

namespace App\Events\IdeaCircuit;

use App\Models\IdeaCircuit\MeetingParticipant;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ParticipantLeft implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public MeetingParticipant $participant
    ) {
        // Load relationships for broadcasting
        $this->participant->load(['user', 'meeting']);
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('meetings.' . $this->participant->meeting_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'participant.left';
    }

    public function broadcastWith(): array
    {
        return [
            'participant' => [
                'id' => $this->participant->id,
                'meeting_id' => $this->participant->meeting_id,
                'user_id' => $this->participant->user_id,
                'name' => $this->participant->display_name ?? $this->participant->guest_name,
                'display_name' => $this->participant->display_name,
                'role' => $this->participant->role,
                'left_at' => now()->toISOString(),
            ],
        ];
    }
}

