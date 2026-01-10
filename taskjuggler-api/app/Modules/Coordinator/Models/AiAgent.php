<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Hash;

class AiAgent extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'coord_ai_agents';

    protected $fillable = [
        'organization_id',
        'coordinator_id',
        'agent_id',
        'agent_type',
        'agent_name',
        'version',
        'platform',
        'deployment_id',
        'capabilities',
        'agent_secret_hash',
        'last_authenticated_at',
        'status',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'last_authenticated_at' => 'datetime',
    ];

    protected $hidden = [
        'agent_secret_hash',
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

    public function sessions()
    {
        return $this->hasMany(AiAgentSession::class, 'agent_id');
    }

    public function interactions()
    {
        return $this->hasMany(AiInteraction::class, 'agent_id');
    }

    public function contextPackets()
    {
        return $this->hasMany(ContextPacket::class, 'agent_id');
    }

    public function personaConfigurations()
    {
        return $this->hasMany(PersonaConfiguration::class, 'agent_id');
    }

    // Methods
    public function setAgentSecretAttribute($value)
    {
        $this->attributes['agent_secret_hash'] = Hash::make($value);
    }

    public function verifySecret($secret): bool
    {
        return Hash::check($secret, $this->agent_secret_hash);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->deleted_at === null;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active')->whereNull('deleted_at');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('agent_type', $type);
    }
}




