<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'task_id',
        'message_type',
        'source_actor_id',
        'target_actor_id',
        'reply_to_id',
        'payload',
        'delivered_at',
        'read_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'delivered_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    // Message Types
    const TYPE_TASK_CREATE = 'TASK_CREATE';
    const TYPE_TASK_ACCEPT = 'TASK_ACCEPT';
    const TYPE_TASK_REJECT = 'TASK_REJECT';
    const TYPE_TASK_DELEGATE = 'TASK_DELEGATE';
    const TYPE_TASK_STATUS_UPDATE = 'TASK_STATUS_UPDATE';
    const TYPE_TASK_COMPLETE = 'TASK_COMPLETE';
    const TYPE_TASK_CANCEL = 'TASK_CANCEL';
    const TYPE_TASK_REOPEN = 'TASK_REOPEN';
    const TYPE_TASK_MESSAGE = 'TASK_MESSAGE';
    const TYPE_TASK_CLARIFICATION_REQUEST = 'TASK_CLARIFICATION_REQUEST';
    const TYPE_TASK_CLARIFICATION_RESPONSE = 'TASK_CLARIFICATION_RESPONSE';
    const TYPE_TASK_ATTACHMENT_ADD = 'TASK_ATTACHMENT_ADD';
    const TYPE_TASK_PROGRESS_REPORT = 'TASK_PROGRESS_REPORT';
    const TYPE_TASK_TIMELINE_UPDATE = 'TASK_TIMELINE_UPDATE';
    const TYPE_TASK_DISPUTE = 'TASK_DISPUTE';
    const TYPE_TASK_RESOLUTION = 'TASK_RESOLUTION';

    /**
     * Get the conversation
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the task
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Get source actor
     */
    public function sourceActor(): BelongsTo
    {
        return $this->belongsTo(Actor::class, 'source_actor_id');
    }

    /**
     * Get target actor
     */
    public function targetActor(): BelongsTo
    {
        return $this->belongsTo(Actor::class, 'target_actor_id');
    }

    /**
     * Get the message this is replying to
     */
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'reply_to_id');
    }

    /**
     * Mark message as delivered
     */
    public function markAsDelivered(): void
    {
        $this->delivered_at = now();
        $this->save();
    }

    /**
     * Mark message as read
     */
    public function markAsRead(): void
    {
        $this->read_at = now();
        $this->save();
    }

    /**
     * Check if message is read
     */
    public function isRead(): bool
    {
        return $this->read_at !== null;
    }
}

