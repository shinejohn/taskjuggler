<?php

namespace App\Modules\Urpa\Events;

use App\Modules\Urpa\Models\UrpaPhoneCall;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PhoneCallStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public UrpaPhoneCall $phoneCall;

    public function __construct(UrpaPhoneCall $phoneCall)
    {
        $this->phoneCall = $phoneCall;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('urpa.user.' . $this->phoneCall->user_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'phone.call.status.changed';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->phoneCall->id,
            'status' => $this->phoneCall->status,
            'direction' => $this->phoneCall->direction,
            'caller_number' => $this->phoneCall->caller_number,
            'callee_number' => $this->phoneCall->callee_number,
            'duration_seconds' => $this->phoneCall->duration_seconds,
            'transcript' => $this->phoneCall->transcript,
            'recording_url' => $this->phoneCall->recording_url,
            'updated_at' => $this->phoneCall->updated_at->toIso8601String(),
        ];
    }
}

