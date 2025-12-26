<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RelationshipHistory extends Model
{
    use HasFactory;
    protected $table = 'relationship_history';

    protected $fillable = [
        'relationship_id',
        'actor_a_id',
        'actor_b_id',
        'task_id',
        'event_type',
        'outcome',
        'response_time_ms',
        'completion_time_ms',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    // Event Types
    const EVENT_TASK_SENT = 'TASK_SENT';
    const EVENT_TASK_ACCEPTED = 'TASK_ACCEPTED';
    const EVENT_TASK_REJECTED = 'TASK_REJECTED';
    const EVENT_TASK_COMPLETED = 'TASK_COMPLETED';
    const EVENT_TASK_CANCELLED = 'TASK_CANCELLED';
    const EVENT_TASK_DISPUTED = 'TASK_DISPUTED';

    // Outcomes
    const OUTCOME_SUCCESS = 'SUCCESS';
    const OUTCOME_FAILURE = 'FAILURE';
    const OUTCOME_CANCELLED = 'CANCELLED';
    const OUTCOME_DISPUTED = 'DISPUTED';

    /**
     * Get the relationship
     */
    public function relationship(): BelongsTo
    {
        return $this->belongsTo(Relationship::class);
    }

    /**
     * Get actor A
     */
    public function actorA(): BelongsTo
    {
        return $this->belongsTo(Actor::class, 'actor_a_id');
    }

    /**
     * Get actor B
     */
    public function actorB(): BelongsTo
    {
        return $this->belongsTo(Actor::class, 'actor_b_id');
    }

    /**
     * Get the task
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}

