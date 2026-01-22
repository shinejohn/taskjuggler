<?php

namespace App\Modules\Urpa\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaWebhookEvent extends Model
{
    use HasUuids;

    protected $table = 'urpa_webhook_events';

    protected $fillable = [
        'integration_id',
        'user_id',
        'event',
        'payload',
        'webhook_url',
        'status_code',
        'response_body',
        'attempts',
        'last_attempted_at',
        'delivered_at',
        'error_message',
    ];

    protected $casts = [
        'payload' => 'array',
        'last_attempted_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function integration(): BelongsTo
    {
        return $this->belongsTo(UrpaIntegration::class, 'integration_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function markDelivered(?int $statusCode = null, ?string $responseBody = null): void
    {
        $this->update([
            'delivered_at' => now(),
            'status_code' => $statusCode,
            'response_body' => $responseBody,
        ]);
    }

    public function markFailed(string $errorMessage, ?int $statusCode = null, ?string $responseBody = null): void
    {
        $this->increment('attempts');
        $this->update([
            'last_attempted_at' => now(),
            'error_message' => $errorMessage,
            'status_code' => $statusCode,
            'response_body' => $responseBody,
        ]);
    }

    public function isDelivered(): bool
    {
        return $this->delivered_at !== null;
    }

    public function shouldRetry(int $maxAttempts = 5): bool
    {
        return !$this->isDelivered() && $this->attempts < $maxAttempts;
    }
}

