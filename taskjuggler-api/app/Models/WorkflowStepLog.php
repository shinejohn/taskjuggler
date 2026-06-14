<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowStepLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'execution_id',
        'step_number',
        'step_name',
        'action',
        'input',
        'output',
        'status',
        'started_at',
        'completed_at',
        'duration_ms',
        'error_message',
        'error_details',
        'retry_count',
    ];

    protected $casts = [
        'input' => 'array',
        'output' => 'array',
        'error_details' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function execution(): BelongsTo
    {
        return $this->belongsTo(WorkflowExecution::class, 'execution_id');
    }

    public function markRunning(): void
    {
        $this->update([
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    public function markCompleted(array $output): void
    {
        $this->update([
            'status' => 'completed',
            'output' => $output,
            'completed_at' => now(),
            'duration_ms' => now()->diffInMilliseconds($this->started_at),
        ]);
    }

    public function markFailed(string $message, ?array $details = null): void
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $message,
            'error_details' => $details,
            'completed_at' => now(),
            'duration_ms' => $this->started_at
                ? now()->diffInMilliseconds($this->started_at)
                : null,
        ]);
    }

    public function markSkipped(): void
    {
        $this->update(['status' => 'skipped']);
    }
}
