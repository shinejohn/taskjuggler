<?php

namespace App\Modules\Urpa\Events;

use App\Modules\Urpa\Models\UrpaActivity;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ActivityCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public UrpaActivity $activity;

    public function __construct(UrpaActivity $activity)
    {
        $this->activity = $activity;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('urpa.user.' . $this->activity->user_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'activity.created';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->activity->id,
            'type' => $this->activity->type,
            'title' => $this->activity->title,
            'description' => $this->activity->description,
            'source' => $this->activity->source,
            'metadata' => $this->activity->metadata,
            'created_at' => $this->activity->created_at->toIso8601String(),
        ];
    }
}

