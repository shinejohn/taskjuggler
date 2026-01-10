<?php

namespace App\Modules\Urpa\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UrpaAiMessage extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'urpa_ai_messages';

    protected $fillable = [
        'session_id',
        'role',
        'content',
        'is_voice',
        'audio_url',
        'transcript',
        'used_prerecorded',
        'prerecorded_response_id',
        'input_tokens',
        'output_tokens',
    ];

    protected $casts = [
        'is_voice' => 'boolean',
        'used_prerecorded' => 'boolean',
        'input_tokens' => 'integer',
        'output_tokens' => 'integer',
    ];

    // Relationships
    public function session(): BelongsTo
    {
        return $this->belongsTo(UrpaAiSession::class, 'session_id');
    }

    public function prerecordedResponse(): BelongsTo
    {
        return $this->belongsTo(UrpaVoiceResponse::class, 'prerecorded_response_id');
    }

    // Scopes
    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    public function scopeVoice($query)
    {
        return $query->where('is_voice', true);
    }

    public function scopePrerecorded($query)
    {
        return $query->where('used_prerecorded', true);
    }
}

