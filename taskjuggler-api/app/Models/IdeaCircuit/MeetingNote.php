<?php

namespace App\Models\IdeaCircuit;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingNote extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'ideacircuit_meeting_notes';

    protected $fillable = [
        'meeting_id',
        'user_id',
        'category',
        'content',
        'note_type',
        'tags',
        'priority',
        'status',
        'assigned_to',
        'due_date',
        'is_shared',
        'shared_with_participant_ids',
        'confidence_score',
        'extracted_from_transcript',
        'source_timestamp_ms',
        'completed_at',
        'metadata',
    ];

    protected $casts = [
        'is_shared' => 'boolean',
        'extracted_from_transcript' => 'boolean',
        'tags' => 'array',
        'shared_with_participant_ids' => 'array',
        'confidence_score' => 'decimal:2',
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
        'metadata' => 'array',
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

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
