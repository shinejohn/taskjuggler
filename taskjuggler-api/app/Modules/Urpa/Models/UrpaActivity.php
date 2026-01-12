<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaActivity extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_activities';

    protected $fillable = [
        'user_id',
        'activity_type',
        'source',
        'title',
        'description',
        'raw_content',
        'status',
        'is_read',
        'is_starred',
        'contact_id',
        'external_id',
        'activity_timestamp',
    ];

    protected $casts = [
        'raw_content' => 'array',
        'is_read' => 'boolean',
        'is_starred' => 'boolean',
        'activity_timestamp' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(UrpaContact::class);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeStarred($query)
    {
        return $query->where('is_starred', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('activity_type', $type);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('activity_timestamp', '>=', now()->subDays($days));
    }

    // Methods
    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }

    public function toggleStar(): void
    {
        $this->update(['is_starred' => !$this->is_starred]);
    }
}

