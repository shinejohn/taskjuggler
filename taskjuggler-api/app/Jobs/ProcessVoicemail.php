<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Task;
use App\Models\InboxItem;
use App\Models\RoutingRule;
use App\Models\MarketplaceVendor;
use App\Services\AI\TaskExtractor;
use App\Services\Routing\RuleEngine;
use App\Services\Routing\RoutingDecision;
use App\Services\Notifications\NotificationService;
use App\Services\Twilio\SmsService;
use App\Jobs\ExecuteAiTool;
use App\Events\TaskCreated;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessVoicemail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $transcript,
        public string $recordingUrl,
        public string $fromNumber,
        public string $callSid,
    ) {}

    public function handle(
        TaskExtractor $extractor,
        RuleEngine $ruleEngine,
        NotificationService $notifications,
        SmsService $sms,
    ): void {
        // 1. Create inbox item
        $inboxItem = InboxItem::create([
            'user_id' => $this->user->id,
            'source_type' => InboxItem::SOURCE_PHONE,
            'source_id' => $this->callSid,
            'channel_id' => $this->user->getPhoneChannel()?->id,
            'from_identifier' => $this->fromNumber,
            'body' => $this->transcript,
            'status' => InboxItem::STATUS_PROCESSING,
            'received_at' => now(),
            'attachments' => [['type' => 'recording', 'url' => $this->recordingUrl]],
        ]);

        try {
            // 2. AI extraction
            $extracted = $extractor->extract($this->transcript, 'phone');
            $extracted['source'] = 'phone';
            $extracted['from_number'] = $this->fromNumber;

            $inboxItem->update(['extracted_data' => $extracted]);

            // 3. Deterministic routing
            $ruleEngine->forUser($this->user);
            $decision = $ruleEngine->evaluate($extracted);

            // 4. Create task if routing decision says so
            if (!$decision->createTask) {
                $inboxItem->markProcessed(
                    null,
                    $decision->ruleId ? RoutingRule::find($decision->ruleId) : null
                );
                return;
            }

            $task = Task::create([
                'title' => $decision->taskTitle,
                'description' => $decision->taskDescription,
                'status' => Task::STATUS_PENDING,
                'priority' => $decision->priority,
                'requestor_id' => $decision->requestorId,
                'source_type' => 'phone',
                'source_channel_id' => $inboxItem->channel_id,
                'extracted_data' => $extracted,
                'routing_rule_id' => $decision->ruleId,
                'contact_name' => $extracted['contact']['name'],
                'contact_phone' => $extracted['contact']['phone'] ?? $this->fromNumber,
                'contact_email' => $extracted['contact']['email'],
                'location_address' => $extracted['location']['address'],
                'location_unit' => $extracted['location']['unit'],
                'location_city' => $extracted['location']['city'],
                'location_state' => $extracted['location']['state'],
                'location_zip' => $extracted['location']['zip'],
                'tags' => $decision->tags,
                'metadata' => ['recording_url' => $this->recordingUrl],
            ]);

            // 5. Assign task based on routing decision
            $this->assignTask($task, $decision);

            // Dispatch event
            event(new TaskCreated($task->fresh()));

            // 6. Send notifications
            foreach ($decision->notifications as $notificationConfig) {
                $this->sendNotification($notifications, $notificationConfig, $task);
            }

            // 7. Send auto-response if configured
            if ($decision->autoResponse) {
                $channel = $this->user->getPhoneChannel();
                if ($channel) {
                    $sms->sendAutoResponse($channel, $this->fromNumber, $decision->autoResponse);
                    $inboxItem->update([
                        'auto_response_sent' => true,
                        'auto_response_text' => $decision->autoResponse,
                    ]);
                }
            }

            // 8. Mark inbox item processed
            $inboxItem->markProcessed(
                $task,
                $decision->ruleId ? RoutingRule::find($decision->ruleId) : null
            );

        } catch (\Exception $e) {
            $inboxItem->markFailed($e->getMessage());
            throw $e;
        }
    }

    private function assignTask(Task $task, RoutingDecision $decision): void
    {
        match ($decision->assigneeType) {
            'self' => $task->update(['owner_id' => $this->user->id]),
            'team_member' => $task->update(['team_member_id' => $decision->assigneeId]),
            'marketplace_human', 'marketplace_ai' => $this->routeToMarketplace($task, $decision),
            default => $task->update(['owner_id' => $this->user->id]),
        };
    }

    private function routeToMarketplace(Task $task, RoutingDecision $decision): void
    {
        $vendor = MarketplaceVendor::find($decision->assigneeId);

        if (!$vendor) {
            // Fallback to owner if vendor not found
            $task->update(['owner_id' => $this->user->id]);
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

        $notifications->sendTaskNotification($recipient, 'created', [
            'id' => $task->id,
            'title' => $task->title,
        ]);
    }
}
