<?php

namespace App\Services\AI;

use App\Models\Task;
use App\Models\Actor;
use App\Models\DelegationRule;
use Illuminate\Support\Facades\Log;

/**
 * Delegation Engine
 * 
 * Determines when and how to delegate tasks to AI agents
 */
class DelegationEngine
{
    private McpServerService $mcpService;

    public function __construct(McpServerService $mcpService)
    {
        $this->mcpService = $mcpService;
    }

    /**
     * Evaluate if task should be delegated to an AI agent
     */
    public function shouldDelegate(Task $task): ?Actor
    {
        // Check delegation rules
        $rules = DelegationRule::where(function ($query) {
                $query->where('status', 'active')
                    ->orWhere(function ($q) {
                        $q->where('is_active', true)
                          ->whereNull('status');
                    });
            })
            ->orderBy('priority', 'asc')
            ->get();

        foreach ($rules as $rule) {
            if ($this->evaluateRule($rule, $task)) {
                $agent = $this->findMatchingAgent($rule, $task);
                if ($agent) {
                    return $agent;
                }
            }
        }

        // Check if task has explicit AI agent assignment
        if ($task->owner_id) {
            $ownerActor = Actor::where('user_id', $task->owner_id)
                ->where('actor_type', Actor::TYPE_AI_AGENT)
                ->where('status', Actor::STATUS_ACTIVE)
                ->first();

            if ($ownerActor) {
                return $ownerActor;
            }
        }

        return null;
    }

    /**
     * Delegate task to AI agent
     */
    public function delegateToAgent(Task $task, Actor $agent): bool
    {
        try {
            // Update task owner
            $task->update([
                'owner_id' => $agent->user_id,
                'status' => 'pending',
            ]);

            // Send task to agent via MCP
            $success = $this->mcpService->sendTaskToAgent($agent, $task);

            if ($success) {
                Log::info('Task delegated to AI agent', [
                    'task_id' => $task->id,
                    'agent_id' => $agent->id,
                ]);

                // Record delegation in rule history if applicable
                $this->recordDelegation($task, $agent);

                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Failed to delegate task to agent', [
                'task_id' => $task->id,
                'agent_id' => $agent->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Evaluate delegation rule against task
     */
    private function evaluateRule(DelegationRule $rule, Task $task): bool
    {
        $conditions = $rule->conditions ?? [];

        foreach ($conditions as $condition) {
            if (!$this->evaluateCondition($condition, $task)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Evaluate a single condition
     */
    private function evaluateCondition(array $condition, Task $task): bool
    {
        $field = $condition['field'] ?? null;
        $operator = $condition['operator'] ?? null;
        $value = $condition['value'] ?? null;

        if (!$field || !$operator) {
            return false;
        }

        $taskValue = $this->getTaskFieldValue($task, $field);

        return match ($operator) {
            'equals' => $taskValue == $value,
            'not_equals' => $taskValue != $value,
            'contains' => str_contains(strtolower($taskValue ?? ''), strtolower($value ?? '')),
            'in' => in_array($taskValue, (array) $value),
            'not_in' => !in_array($taskValue, (array) $value),
            'greater_than' => $taskValue > $value,
            'less_than' => $taskValue < $value,
            'matches_regex' => preg_match($value, $taskValue ?? ''),
            default => false,
        };
    }

    /**
     * Get task field value
     */
    private function getTaskFieldValue(Task $task, string $field): mixed
    {
        return match ($field) {
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status,
            'priority' => $task->priority,
            'due_date' => $task->due_date?->toIso8601String(),
            'tags' => $task->tags ?? [],
            'source_channel' => $task->source_channel,
            default => $task->metadata[$field] ?? null,
        };
    }

    /**
     * Find matching agent for rule
     */
    private function findMatchingAgent(DelegationRule $rule, Task $task): ?Actor
    {
        $targetActorId = $rule->target_actor_id ?? null;
        
        if ($targetActorId) {
            $agent = Actor::find($targetActorId);
            if ($agent && $agent->actor_type === Actor::TYPE_AI_AGENT && $agent->status === Actor::STATUS_ACTIVE) {
                // Check if agent has required capabilities
                if ($this->agentHasCapabilities($agent, $rule->required_capabilities ?? [])) {
                    return $agent;
                }
            }
        }

        // Find agent by capabilities
        $requiredCapabilities = $rule->required_capabilities ?? [];
        if (!empty($requiredCapabilities)) {
            $agents = Actor::where('actor_type', Actor::TYPE_AI_AGENT)
                ->where('status', Actor::STATUS_ACTIVE)
                ->get();

            foreach ($agents as $agent) {
                if ($this->agentHasCapabilities($agent, $requiredCapabilities)) {
                    return $agent;
                }
            }
        }

        return null;
    }

    /**
     * Check if agent has required capabilities
     */
    private function agentHasCapabilities(Actor $agent, array $requiredCapabilities): bool
    {
        $agentCapabilities = $agent->capabilities ?? [];
        
        foreach ($requiredCapabilities as $required) {
            if (!in_array($required, $agentCapabilities)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Record delegation in rule history
     */
    private function recordDelegation(Task $task, Actor $agent): void
    {
        try {
            // Update rule execution count if rule exists
            $rule = DelegationRule::where('target_actor_id', $agent->id)
                ->where('status', 'active')
                ->first();

            if ($rule) {
                $rule->increment('execution_count');
            }
        } catch (\Exception $e) {
            Log::warning('Failed to record delegation', [
                'task_id' => $task->id,
                'agent_id' => $agent->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Auto-delegate pending tasks
     */
    public function autoDelegatePendingTasks(): int
    {
        $delegatedCount = 0;

        $pendingTasks = Task::where('status', 'pending')
            ->whereNull('owner_id')
            ->get();

        foreach ($pendingTasks as $task) {
            $agent = $this->shouldDelegate($task);
            if ($agent) {
                if ($this->delegateToAgent($task, $agent)) {
                    $delegatedCount++;
                }
            }
        }

        return $delegatedCount;
    }
}
