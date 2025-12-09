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
use App\Services\SendGrid\EmailService;
use App\Jobs\ExecuteAiTool;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $subject,
        public string $body,
        public string $fromEmail,
        public ?string $fromName,
        public array $attachments = [],
        public bool $isCommand = false,
    ) {}

    public function handle(
        TaskExtractor $extractor,
        RuleEngine $ruleEngine,
        NotificationService $notifications,
        EmailService $email,
    ): void {
        // 1. Create inbox item
        $inboxItem = InboxItem::create([
            'user_id' => $this->user->id,
            'source_type' => InboxItem::SOURCE_EMAIL,
            'source_id' => $this->fromEmail . '-' . now()->timestamp,
            'channel_id' => $this->user->getEmailChannel()?->id,
            'from_identifier' => $this->fromEmail,
            'from_name' => $this->fromName,
            'subject' => $this->subject,
            'body' => $this->body,
            'status' => InboxItem::STATUS_PROCESSING,
            'received_at' => now(),
            'attachments' => $this->attachments,
        ]);

        try {
            // 2. AI extraction
            $content = $this->subject . "\n\n" . $this->body;
            $extracted = $extractor->extract($content, 'email');
            $extracted['source'] = 'email';
            $extracted['from_email'] = $this->fromEmail;
            $extracted['from_name'] = $this->fromName;
            $extracted['subject'] = $this->subject;

            // Use email as contact if not extracted
            if (empty($extracted['contact']['email'])) {
                $extracted['contact']['email'] = $this->fromEmail;
            }
            if (empty($extracted['contact']['name']) && $this->fromName) {
                $extracted['contact']['name'] = $this->fromName;
            }

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
                'source_type' => 'email',
                'source_channel_id' => $inboxItem->channel_id,
                'extracted_data' => $extracted,
                'routing_rule_id' => $decision->ruleId,
                'contact_name' => $extracted['contact']['name'] ?? $this->fromName,
                'contact_phone' => $extracted['contact']['phone'],
                'contact_email' => $extracted['contact']['email'] ?? $this->fromEmail,
                'location_address' => $extracted['location']['address'],
                'location_unit' => $extracted['location']['unit'],
                'location_city' => $extracted['location']['city'],
                'location_state' => $extracted['location']['state'],
                'location_zip' => $extracted['location']['zip'],
                'tags' => $decision->tags,
                'metadata' => [
                    'email_subject' => $this->subject,
                    'attachments' => $this->attachments,
                ],
            ]);

            // 5. Assign task based on routing decision
            $this->assignTask($task, $decision);

            // 6. Send notifications
            foreach ($decision->notifications as $notificationConfig) {
                $this->sendNotification($notifications, $notificationConfig, $task);
            }

            // 7. Send auto-response if configured
            if ($decision->autoResponse) {
                $channel = $this->user->getEmailChannel();
                if ($channel) {
                    $email->sendAutoResponse(
                        $channel,
                        $this->fromEmail,
                        "Re: {$this->subject}",
                        $decision->autoResponse
                    );
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
