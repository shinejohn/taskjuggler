<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Task;
use App\Models\Message;

class Conversation extends Model
{
    protected $fillable = [
        'task_id',
        'participants',
        'message_count',
        'last_message_at',
    ];

    protected $casts = [
        'participants' => 'array',
        'last_message_at' => 'datetime',
    ];

    /**
     * Get the task for this conversation
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Get messages in this conversation
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    /**
     * Add a participant to the conversation
     */
    public function addParticipant(string $actorId): void
    {
        $participants = $this->participants ?? [];
        if (!in_array($actorId, $participants)) {
            $participants[] = $actorId;
            $this->participants = $participants;
            $this->save();
        }
    }

    /**
     * Increment message count
     */
    public function incrementMessageCount(): void
    {
        $this->increment('message_count');
        $this->last_message_at = now();
        $this->save();
    }
}

