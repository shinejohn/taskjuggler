<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskDependency extends Model
{
    use HasUuid;

    const TYPE_FINISH_TO_START = 'finish_to_start';
    const TYPE_START_TO_START = 'start_to_start';
    const TYPE_FINISH_TO_FINISH = 'finish_to_finish';
    const TYPE_START_TO_FINISH = 'start_to_finish';

    protected $fillable = [
        'task_id',
        'depends_on_id',
        'type',
        'lag_days',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function dependsOn(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'depends_on_id');
    }

    public function isBlocking(): bool
    {
        $dependency = $this->dependsOn;
        
        return match($this->type) {
            self::TYPE_FINISH_TO_START => !$dependency->state->isTerminal(),
            self::TYPE_START_TO_START => !$dependency->started_at,
            self::TYPE_FINISH_TO_FINISH => !$dependency->completed_at,
            self::TYPE_START_TO_FINISH => !$dependency->started_at,
            default => false,
        };
    }
}


