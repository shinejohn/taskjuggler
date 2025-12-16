<?php

namespace App\Events;

use App\Models\InboxItem;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InboxItemReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public InboxItem $inboxItem
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('user.' . $this->inboxItem->user_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'inbox.item.received';
    }

    public function broadcastWith(): array
    {
        return [
            'inbox_item' => $this->inboxItem->load(['channel']),
        ];
    }
}
