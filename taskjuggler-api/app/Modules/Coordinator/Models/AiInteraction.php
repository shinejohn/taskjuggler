<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiInteraction extends Model
{
    use HasUuids;

    protected $table = 'coord_ai_interactions';

    protected $fillable = [
        'organization_id',
        'agent_id',
        'contact_id',
        'session_id',
        'interaction_id',
        'channel',
        'started_at',
        'ended_at',
        'duration_seconds',
        'customer_identified',
        'customer_info',
        'intent',
        'outcome',
        'conversation_summary',
        'transcript_reference',
        'sentiment',
        'faqs_used',
        'unknown_questions',
        'agent_version',
        'analyzed_for_learning',
        'analyzed_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'customer_identified' => 'boolean',
        'customer_info' => 'array',
        'intent' => 'array',
        'outcome' => 'array',
        'sentiment' => 'array',
        'faqs_used' => 'array',
        'unknown_questions' => 'array',
        'analyzed_for_learning' => 'boolean',
        'analyzed_at' => 'datetime',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function agent()
    {
        return $this->belongsTo(AiAgent::class, 'agent_id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function session()
    {
        return $this->belongsTo(AiAgentSession::class, 'session_id');
    }

    public function feedback()
    {
        return $this->hasMany(AiFeedback::class, 'interaction_id');
    }

    // Methods
    public function calculateDuration(): int
    {
        if ($this->ended_at && $this->started_at) {
            return $this->started_at->diffInSeconds($this->ended_at);
        }
        return 0;
    }

    public function markAsAnalyzed(): void
    {
        $this->update([
            'analyzed_for_learning' => true,
            'analyzed_at' => now(),
        ]);
    }

    // Scopes
    public function scopeUnanalyzed($query)
    {
        return $query->where('analyzed_for_learning', false);
    }

    public function scopeByChannel($query, string $channel)
    {
        return $query->where('channel', $channel);
    }

    public function scopeByAgent($query, string $agentId)
    {
        return $query->where('agent_id', $agentId);
    }
}




