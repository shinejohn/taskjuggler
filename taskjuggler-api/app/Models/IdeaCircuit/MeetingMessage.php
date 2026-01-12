<?php

namespace App\Models\IdeaCircuit;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingMessage extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'ideacircuit_meeting_messages';

    protected $fillable = [
        'meeting_id',
        'participant_id',
        'user_id',
        'message_text',
        'message_type',
        'reply_to_message_id',
        'thread_count',
        'is_ai_generated',
        'sentiment',
        'intent',
        'confidence_score',
        'mentioned_users',
        'action_items',
        'key_phrases',
        'has_attachments',
        'attachment_urls',
        'is_edited',
        'is_deleted',
        'edited_at',
        'deleted_at',
        'metadata',
    ];

    protected $casts = [
        'is_ai_generated' => 'boolean',
        'has_attachments' => 'boolean',
        'is_edited' => 'boolean',
        'is_deleted' => 'boolean',
        'confidence_score' => 'decimal:2',
        'mentioned_users' => 'array',
        'action_items' => 'array',
        'key_phrases' => 'array',
        'attachment_urls' => 'array',
        'metadata' => 'array',
        'edited_at' => 'datetime',
        'deleted_at' => 'datetime',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(MeetingMessage::class, 'reply_to_message_id');
    }
}
