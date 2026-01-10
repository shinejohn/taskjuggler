<?php

namespace App\Modules\Coordinator\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PersonaConfiguration extends Model
{
    use HasUuids;

    protected $table = 'coord_persona_configurations';

    protected $fillable = [
        'organization_id',
        'coordinator_id',
        'agent_id',
        'version_id',
        'parent_version_id',
        'identity',
        'personality',
        'communication',
        'voice',
        'behavior',
        'prompts',
        'approval_status',
        'approved_by_user_id',
        'approved_at',
        'approval_notes',
        'baseline_metrics',
        'current_metrics',
        'review_date',
        'is_active',
    ];

    protected $casts = [
        'identity' => 'array',
        'personality' => 'array',
        'communication' => 'array',
        'voice' => 'array',
        'behavior' => 'array',
        'prompts' => 'array',
        'baseline_metrics' => 'array',
        'current_metrics' => 'array',
        'approved_at' => 'datetime',
        'review_date' => 'date',
        'is_active' => 'boolean',
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

    public function parentVersion()
    {
        return $this->belongsTo(PersonaConfiguration::class, 'parent_version_id');
    }

    public function childVersions()
    {
        return $this->hasMany(PersonaConfiguration::class, 'parent_version_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }

    public function consensusRequests()
    {
        return $this->hasMany(ConsensusRequest::class, 'persona_configuration_id');
    }

    // Methods
    public function approve(User $user, ?string $notes = null): void
    {
        $this->update([
            'approval_status' => 'approved',
            'approved_by_user_id' => $user->id,
            'approved_at' => now(),
            'approval_notes' => $notes,
            'is_active' => true,
        ]);

        // Deactivate other versions for this coordinator
        static::where('coordinator_id', $this->coordinator_id)
            ->where('id', '!=', $this->id)
            ->update(['is_active' => false]);
    }

    public function reject(?string $notes = null): void
    {
        $this->update([
            'approval_status' => 'rejected',
            'approval_notes' => $notes,
        ]);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }
}




