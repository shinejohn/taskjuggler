<?php

namespace App\Events\IdeaCircuit;

use App\Models\IdeaCircuit\MeetingNote;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NoteCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public MeetingNote $note
    ) {
        // Load relationships for broadcasting
        $this->note->load(['user', 'assignedTo', 'meeting']);
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('meetings.' . $this->note->meeting_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'note.created';
    }

    public function broadcastWith(): array
    {
        return [
            'note' => [
                'id' => $this->note->id,
                'meeting_id' => $this->note->meeting_id,
                'user_id' => $this->note->user_id,
                'category' => $this->note->category,
                'content' => $this->note->content,
                'note_type' => $this->note->note_type,
                'priority' => $this->note->priority,
                'status' => $this->note->status,
                'created_at' => $this->note->created_at->toISOString(),
                'user' => $this->note->user ? [
                    'id' => $this->note->user->id,
                    'name' => $this->note->user->name,
                ] : null,
            ],
        ];
    }
}





