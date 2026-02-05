<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskAction extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $fillable = [
        'task_id',
        'user_id',
        'action_type',
        'from_state',
        'to_state',
        'changes',
        'comment',
        'channel',
    ];

    protected $casts = [
        'changes' => 'array',
        'created_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($action) {
            $action->created_at = now();
        });
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Action type constants
    const TYPE_CREATED = 'created';
    const TYPE_ASSIGNED = 'assigned';
    const TYPE_STATE_CHANGED = 'state_changed';
    const TYPE_COMMENTED = 'commented';
    const TYPE_UPDATED = 'updated';
    const TYPE_ATTACHMENT_ADDED = 'attachment_added';
    const TYPE_DUE_DATE_CHANGED = 'due_date_changed';
    const TYPE_PRIORITY_CHANGED = 'priority_changed';
}


