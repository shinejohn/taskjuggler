<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Actor extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'actor_type',
        'display_name',
        'capabilities',
        'contact_methods',
        'metadata',
        'authentication',
        'status',
        'organization_id',
        'user_id',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'contact_methods' => 'array',
        'metadata' => 'array',
        'authentication' => 'array',
    ];

    // Actor Types
    const TYPE_HUMAN = 'HUMAN';
    const TYPE_AI_AGENT = 'AI_AGENT';
    const TYPE_TEAM = 'TEAM';
    const TYPE_IOT_DEVICE = 'IOT_DEVICE';
    const TYPE_IOT_GATEWAY = 'IOT_GATEWAY';

    // Actor Statuses
    const STATUS_PENDING_CLAIM = 'PENDING_CLAIM';
    const STATUS_ACTIVE = 'ACTIVE';
    const STATUS_SUSPENDED = 'SUSPENDED';
    const STATUS_DELETED = 'DELETED';

    /**
     * Get the user associated with this actor (if human)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get relationships where this actor is actor_a
     */
    public function relationshipsAsA(): HasMany
    {
        return $this->hasMany(Relationship::class, 'actor_a_id');
    }

    /**
     * Get relationships where this actor is actor_b
     */
    public function relationshipsAsB(): HasMany
    {
        return $this->hasMany(Relationship::class, 'actor_b_id');
    }

    /**
     * Get all relationships for this actor
     */
    public function relationships()
    {
        return Relationship::where('actor_a_id', $this->id)
            ->orWhere('actor_b_id', $this->id)
            ->get();
    }

    /**
     * Get messages sent by this actor
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'source_actor_id');
    }

    /**
     * Get messages received by this actor
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'target_actor_id');
    }

    /**
     * Get claim code for this actor
     */
    public function claimCode(): HasOne
    {
        return $this->hasOne(ClaimCode::class);
    }

    /**
     * Check if actor is active
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if actor can be claimed
     */
    public function canBeClaimed(): bool
    {
        return $this->status === self::STATUS_PENDING_CLAIM;
    }
}

