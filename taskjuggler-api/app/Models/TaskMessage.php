<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskMessage extends Model
{
    use HasUuids;

    protected $fillable = [
        'task_id',
        'sender_id',
        'sender_type',
        'content',
        'content_type',
        'source_channel',
        'source_channel_ref',
        'attachments',
        'metadata',
    ];

    protected $casts = [
        'attachments' => 'array',
        'metadata' => 'array',
    ];

    // Sender types
    const SENDER_HUMAN = 'human';
    const SENDER_AI = 'ai_agent';
    const SENDER_SYSTEM = 'system';

    // Content types
    const CONTENT_TEXT = 'text';
    const CONTENT_FILE = 'file';
    const CONTENT_IMAGE = 'image';
    const CONTENT_SYSTEM = 'system';  // System notifications like "Task accepted"

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Check if this is a system message
     */
    public function isSystem(): bool
    {
        return $this->sender_type === self::SENDER_SYSTEM;
    }

    /**
     * Create a system message for a task
     */
    public static function systemMessage(Task $task, string $content): self
    {
        return self::create([
            'task_id' => $task->id,
            'sender_type' => self::SENDER_SYSTEM,
            'content' => $content,
            'content_type' => self::CONTENT_SYSTEM,
            'source_channel' => 'system',
        ]);
    }
}
