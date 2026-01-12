<?php

namespace App\Models\IdeaCircuit;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MeetingParticipant extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'ideacircuit_meeting_participants';

    protected $fillable = [
        'meeting_id',
        'user_id',
        'is_guest',
        'guest_name',
        'guest_email',
        'guest_access_token',
        'guest_expires_at',
        'display_name',
        'avatar_url',
        'role',
        'chime_attendee_id',
        'chime_external_user_id',
        'chime_join_token',
        'is_active',
        'connection_status',
        'joined_at',
        'left_at',
        'total_duration_seconds',
        'is_muted',
        'is_video_off',
        'is_screen_sharing',
        'can_chat',
        'can_share_screen',
        'can_record',
        'can_view_notes',
        'can_edit_notes',
        'can_invite_others',
        'metadata',
    ];

    protected $casts = [
        'is_guest' => 'boolean',
        'is_active' => 'boolean',
        'is_muted' => 'boolean',
        'is_video_off' => 'boolean',
        'is_screen_sharing' => 'boolean',
        'can_chat' => 'boolean',
        'can_share_screen' => 'boolean',
        'can_record' => 'boolean',
        'can_view_notes' => 'boolean',
        'can_edit_notes' => 'boolean',
        'can_invite_others' => 'boolean',
        'metadata' => 'array',
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
        'guest_expires_at' => 'datetime',
    ];

    // Relationships
    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(MeetingMessage::class);
    }
}
