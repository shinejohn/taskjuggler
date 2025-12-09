<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'currency',
        'task_id',
        'vendor_id',
        'execution_id',
        'stripe_payment_intent_id',
        'stripe_transfer_id',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    const TYPE_SUBSCRIPTION = 'subscription';
    const TYPE_MARKETPLACE = 'marketplace';
    const TYPE_AI_TOOL = 'ai_tool';
    const TYPE_USAGE = 'usage';

    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_REFUNDED = 'refunded';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function vendor()
    {
        return $this->belongsTo(MarketplaceVendor::class, 'vendor_id');
    }

    public function execution()
    {
        return $this->belongsTo(AiToolExecution::class, 'execution_id');
    }

    public function markCompleted(): void
    {
        $this->update(['status' => self::STATUS_COMPLETED]);
    }

    public function markFailed(): void
    {
        $this->update(['status' => self::STATUS_FAILED]);
    }
}
