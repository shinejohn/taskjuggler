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
        $this->rules = $user->routingRules()->where('is_active', true)->get();
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
            tags: array_merge($actions['tags'] ?? [], [$data['category']]),
            taskTitle: $data['summary'],
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
            tags: [$data['category'], 'unrouted'],
            taskTitle: $data['summary'],
            taskDescription: $this->buildDescription($data),
        );
    }

    private function buildDescription(array $data): string
    {
        $parts = [];
        
        if ($data['contact']['name']) {
            $parts[] = "**From:** {$data['contact']['name']}";
        }
        if ($data['contact']['phone']) {
            $parts[] = "**Phone:** {$data['contact']['phone']}";
        }
        if ($data['contact']['email']) {
            $parts[] = "**Email:** {$data['contact']['email']}";
        }
        if ($data['location']['address']) {
            $location = implode(', ', array_filter([
                $data['location']['address'],
                $data['location']['unit'],
                $data['location']['city'],
                $data['location']['state'],
                $data['location']['zip'],
            ]));
            $parts[] = "**Location:** {$location}";
        }

        return implode("\n", $parts);
    }
}
