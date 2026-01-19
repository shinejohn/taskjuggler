<?php

namespace App\Modules\Communications\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommunicationCall extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'communication_calls';

    protected $fillable = [
        'user_id',
        'caller_number',
        'callee_number',
        'direction',
        'status',
        'aws_connect_contact_id',
        'recording_url',
        'transcription_id',
        'metadata',
        'initiated_at',
        'connected_at',
        'ended_at',
        'duration_seconds',
    ];

    protected $casts = [
        'metadata' => 'array',
        'initiated_at' => 'datetime',
        'connected_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recordings(): HasMany
    {
        return $this->hasMany(CommunicationRecording::class, 'call_id');
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeInbound($query)
    {
        return $query->where('direction', 'inbound');
    }

    public function scopeOutbound($query)
    {
        return $query->where('direction', 'outbound');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Methods
    public function markAsConnected(): void
    {
        $this->update([
            'status' => 'connected',
            'connected_at' => now(),
        ]);
    }

    public function markAsCompleted(): void
    {
        $duration = $this->connected_at 
            ? now()->diffInSeconds($this->connected_at)
            : null;

        $this->update([
            'status' => 'completed',
            'ended_at' => now(),
            'duration_seconds' => $duration,
        ]);
    }

    public function markAsFailed(string $reason = null): void
    {
        $this->update([
            'status' => 'failed',
            'ended_at' => now(),
            'metadata' => array_merge($this->metadata ?? [], ['failure_reason' => $reason]),
        ]);
    }
}

