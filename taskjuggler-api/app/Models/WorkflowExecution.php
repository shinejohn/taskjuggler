<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class WorkflowExecution extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'definition_id',
        'trigger_event',
        'trigger_payload',
        'correlation_id',
        'triggered_by_id',
        'status',
        'current_step',
        'total_steps',
        'context',
        'started_at',
        'completed_at',
        'duration_ms',
        'error_message',
        'error_details',
        'retry_count',
        'max_retries',
        'next_retry_at',
    ];

    protected $casts = [
        'trigger_payload' => 'array',
        'context' => 'array',
        'error_details' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'next_retry_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->ulid = $model->ulid ?? (string) Str::ulid();
            $model->correlation_id = $model->correlation_id ?? (string) Str::uuid();
        });
    }

    // ── Relationships ──

    public function definition(): BelongsTo
    {
        return $this->belongsTo(WorkflowDefinition::class, 'definition_id');
    }

    public function triggeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'triggered_by_id');
    }

    public function stepLogs(): HasMany
    {
        return $this->hasMany(WorkflowStepLog::class, 'execution_id');
    }

    // ── Transitions ──

    public function markRunning(): void
    {
        $this->update([
            'status' => 'running',
            'started_at' => $this->started_at ?? now(),
        ]);
    }

    public function markCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'duration_ms' => $this->started_at
                ? now()->diffInMilliseconds($this->started_at)
                : null,
        ]);
        
        // Update stats
        $this->definition->increment('execution_count');
        $this->definition->update(['last_executed_at' => now()]);
    }

    public function markFailed(string $message, ?array $details = null): void
    {
        $this->update([
            'status' => 'failed',
            'completed_at' => now(),
            'error_message' => $message,
            'error_details' => $details,
            'duration_ms' => $this->started_at
                ? now()->diffInMilliseconds($this->started_at)
                : null,
        ]);

        $this->definition->increment('failure_count');
    }

    public function advanceStep(): void
    {
        $this->increment('current_step');
    }

    public function mergeContext(array $data): void
    {
        $context = $this->context ?? [];
        $this->update(['context' => array_merge($context, $data)]);
    }
}
