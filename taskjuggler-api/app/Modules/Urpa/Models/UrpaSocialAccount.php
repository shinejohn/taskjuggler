<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A per-user (per-business) OAuth-connected social account URPA can read
 * engagement from and publish to.
 */
final class UrpaSocialAccount extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'urpa_social_accounts';

    protected $fillable = [
        'user_id',
        'fibonacco_business_id',
        'provider',
        'provider_account_id',
        'account_name',
        'credentials',
        'scopes',
        'token_expires_at',
        'is_active',
        'last_read_at',
    ];

    protected $casts = [
        'credentials' => 'encrypted:array',
        'scopes' => 'array',
        'token_expires_at' => 'datetime',
        'is_active' => 'boolean',
        'last_read_at' => 'datetime',
    ];

    protected $hidden = [
        'credentials',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(UrpaSocialPost::class, 'social_account_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function token(): ?string
    {
        return $this->credentials['access_token'] ?? null;
    }
}
