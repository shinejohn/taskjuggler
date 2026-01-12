<?php

namespace App\Modules\Coordinator\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ConsensusRequest extends Model
{
    use HasUuids;

    protected $table = 'coord_consensus_requests';

    protected $fillable = [
        'organization_id',
        'coordinator_id',
        'persona_configuration_id',
        'consensus_id',
        'initiated_by',
        'category',
        'specific_element',
        'ai_agent_position',
        'command_center_position',
        'conflict_type',
        'proposed_resolution',
        'status',
        'requires_smb_approval',
        'resolution',
        'resolved_by_user_id',
        'resolved_at',
    ];

    protected $casts = [
        'ai_agent_position' => 'array',
        'command_center_position' => 'array',
        'proposed_resolution' => 'array',
        'resolution' => 'array',
        'resolved_at' => 'datetime',
        'requires_smb_approval' => 'boolean',
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

    public function personaConfiguration()
    {
        return $this->belongsTo(PersonaConfiguration::class, 'persona_configuration_id');
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by_user_id');
    }

    // Methods
    public function resolve(User $user, array $resolution): void
    {
        $this->update([
            'status' => 'resolved',
            'resolution' => $resolution,
            'resolved_by_user_id' => $user->id,
            'resolved_at' => now(),
        ]);
    }

    public function autoResolve(array $resolution): void
    {
        $this->update([
            'status' => 'auto_resolved',
            'resolution' => $resolution,
            'resolved_at' => now(),
        ]);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRequiresApproval($query)
    {
        return $query->where('requires_smb_approval', true)->where('status', 'pending');
    }

    public function scopeByConflictType($query, string $type)
    {
        return $query->where('conflict_type', $type);
    }
}




