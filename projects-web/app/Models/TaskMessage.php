<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskMessage extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'task_id',
        'user_id',
        'content',
        'channel',
        'mentions',
        'reply_to_id',
    ];

    protected $casts = [
        'mentions' => 'array',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(TaskMessage::class, 'reply_to_id');
    }
}


