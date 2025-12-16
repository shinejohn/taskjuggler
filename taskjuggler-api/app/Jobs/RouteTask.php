<?php

namespace App\Jobs;

use App\Models\Task;
use App\Models\RoutingRule;
use App\Models\MarketplaceVendor;
use App\Services\Routing\RuleEngine;
use App\Services\Routing\RoutingDecision;
use App\Services\Notifications\NotificationService;
use App\Jobs\ExecuteAiTool;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RouteTask implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Task $task,
    ) {}

    public function handle(
        RuleEngine $ruleEngine,
        NotificationService $notifications,
    ): void {
        $task = $this->task;
        $user = $task->requestor;
        $extractedData = $task->extracted_data ?? [];

        // Re-evaluate routing rules
        $ruleEngine->forUser($user);
        $decision = $ruleEngine->evaluate($extractedData);

        // Update task based on routing decision
        $this->updateTask($task, $decision);

        // Assign task based on routing decision
        $this->assignTask($task, $decision);

        // Send notifications
        foreach ($decision->notifications as $notificationConfig) {
            $this->sendNotification($notifications, $notificationConfig, $task);
        }
    }

    private function updateTask(Task $task, RoutingDecision $decision): void
    {
        $updates = [];

        if ($decision->priority && $task->priority !== $decision->priority) {
            $updates['priority'] = $decision->priority;
        }

        if ($decision->tags && $task->tags !== $decision->tags) {
            $updates['tags'] = $decision->tags;
        }

        if ($decision->ruleId && $task->routing_rule_id !== $decision->ruleId) {
            $updates['routing_rule_id'] = $decision->ruleId;
        }

        if (!empty($updates)) {
            $task->update($updates);
        }
    }

    private function assignTask(Task $task, RoutingDecision $decision): void
    {
        // Only reassign if not already assigned or if routing decision changed
        if ($task->owner_id || $task->team_member_id || $task->marketplace_vendor_id) {
            // Task already assigned, skip unless explicitly told to reassign
            return;
        }

        match ($decision->assigneeType) {
            'self' => $task->update(['owner_id' => $task->requestor_id]),
            'team_member' => $task->update(['team_member_id' => $decision->assigneeId]),
            'marketplace_human', 'marketplace_ai' => $this->routeToMarketplace($task, $decision),
            default => $task->update(['owner_id' => $task->requestor_id]),
        };
    }

    private function routeToMarketplace(Task $task, RoutingDecision $decision): void
    {
        $vendor = MarketplaceVendor::find($decision->assigneeId);

        if (!$vendor) {
            // Fallback to owner if vendor not found
            $task->update(['owner_id' => $task->requestor_id]);
            return;
        }

        $task->update(['marketplace_vendor_id' => $vendor->id]);

        // If AI tool, execute immediately
        if ($vendor->canAutoExecute()) {
            ExecuteAiTool::dispatch($task, $vendor);
        }
    }

    private function sendNotification(
        NotificationService $notifications,
        array $notificationConfig,
        Task $task
    ): void {
        $recipient = match ($notificationConfig['recipient'] ?? 'owner') {
            'owner' => $task->requestor,
            'assignee' => $task->owner ?? $task->teamMember?->owner ?? $task->requestor,
            default => $task->requestor,
        };

        $notifications->sendTaskNotification($recipient, 'assigned', [
            'id' => $task->id,
            'title' => $task->title,
        ]);
    }
}
