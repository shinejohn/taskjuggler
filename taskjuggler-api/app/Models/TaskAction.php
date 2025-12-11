<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TaskAction extends Model
{
    use HasUuids;

    protected $fillable = [
        'task_id',
        'user_id',
        'action_type',
        'action_data',
        'previous_value',
        'new_value',
        'reason',
    ];

    protected $casts = [
        'action_data' => 'array',
        'created_at' => 'datetime',
    ];

    // Relationships
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
