<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class InboxItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'source_type',
        'source_id',
        'channel_id',
        'from_identifier',
        'from_name',
        'subject',
        'body',
        'attachments',
        'extracted_data',
        'processing_status',
        'processing_error',
        'routed_to_task_id',
        'routing_rule_id',
        'auto_response_sent',
        'auto_response_text',
        'status',
        'received_at',
        'processed_at',
    ];

    protected $casts = [
        'attachments' => 'array',
        'extracted_data' => 'array',
        'auto_response_sent' => 'boolean',
        'received_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    const SOURCE_PHONE = 'phone';
    const SOURCE_EMAIL = 'email';
    const SOURCE_SMS = 'sms';

    const STATUS_UNPROCESSED = 'unprocessed';
    const STATUS_PROCESSING = 'processing';
    const STATUS_PROCESSED = 'processed';
    const STATUS_FAILED = 'failed';
    const STATUS_DISMISSED = 'dismissed';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function channel()
    {
        return $this->belongsTo(AssistantChannel::class, 'channel_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'routed_to_task_id');
    }

    public function routingRule()
    {
        return $this->belongsTo(RoutingRule::class);
    }

    public function markProcessed(Task $task, RoutingRule $rule = null): void
    {
        $this->update([
            'status' => self::STATUS_PROCESSED,
            'processing_status' => 'completed',
            'routed_to_task_id' => $task->id,
            'routing_rule_id' => $rule?->id,
            'processed_at' => now(),
        ]);
    }

    public function markFailed(string $error): void
    {
        $this->update([
            'status' => self::STATUS_FAILED,
            'processing_status' => 'failed',
            'processing_error' => $error,
            'processed_at' => now(),
        ]);
    }
}
