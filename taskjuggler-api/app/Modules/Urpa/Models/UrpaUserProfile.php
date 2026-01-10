<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UrpaUserProfile extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_user_profiles';

    protected $fillable = [
        'user_id',
        'subscription_tier',
        'subscription_status',
        'subscription_started_at',
        'subscription_ends_at',
        'has_text_assistant',
        'has_phone_assistant',
        'phone_number',
        'phone_number_sid',
        'ai_requests_limit',
        'ai_requests_used',
        'storage_limit_gb',
        'storage_used_gb',
        'default_persona',
        'theme',
        'widget_visibility',
    ];

    protected $casts = [
        'subscription_started_at' => 'datetime',
        'subscription_ends_at' => 'datetime',
        'has_text_assistant' => 'boolean',
        'has_phone_assistant' => 'boolean',
        'ai_requests_limit' => 'integer',
        'ai_requests_used' => 'integer',
        'storage_limit_gb' => 'decimal:2',
        'storage_used_gb' => 'decimal:2',
        'widget_visibility' => 'array',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function personas(): HasMany
    {
        return $this->hasMany(UrpaUserPersona::class, 'user_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(UrpaActivity::class, 'user_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(UrpaContact::class, 'user_id');
    }

    public function integrations(): HasMany
    {
        return $this->hasMany(UrpaIntegration::class, 'user_id');
    }

    public function phoneCalls(): HasMany
    {
        return $this->hasMany(UrpaPhoneCall::class, 'user_id');
    }

    public function aiSessions(): HasMany
    {
        return $this->hasMany(UrpaAiSession::class, 'user_id');
    }

    public function artifacts(): HasMany
    {
        return $this->hasMany(UrpaArtifact::class, 'user_id');
    }

    // Methods
    public function canMakeAiRequest(): bool
    {
        return $this->ai_requests_used < $this->ai_requests_limit;
    }

    public function incrementAiRequests(): void
    {
        $this->increment('ai_requests_used');
    }

    public function hasStorageSpace(float $gb): bool
    {
        return ($this->storage_used_gb + $gb) <= $this->storage_limit_gb;
    }
}

