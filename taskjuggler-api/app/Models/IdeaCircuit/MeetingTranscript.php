<?php

namespace App\Models\IdeaCircuit;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingTranscript extends Model
{
    use HasUuids;

    protected $table = 'ideacircuit_meeting_transcripts';

    protected $fillable = [
        'meeting_id',
        'participant_id',
        'transcript_text',
        'speaker_name',
        'speaker_id',
        'confidence_score',
        'is_final',
        'is_partial',
        'language',
        'detected_language',
        'start_time_ms',
        'end_time_ms',
        'duration_ms',
        'sentiment',
        'sentiment_score',
        'key_phrases',
        'entities',
        'topics',
        'action_items',
        'questions',
        'speaker_emotion',
        'speaking_rate_wpm',
        'metadata',
    ];

    protected $casts = [
        'is_final' => 'boolean',
        'is_partial' => 'boolean',
        'confidence_score' => 'decimal:2',
        'sentiment_score' => 'decimal:2',
        'key_phrases' => 'array',
        'entities' => 'array',
        'topics' => 'array',
        'action_items' => 'array',
        'questions' => 'array',
        'metadata' => 'array',
    ];

    // Relationships
    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(MeetingParticipant::class);
    }

    public function speaker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'speaker_id');
    }
}
