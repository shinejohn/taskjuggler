<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DelegationRule extends Model
{
    protected $fillable = [
        'delegator_id',
        'delegate_id',
        'target_actor_id',
        'scope',
        'constraints',
        'conditions',
        'is_active',
        'status',
        'priority',
        'required_capabilities',
        'execution_count',
        'expires_at',
    ];

    protected $casts = [
        'scope' => 'array',
        'constraints' => 'array',
        'conditions' => 'array',
        'required_capabilities' => 'array',
        'is_active' => 'boolean',
        'execution_count' => 'integer',
        'priority' => 'integer',
        'expires_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'active',
        'priority' => 100,
        'execution_count' => 0,
    ];

    /**
     * Get the delegator actor
     */
    public function delegator(): BelongsTo
    {
        return $this->belongsTo(Actor::class, 'delegator_id');
    }

    /**
     * Get the delegate actor
     */
    public function delegate(): BelongsTo
    {
        return $this->belongsTo(Actor::class, 'delegate_id');
    }

    /**
     * Check if rule is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if rule is active
     */
    public function isActive(): bool
    {
        $status = $this->status ?? ($this->is_active ? 'active' : 'inactive');
        return $status === 'active' && !$this->isExpired();
    }

    /**
     * Get target actor ID (delegate_id or target_actor_id)
     */
    public function getTargetActorIdAttribute(): ?string
    {
        return $this->target_actor_id ?? $this->delegate_id;
    }

    /**
     * Get conditions (from constraints or conditions field)
     */
    public function getConditionsAttribute(): array
    {
        return $this->attributes['conditions'] ?? $this->constraints ?? [];
    }

    /**
     * Get required capabilities
     */
    public function getRequiredCapabilitiesAttribute(): array
    {
        return $this->attributes['required_capabilities'] ?? [];
    }

    /**
     * Check if task matches scope
     */
    public function matchesScope(array $taskData): bool
    {
        $scope = $this->scope ?? [];
        
        // Check task types
        if (!empty($scope['task_types'])) {
            if (!in_array($taskData['task_type'] ?? 'ACTION', $scope['task_types'])) {
                return false;
            }
        }
        
        // Check max priority
        if (!empty($scope['max_priority'])) {
            $priorityOrder = ['BACKGROUND' => 1, 'LOW' => 2, 'NORMAL' => 3, 'HIGH' => 4, 'CRITICAL' => 5];
            $taskPriority = $taskData['priority'] ?? 'NORMAL';
            if (($priorityOrder[$taskPriority] ?? 3) > ($priorityOrder[$scope['max_priority']] ?? 3)) {
                return false;
            }
        }
        
        return true;
    }
}

