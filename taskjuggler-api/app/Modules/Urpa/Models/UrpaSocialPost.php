<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A social post drafted, scheduled, or published by URPA on behalf of a business.
 */
final class UrpaSocialPost extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'urpa_social_posts';

    protected $fillable = [
        'user_id',
        'social_account_id',
        'fibonacco_business_id',
        'content',
        'media',
        'status',
        'source',
        'scheduled_at',
        'published_at',
        'provider_post_id',
        'error',
        'metadata',
    ];

    protected $casts = [
        'media' => 'array',
        'metadata' => 'array',
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(UrpaSocialAccount::class, 'social_account_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeDue($query)
    {
        return $query->where('status', 'scheduled')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now());
    }
}
