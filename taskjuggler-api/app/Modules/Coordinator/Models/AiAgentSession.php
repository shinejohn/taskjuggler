<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiAgentSession extends Model
{
    use HasUuids;

    protected $table = 'coord_ai_agent_sessions';

    protected $fillable = [
        'agent_id',
        'organization_id',
        'session_token',
        'session_type',
        'permissions',
        'restrictions',
        'expires_at',
        'last_used_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'permissions' => 'array',
        'restrictions' => 'array',
        'expires_at' => 'datetime',
        'last_used_at' => 'datetime',
    ];

    // Relationships
    public function agent()
    {
        return $this->belongsTo(AiAgent::class, 'agent_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function interactions()
    {
        return $this->hasMany(AiInteraction::class, 'session_id');
    }

    // Methods
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions ?? []);
    }

    public function hasRestriction(string $restriction): bool
    {
        return in_array($restriction, $this->restrictions ?? []);
    }

    public function touchLastUsed()
    {
        $this->update(['last_used_at' => now()]);
    }

    // Scopes
    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }
}




