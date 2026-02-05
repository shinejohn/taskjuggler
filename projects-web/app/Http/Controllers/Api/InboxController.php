<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InboxItem;
use App\Models\RoutingRule;
use App\Models\Task;
use App\Services\AI\NLPExtractor;
use App\Services\Routing\RuleEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InboxController extends Controller
{
    public function __construct(
        protected NLPExtractor $nlpExtractor,
        protected RuleEngine $ruleEngine
    ) {}

    public function index(Request $request)
    {
        $query = InboxItem::where('organization_id', $request->user()->organization_id)
            ->where('user_id', $request->user()->id)
            ->with(['channel', 'task', 'routingRule']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('source_type')) {
            $query->where('source_type', $request->source_type);
        }

        $inboxItems = $query->orderBy('received_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($inboxItems);
    }

    public function show(InboxItem $inboxItem): JsonResponse
    {
        // Check organization access
        if ($inboxItem->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $inboxItem->load(['channel', 'task', 'routingRule']);

        return response()->json($inboxItem);
    }

    public function process(Request $request, InboxItem $inboxItem): JsonResponse
    {
        // Check organization access
        if ($inboxItem->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        if ($inboxItem->status !== InboxItem::STATUS_UNPROCESSED) {
            return response()->json(['error' => 'Inbox item already processed'], 400);
        }

        // Extract data using NLP
        $extracted = $this->nlpExtractor->extract($inboxItem->body);
        $extracted['source'] = $inboxItem->source_type;
        // Ensure extracted data has required fields for routing
        if (!isset($extracted['summary'])) {
            $extracted['summary'] = $inboxItem->subject ?? substr($inboxItem->body, 0, 100);
        }
        if (!isset($extracted['category'])) {
            $extracted['category'] = 'general';
        }
        if (!isset($extracted['contact'])) {
            $extracted['contact'] = [
                'name' => $inboxItem->from_name,
                'phone' => $inboxItem->source_type === 'phone' || $inboxItem->source_type === 'sms' ? $inboxItem->from_identifier : null,
                'email' => $inboxItem->source_type === 'email' ? $inboxItem->from_identifier : null,
            ];
        }

        $inboxItem->update(['extracted_data' => $extracted]);

        // Evaluate routing rules
        $this->ruleEngine->forUser($inboxItem->user);
        $decision = $this->ruleEngine->evaluate($extracted);

        // Create task
        $task = Task::create([
            'organization_id' => $inboxItem->organization_id,
            'title' => $decision->taskTitle ?? $inboxItem->subject ?? 'Task from ' . $inboxItem->source_type,
            'description' => $decision->taskDescription ?? $inboxItem->body,
            'state' => \App\Enums\TaskState::PENDING,
            'priority' => $decision->priority ?? \App\Enums\TaskPriority::NORMAL,
            'requestor_id' => $inboxItem->user_id,
            'source_channel' => \App\Enums\TaskChannel::from($inboxItem->source_type),
            'source_channel_id' => $inboxItem->channel_id,
            'routing_rule_id' => $decision->ruleId ?? null,
            'contact_name' => $extracted['contact']['name'] ?? $inboxItem->from_name,
            'contact_phone' => $extracted['contact']['phone'] ?? ($inboxItem->source_type === 'phone' || $inboxItem->source_type === 'sms' ? $inboxItem->from_identifier : null),
            'contact_email' => $extracted['contact']['email'] ?? ($inboxItem->source_type === 'email' ? $inboxItem->from_identifier : null),
            'extracted_entities' => $extracted,
        ]);

        // Mark processed
        $routingRule = $decision->ruleId ? RoutingRule::find($decision->ruleId) : null;
        $inboxItem->markProcessed($task, $routingRule);

        return response()->json([
            'task' => $task,
            'inbox_item' => $inboxItem,
        ], 201);
    }

    public function dismiss(Request $request, InboxItem $inboxItem): JsonResponse
    {
        // Check organization access
        if ($inboxItem->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $inboxItem->markDismissed();

        return response()->json($inboxItem);
    }

    public function createTask(Request $request, InboxItem $inboxItem): JsonResponse
    {
        // Check organization access
        if ($inboxItem->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,normal,high,urgent',
            'project_id' => 'nullable|uuid|exists:projects,id',
        ]);

        $task = Task::create([
            'organization_id' => $inboxItem->organization_id,
            'project_id' => $validated['project_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'state' => \App\Enums\TaskState::PENDING,
            'priority' => \App\Enums\TaskPriority::from($validated['priority'] ?? 'normal'),
            'requestor_id' => $inboxItem->user_id,
            'source_channel' => \App\Enums\TaskChannel::from($inboxItem->source_type),
            'source_channel_id' => $inboxItem->channel_id,
            'contact_name' => $inboxItem->from_name,
            'contact_phone' => ($inboxItem->source_type === 'phone' || $inboxItem->source_type === 'sms') ? $inboxItem->from_identifier : null,
            'contact_email' => $inboxItem->source_type === 'email' ? $inboxItem->from_identifier : null,
        ]);

        $inboxItem->markProcessed($task);

        return response()->json($task, 201);
    }
}
