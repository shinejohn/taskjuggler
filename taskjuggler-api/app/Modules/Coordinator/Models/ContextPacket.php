<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ContextPacket extends Model
{
    use HasUuids;

    protected $table = 'coord_context_packets';

    protected $fillable = [
        'organization_id',
        'agent_id',
        'packet_id',
        'version',
        'checksum',
        'platform_knowledge',
        'industry_id',
        'industry_knowledge',
        'business_profile',
        'business_faqs',
        'team',
        'calendar_summary',
        'conversation_context',
        'rules',
        'ttl_seconds',
        'refresh_after_seconds',
        'invalidation_events',
        'generated_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'platform_knowledge' => 'array',
        'industry_knowledge' => 'array',
        'business_profile' => 'array',
        'business_faqs' => 'array',
        'team' => 'array',
        'calendar_summary' => 'array',
        'conversation_context' => 'array',
        'rules' => 'array',
        'invalidation_events' => 'array',
        'generated_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
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

    public function invalidations()
    {
        return $this->hasMany(ContextInvalidation::class, 'context_packet_id');
    }

    // Methods
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function needsRefresh(): bool
    {
        if ($this->isExpired()) {
            return true;
        }

        $refreshTime = $this->generated_at->addSeconds($this->refresh_after_seconds);
        return now()->isAfter($refreshTime);
    }

    public function getFullPacket(): array
    {
        return [
            'header' => [
                'packet_id' => $this->packet_id,
                'generated_at' => $this->generated_at->toIso8601String(),
                'expires_at' => $this->expires_at->toIso8601String(),
                'business_id' => $this->organization_id,
                'agent_type' => $this->agent?->agent_type,
                'version' => $this->version,
                'checksum' => $this->checksum,
            ],
            'platform_knowledge' => $this->platform_knowledge,
            'industry_knowledge' => $this->industry_knowledge,
            'business_profile' => $this->business_profile,
            'business_faqs' => $this->business_faqs,
            'team' => $this->team,
            'calendar_summary' => $this->calendar_summary,
            'conversation_context' => $this->conversation_context,
            'rules' => $this->rules,
        ];
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', now());
    }

    public function scopeForAgent($query, string $agentId)
    {
        return $query->where('agent_id', $agentId);
    }

    public function scopeForOrganization($query, string $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }
}




