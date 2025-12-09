<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiToolExecution extends Model
{
    use HasUuids;

    protected $fillable = [
        'task_id',
        'vendor_id',
        'config_id',
        'input_data',
        'status',
        'started_at',
        'completed_at',
        'output_data',
        'deliverable_urls',
        'error_message',
        'tokens_used',
        'cost',
    ];

    protected $casts = [
        'input_data' => 'array',
        'output_data' => 'array',
        'deliverable_urls' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'cost' => 'decimal:4',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_RUNNING = 'running';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_TIMEOUT = 'timeout';

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function vendor()
    {
        return $this->belongsTo(MarketplaceVendor::class, 'vendor_id');
    }

    public function config()
    {
        return $this->belongsTo(AiToolConfig::class, 'config_id');
    }

    public function markStarted(): void
    {
        $this->update([
            'status' => self::STATUS_RUNNING,
            'started_at' => now(),
        ]);
    }

    public function markCompleted(array $outputData, array $deliverableUrls = [], int $tokensUsed = null, float $cost = null): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
            'output_data' => $outputData,
            'deliverable_urls' => $deliverableUrls,
            'tokens_used' => $tokensUsed,
            'cost' => $cost,
        ]);
    }

    public function markFailed(string $error): void
    {
        $this->update([
            'status' => self::STATUS_FAILED,
            'completed_at' => now(),
            'error_message' => $error,
        ]);
    }

    public function markTimeout(): void
    {
        $this->update([
            'status' => self::STATUS_TIMEOUT,
            'completed_at' => now(),
        ]);
    }
}
