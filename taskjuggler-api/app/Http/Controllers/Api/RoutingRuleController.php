<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoutingRule;
use App\Services\Routing\RuleEngine;
use Illuminate\Http\Request;

class RoutingRuleController extends Controller
{
    public function index(Request $request)
    {
        $rules = $request->user()
            ->routingRules()
            ->orderBy('priority')
            ->get();

        return response()->json($rules);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'conditions' => 'required|array',
            'conditions.match_type' => 'required|in:all,any',
            'conditions.rules' => 'required|array|min:1',
            'actions' => 'required|array',
            'actions.assignee_type' => 'required|in:self,team_member,marketplace_human,marketplace_ai',
        ]);

        // Get next priority
        $maxPriority = $request->user()->routingRules()->max('priority') ?? 0;

        $rule = RoutingRule::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'priority' => $maxPriority + 10,
            'is_active' => true,
        ]);

        return response()->json($rule, 201);
    }

    public function show(RoutingRule $routingRule)
    {
        $this->authorize('view', $routingRule);
        return response()->json($routingRule);
    }

    public function update(Request $request, RoutingRule $routingRule)
    {
        $this->authorize('update', $routingRule);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'conditions' => 'sometimes|array',
            'actions' => 'sometimes|array',
            'is_active' => 'sometimes|boolean',
        ]);

        $routingRule->update($validated);

        return response()->json($routingRule);
    }

    public function destroy(RoutingRule $routingRule)
    {
        $this->authorize('delete', $routingRule);
        $routingRule->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'rules' => 'required|array',
            'rules.*.id' => 'required|uuid|exists:routing_rules,id',
            'rules.*.priority' => 'required|integer|min:0',
        ]);

        foreach ($request->rules as $ruleData) {
            RoutingRule::where('id', $ruleData['id'])
                ->where('user_id', $request->user()->id)
                ->update(['priority' => $ruleData['priority']]);
        }

        return response()->json(['success' => true]);
    }

    public function test(Request $request, RuleEngine $ruleEngine)
    {
        $request->validate([
            'sample_data' => 'required|array',
        ]);

        $ruleEngine->forUser($request->user());
        $decision = $ruleEngine->evaluate($request->sample_data);

        return response()->json([
            'matched_rule' => $decision->ruleName,
            'assignee_type' => $decision->assigneeType,
            'priority' => $decision->priority,
            'auto_response' => $decision->autoResponse,
            'tags' => $decision->tags,
        ]);
    }
}
