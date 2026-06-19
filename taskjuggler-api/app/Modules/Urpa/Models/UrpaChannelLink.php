<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Maps an external messaging identity (per channel) to a Fibonacco user so the
 * Personal Assistant knows who a message belongs to and where to reply.
 */
final class UrpaChannelLink extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'urpa_channel_links';

    protected $fillable = [
        'user_id',
        'channel',
        'external_user_id',
        'external_chat_id',
        'display_name',
        'credentials',
        'is_active',
        'auto_reply',
        'last_inbound_at',
        'last_outbound_at',
    ];

    protected $casts = [
        // Encrypted so per-user bot tokens never sit in plaintext in the DB.
        'credentials' => 'encrypted:array',
        'is_active' => 'boolean',
        'auto_reply' => 'boolean',
        'last_inbound_at' => 'datetime',
        'last_outbound_at' => 'datetime',
    ];

    protected $hidden = [
        'credentials',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
