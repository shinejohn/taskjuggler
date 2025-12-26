<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClaimCode extends Model
{
    use HasUuids;

    protected $fillable = [
        'actor_id',
        'code',
        'expires_at',
        'claimed_at',
        'claimed_by_user_id',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'claimed_at' => 'datetime',
    ];

    /**
     * Get the actor this claim code belongs to
     */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(Actor::class);
    }

    /**
     * Check if claim code is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if claim code is valid
     */
    public function isValid(): bool
    {
        return !$this->isExpired();
    }
}

