<?php

namespace App\Modules\Coordinator\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ConfigurationSuggestion extends Model
{
    use HasUuids;

    protected $table = 'coord_configuration_suggestions';

    protected $fillable = [
        'organization_id',
        'coordinator_id',
        'agent_id',
        'suggestion_id',
        'type',
        'category',
        'priority',
        'current_config',
        'proposed_config',
        'evidence',
        'reasoning',
        'status',
        'requires_approval',
        'auto_apply_eligible',
        'reviewed_by_user_id',
        'reviewed_at',
        'review_notes',
    ];

    protected $casts = [
        'current_config' => 'array',
        'proposed_config' => 'array',
        'evidence' => 'array',
        'reviewed_at' => 'datetime',
        'requires_approval' => 'boolean',
        'auto_apply_eligible' => 'boolean',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function coordinator()
    {
        return $this->belongsTo(Coordinator::class, 'coordinator_id');
    }

    public function agent()
    {
        return $this->belongsTo(AiAgent::class, 'agent_id');
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
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
}




