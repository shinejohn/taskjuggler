<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaPhoneCall extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_phone_calls';

    protected $fillable = [
        'user_id',
        'direction',
        'caller_number',
        'callee_number',
        'status',
        'duration_seconds',
        'handled_by_ai',
        'ai_persona_used',
        'recording_url',
        'recording_storage_path',
        'transcript',
        'ai_summary',
        'actions_taken',
        'vapi_call_id',
        'vapi_assistant_id',
        'contact_id',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'handled_by_ai' => 'boolean',
        'duration_seconds' => 'integer',
        'actions_taken' => 'array',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
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

    public function scopeHandledByAi($query)
    {
        return $query->where('handled_by_ai', true);
    }

    // Methods
    public function getDurationFormattedAttribute(): string
    {
        $seconds = $this->duration_seconds ?? 0;
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;
        return sprintf('%d:%02d', $minutes, $remainingSeconds);
    }

    public function markAsCompleted(int $durationSeconds): void
    {
        $this->update([
            'status' => 'completed',
            'duration_seconds' => $durationSeconds,
            'ended_at' => now(),
        ]);
    }
}

