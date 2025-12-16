<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InboxItem;
use App\Models\Task;
use App\Services\AI\TaskExtractor;
use App\Services\Routing\RuleEngine;
use Illuminate\Http\Request;

class InboxController extends Controller
{
    public function index(Request $request)
    {
        $inboxItems = $request->user()
            ->inboxItems()
            ->with(['channel', 'task', 'routingRule'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->source_type, fn($q, $type) => $q->where('source_type', $type))
            ->orderBy('received_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($inboxItems);
    }

    public function show(InboxItem $inboxItem)
    {
        $this->authorize('view', $inboxItem);
        
        $inboxItem->load(['channel', 'task', 'routingRule']);

        return response()->json($inboxItem);
    }

    public function process(Request $request, InboxItem $inboxItem)
    {
        $this->authorize('update', $inboxItem);

        if ($inboxItem->status !== InboxItem::STATUS_UNPROCESSED) {
            return response()->json(['error' => 'Inbox item already processed'], 400);
        }

        $extractor = app(TaskExtractor::class);
        $ruleEngine = app(RuleEngine::class);

        // Extract data
        $extracted = $extractor->extract($inboxItem->body, $inboxItem->source_type);
        $extracted['source'] = $inboxItem->source_type;

        $inboxItem->update(['extracted_data' => $extracted]);

        // Evaluate routing
        $ruleEngine->forUser($inboxItem->user);
        $decision = $ruleEngine->evaluate($extracted);

        // Create task
        $task = Task::create([
            'title' => $decision->taskTitle,
            'description' => $decision->taskDescription,
            'status' => Task::STATUS_PENDING,
            'priority' => $decision->priority,
            'requestor_id' => $decision->requestorId,
            'source_type' => $inboxItem->source_type,
            'source_channel_id' => $inboxItem->channel_id,
            'extracted_data' => $extracted,
            'routing_rule_id' => $decision->ruleId,
            'contact_name' => $extracted['contact']['name'] ?? $inboxItem->from_name,
            'contact_phone' => $extracted['contact']['phone'] ?? $inboxItem->from_identifier,
            'contact_email' => $extracted['contact']['email'] ?? $inboxItem->from_identifier,
            'tags' => $decision->tags,
        ]);

        // Mark processed
        $inboxItem->markProcessed($task, $decision->ruleId ? $inboxItem->routingRule : null);

        return response()->json(['task' => $task, 'inbox_item' => $inboxItem], 201);
    }

    public function dismiss(Request $request, InboxItem $inboxItem)
    {
        $this->authorize('update', $inboxItem);

        $inboxItem->update(['status' => InboxItem::STATUS_DISMISSED]);

        return response()->json($inboxItem);
    }

    public function createTask(Request $request, InboxItem $inboxItem)
    {
        $this->authorize('update', $inboxItem);

        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,normal,high,urgent',
        ]);

        $task = Task::create([
            ...$validated,
            'requestor_id' => $inboxItem->user_id,
            'status' => Task::STATUS_PENDING,
            'priority' => $validated['priority'] ?? Task::PRIORITY_NORMAL,
            'source_type' => $inboxItem->source_type,
            'source_channel_id' => $inboxItem->channel_id,
            'contact_name' => $inboxItem->from_name,
            'contact_phone' => $inboxItem->source_type === InboxItem::SOURCE_PHONE || $inboxItem->source_type === InboxItem::SOURCE_SMS 
                ? $inboxItem->from_identifier 
                : null,
            'contact_email' => $inboxItem->source_type === InboxItem::SOURCE_EMAIL 
                ? $inboxItem->from_identifier 
                : null,
        ]);

        $inboxItem->markProcessed($task);

        return response()->json($task, 201);
    }
}
