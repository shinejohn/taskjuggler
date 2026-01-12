<?php

namespace App\Events\IdeaCircuit;

use App\Models\IdeaCircuit\MeetingMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public MeetingMessage $message
    ) {
        // Load relationships for broadcasting
        $this->message->load(['user', 'participant', 'meeting']);
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('meetings.' . $this->message->meeting_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.received';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'meeting_id' => $this->message->meeting_id,
                'participant_id' => $this->message->participant_id,
                'user_id' => $this->message->user_id,
                'message_text' => $this->message->message_text,
                'message_type' => $this->message->message_type,
                'is_ai_generated' => $this->message->is_ai_generated,
                'created_at' => $this->message->created_at->toISOString(),
                'user' => $this->message->user ? [
                    'id' => $this->message->user->id,
                    'name' => $this->message->user->name,
                    'email' => $this->message->user->email,
                ] : null,
                'participant' => $this->message->participant ? [
                    'id' => $this->message->participant->id,
                    'name' => $this->message->participant->name,
                    'role' => $this->message->participant->role,
                ] : null,
            ],
        ];
    }
}

