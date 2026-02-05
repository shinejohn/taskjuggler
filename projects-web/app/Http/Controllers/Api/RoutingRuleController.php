<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoutingRule;
use App\Services\Routing\RuleEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoutingRuleController extends Controller
{
    public function index(Request $request)
    {
        $rules = RoutingRule::where('organization_id', $request->user()->organization_id)
            ->where('user_id', $request->user()->id)
            ->orderBy('priority')
            ->get();

        return response()->json($rules);
    }

    public function store(Request $request): JsonResponse
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
        $maxPriority = RoutingRule::where('organization_id', $request->user()->organization_id)
            ->where('user_id', $request->user()->id)
            ->max('priority') ?? 0;

        $rule = RoutingRule::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
            'priority' => $maxPriority + 10,
            'is_active' => true,
        ]);

        return response()->json($rule, 201);
    }

    public function show(RoutingRule $routingRule): JsonResponse
    {
        // Check organization access
        if ($routingRule->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        return response()->json($routingRule);
    }

    public function update(Request $request, RoutingRule $routingRule): JsonResponse
    {
        // Check organization access
        if ($routingRule->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

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

    public function destroy(RoutingRule $routingRule): JsonResponse
    {
        // Check organization access
        if ($routingRule->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $routingRule->delete();

        return response()->json(null, 204);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'rules' => 'required|array',
            'rules.*.id' => 'required|uuid|exists:routing_rules,id',
            'rules.*.priority' => 'required|integer|min:0',
        ]);

        foreach ($request->rules as $ruleData) {
            RoutingRule::where('id', $ruleData['id'])
                ->where('organization_id', $request->user()->organization_id)
                ->where('user_id', $request->user()->id)
                ->update(['priority' => $ruleData['priority']]);
        }

        return response()->json(['success' => true]);
    }

    public function test(Request $request, RuleEngine $ruleEngine): JsonResponse
    {
        $request->validate([
            'sample_data' => 'required|array',
        ]);

        $ruleEngine->forUser($request->user());
        $decision = $ruleEngine->evaluate($request->sample_data);

        return response()->json([
            'matched' => $decision->matched,
            'rule' => $decision->ruleId ? RoutingRule::find($decision->ruleId) : null,
            'decision' => $decision,
        ]);
    }
}
