<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Milestone extends Model
{
    use HasUuid;

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'target_date',
        'completed_date',
        'status',
    ];

    protected $casts = [
        'target_date' => 'date',
        'completed_date' => 'date',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_MISSED = 'missed';

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function isOverdue(): bool
    {
        return $this->target_date->isPast() 
            && $this->status !== self::STATUS_COMPLETED;
    }

    public function complete(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_date' => now(),
        ]);
    }

    public function getProgress(): float
    {
        $total = $this->tasks()->count();
        if ($total === 0) return 0;
        
        $completed = $this->tasks()->where('state', 'completed')->count();
        return round(($completed / $total) * 100, 1);
    }
}


