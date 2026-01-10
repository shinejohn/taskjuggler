<?php

namespace App\Modules\Coordinator\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FaqSuggestion extends Model
{
    use HasUuids;

    protected $table = 'coord_faq_suggestions';

    protected $fillable = [
        'organization_id',
        'agent_id',
        'question',
        'proposed_answer',
        'context',
        'frequency',
        'priority',
        'first_asked_at',
        'last_asked_at',
        'cluster_id',
        'canonical_question',
        'status',
        'approved_faq_id',
        'reviewed_by_user_id',
        'reviewed_at',
        'review_notes',
    ];

    protected $casts = [
        'context' => 'array',
        'first_asked_at' => 'datetime',
        'last_asked_at' => 'datetime',
        'reviewed_at' => 'datetime',
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

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }

    // Methods
    public function approve(string $faqId, ?string $notes = null): void
    {
        $this->update([
            'status' => 'approved',
            'approved_faq_id' => $faqId,
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);
    }

    public function reject(?string $notes = null): void
    {
        $this->update([
            'status' => 'rejected',
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);
    }

    public function dismiss(?string $notes = null): void
    {
        $this->update([
            'status' => 'dismissed',
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending_review');
    }

    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }
}




