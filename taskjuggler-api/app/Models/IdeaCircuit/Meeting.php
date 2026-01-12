<?php

namespace App\Models\IdeaCircuit;

use App\Models\User;
use App\Models\Task;
use App\Models\Appointment;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Meeting extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'ideacircuit_meetings';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'meeting_type',
        'status',
        'visibility',
        'requires_approval',
        'allow_guests',
        'max_participants',
        'guest_join_url',
        'guest_access_code',
        'guest_url_expires_at',
        'chime_meeting_id',
        'chime_region',
        'chime_external_id',
        'chime_media_placement',
        'ai_participant_enabled',
        'ai_script_id',
        'ai_voice_enabled',
        'ai_language',
        'recording_enabled',
        'recording_status',
        'transcription_enabled',
        'scheduled_at',
        'started_at',
        'ended_at',
        'duration_seconds',
        'settings',
        'metadata',
    ];

    protected $casts = [
        'requires_approval' => 'boolean',
        'allow_guests' => 'boolean',
        'ai_participant_enabled' => 'boolean',
        'ai_voice_enabled' => 'boolean',
        'recording_enabled' => 'boolean',
        'transcription_enabled' => 'boolean',
        'chime_media_placement' => 'array',
        'settings' => 'array',
        'metadata' => 'array',
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'guest_url_expires_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(MeetingParticipant::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(MeetingMessage::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(MeetingNote::class);
    }

    public function transcripts(): HasMany
    {
        return $this->hasMany(MeetingTranscript::class);
    }

    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'ideacircuit_meeting_tasks', 'meeting_id', 'task_id')
            ->withTimestamps();
    }

    public function appointments(): BelongsToMany
    {
        return $this->belongsToMany(Appointment::class, 'ideacircuit_meeting_appointments', 'meeting_id', 'appointment_id')
            ->withTimestamps();
    }
}
