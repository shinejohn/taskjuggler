<?php

namespace App\Modules\Urpa\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UrpaAiSession extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_ai_sessions';

    protected $fillable = [
        'user_id',
        'session_type',
        'persona_used',
        'status',
        'started_at',
        'ended_at',
        'message_count',
        'ai_request_count',
        'context',
    ];

    protected $casts = [
        'context' => 'array',
        'message_count' => 'integer',
        'ai_request_count' => 'integer',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(UrpaAiMessage::class, 'session_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(UrpaAiTask::class, 'session_id');
    }

    public function artifacts(): HasMany
    {
        return $this->hasMany(UrpaArtifact::class, 'session_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('session_type', $type);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // Methods
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'ended_at' => now(),
        ]);
    }

    public function incrementMessageCount(): void
    {
        $this->increment('message_count');
    }

    public function incrementAiRequestCount(): void
    {
        $this->increment('ai_request_count');
    }

    public function getDurationAttribute(): ?int
    {
        if (!$this->started_at || !$this->ended_at) {
            return null;
        }
        return $this->ended_at->diffInSeconds($this->started_at);
    }
}

