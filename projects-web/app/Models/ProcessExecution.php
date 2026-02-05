<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProcessExecution extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'process_id',
        'task_id',
        'project_id',
        'status',
        'started_at',
        'completed_at',
        'error_message',
        'execution_data',
        'step_results',
        'current_step_order',
    ];

    protected $casts = [
        'execution_data' => 'array',
        'step_results' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function process(): BelongsTo
    {
        return $this->belongsTo(Process::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    // Methods
    public function start(): void
    {
        $this->status = 'running';
        $this->started_at = now();
        $this->save();
    }

    public function complete(array $results = []): void
    {
        $this->status = 'completed';
        $this->completed_at = now();
        $this->step_results = $results;
        $this->save();
    }

    public function fail(string $errorMessage): void
    {
        $this->status = 'failed';
        $this->completed_at = now();
        $this->error_message = $errorMessage;
        $this->save();
    }

    public function cancel(): void
    {
        $this->status = 'cancelled';
        $this->completed_at = now();
        $this->save();
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRunning($query)
    {
        return $query->where('status', 'running');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
}
