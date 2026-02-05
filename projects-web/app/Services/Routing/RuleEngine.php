<?php

namespace App\Services\Routing;

use App\Models\User;
use App\Models\RoutingRule;
use Illuminate\Support\Collection;

class RuleEngine
{
    private User $user;
    private Collection $rules;
    private Collection $contactLists;
    private ConditionEvaluator $evaluator;

    public function __construct(ConditionEvaluator $evaluator)
    {
        $this->evaluator = $evaluator;
    }

    public function forUser(User $user): self
    {
        $this->user = $user;
        $this->rules = RoutingRule::where('organization_id', $user->organization_id)
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->orderBy('priority')
            ->get();
        $this->contactLists = $user->contactLists()->with('members')->get();
        
        return $this;
    }

    public function evaluate(array $extractedData): RoutingDecision
    {
        foreach ($this->rules as $rule) {
            if ($this->matchesRule($rule, $extractedData)) {
                $rule->incrementMatches();
                return $this->buildDecision($rule, $extractedData);
            }
        }

        return $this->defaultDecision($extractedData);
    }

    private function matchesRule(RoutingRule $rule, array $data): bool
    {
        $conditions = $rule->conditions;
        $matchType = $conditions['match_type'] ?? 'all';
        $results = [];

        foreach ($conditions['rules'] ?? [] as $condition) {
            $results[] = $this->evaluator->evaluate($condition, $data, $this->contactLists);
        }

        if (empty($results)) {
            return false;
        }

        return $matchType === 'all'
            ? !in_array(false, $results, true)
            : in_array(true, $results, true);
    }

    private function buildDecision(RoutingRule $rule, array $data): RoutingDecision
    {
        $actions = $rule->actions;

        return new RoutingDecision(
            ruleId: $rule->id,
            ruleName: $rule->name,
            createTask: $actions['create_task'] ?? true,
            requestorId: $this->user->id,
            assigneeType: $actions['assignee_type'] ?? 'self',
            assigneeId: $actions['assignee_id'] ?? $this->user->id,
            priority: $actions['priority'] ?? 'normal',
            notifications: $actions['notifications'] ?? [],
            autoResponse: $actions['auto_response'] ?? null,
            tags: array_merge($actions['tags'] ?? [], [$data['category'] ?? 'general']),
            taskTitle: $data['summary'] ?? 'New Task',
            taskDescription: $this->buildDescription($data),
        );
    }

    private function defaultDecision(array $data): RoutingDecision
    {
        return new RoutingDecision(
            ruleId: null,
            ruleName: 'default',
            createTask: true,
            requestorId: $this->user->id,
            assigneeType: 'self',
            assigneeId: $this->user->id,
            priority: 'normal',
            notifications: [['type' => 'digest', 'recipient' => 'owner']],
            autoResponse: null,
            tags: [($data['category'] ?? 'general'), 'unrouted'],
            taskTitle: $data['summary'] ?? 'New Task',
            taskDescription: $this->buildDescription($data),
        );
    }

    private function buildDescription(array $data): string
    {
        $parts = [];
        
        if (!empty($data['summary'])) {
            $parts[] = $data['summary'];
        } elseif (!empty($data['description'])) {
            $parts[] = $data['description'];
        } elseif (!empty($data['body'])) {
            $parts[] = $data['body'];
        }
        
        if (!empty($data['contact'])) {
            $contact = $data['contact'];
            $contactParts = [];
            if (!empty($contact['name'])) $contactParts[] = $contact['name'];
            if (!empty($contact['phone'])) $contactParts[] = $contact['phone'];
            if (!empty($contact['email'])) $contactParts[] = $contact['email'];
            if (!empty($contactParts)) {
                $parts[] = 'Contact: ' . implode(', ', $contactParts);
            }
        }
        
        return implode("\n\n", $parts) ?: 'Task from ' . ($data['source'] ?? 'unknown source');
    }
}
