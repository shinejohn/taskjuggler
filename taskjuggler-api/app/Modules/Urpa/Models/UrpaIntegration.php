<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaIntegration extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_integrations';

    protected $fillable = [
        'user_id',
        'integration_type',
        'provider',
        'status',
        'access_token_encrypted',
        'refresh_token_encrypted',
        'token_expires_at',
        'config',
        'last_sync_at',
        'sync_cursor',
        'sync_error',
        'connected_at',
    ];

    protected $casts = [
        'config' => 'array',
        'token_expires_at' => 'datetime',
        'last_sync_at' => 'datetime',
        'connected_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeConnected($query)
    {
        return $query->where('status', 'connected');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('integration_type', $type);
    }

    public function scopeByProvider($query, string $provider)
    {
        return $query->where('provider', $provider);
    }

    // Methods
    public function isConnected(): bool
    {
        return $this->status === 'connected';
    }

    public function isTokenExpired(): bool
    {
        if (!$this->token_expires_at) {
            return false;
        }
        return $this->token_expires_at->isPast();
    }

    public function markAsConnected(): void
    {
        $this->update([
            'status' => 'connected',
            'connected_at' => now(),
        ]);
    }

    public function markAsError(string $error): void
    {
        $this->update([
            'status' => 'error',
            'sync_error' => $error,
        ]);
    }

    public function updateSyncStatus(?string $cursor = null): void
    {
        $this->update([
            'last_sync_at' => now(),
            'sync_cursor' => $cursor,
            'sync_error' => null,
        ]);
    }
}

