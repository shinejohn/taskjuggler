<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasUuids;

    protected $table = 'coord_audit_logs';

    protected $fillable = [
        'organization_id',
        'agent_id',
        'session_id',
        'event_type',
        'resource_type',
        'resource_id',
        'data_accessed',
        'justification',
        'actor_type',
        'actor_id',
        'contains_phi',
        'contains_pii',
        'compliance_mode',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'data_accessed' => 'array',
        'metadata' => 'array',
        'contains_phi' => 'boolean',
        'contains_pii' => 'boolean',
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

    public function session()
    {
        return $this->belongsTo(AiAgentSession::class, 'session_id');
    }

    // Scopes
    public function scopeByEventType($query, string $eventType)
    {
        return $query->where('event_type', $eventType);
    }

    public function scopeByResource($query, string $resourceType, string $resourceId)
    {
        return $query->where('resource_type', $resourceType)
            ->where('resource_id', $resourceId);
    }

    public function scopeContainsPhi($query)
    {
        return $query->where('contains_phi', true);
    }

    public function scopeContainsPii($query)
    {
        return $query->where('contains_pii', true);
    }

    public function scopeByComplianceMode($query, string $mode)
    {
        return $query->where('compliance_mode', $mode);
    }
}




