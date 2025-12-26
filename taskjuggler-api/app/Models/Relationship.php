<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Relationship extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'actor_a_id',
        'actor_b_id',
        'relationship_type',
        'permissions',
        'established_via',
        'trust_score',
        'task_count',
        'expires_at',
    ];

    protected $casts = [
        'permissions' => 'array',
        'trust_score' => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    // Relationship Types
    const TYPE_OWNER = 'OWNER';
    const TYPE_PEER = 'PEER';
    const TYPE_DELEGATE = 'DELEGATE';
    const TYPE_WATCHER = 'WATCHER';
    const TYPE_VENDOR = 'VENDOR';

    // Established Via
    const VIA_CLAIM_CODE = 'CLAIM_CODE';
    const VIA_INVITATION = 'INVITATION';
    const VIA_ORGANIZATION = 'ORGANIZATION';
    const VIA_API = 'API';

    /**
     * Get actor A
     */
    public function actorA(): BelongsTo
    {
        return $this->belongsTo(Actor::class, 'actor_a_id');
    }

    /**
     * Get actor B
     */
    public function actorB(): BelongsTo
    {
        return $this->belongsTo(Actor::class, 'actor_b_id');
    }

    /**
     * Get relationship history
     */
    public function history(): HasMany
    {
        return $this->hasMany(RelationshipHistory::class);
    }

    /**
     * Check if relationship is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Increment task count
     */
    public function incrementTaskCount(): void
    {
        $this->increment('task_count');
    }

    /**
     * Update trust score
     */
    public function updateTrustScore(float $score): void
    {
        $this->trust_score = max(0, min(100, $score));
        $this->save();
    }
}

