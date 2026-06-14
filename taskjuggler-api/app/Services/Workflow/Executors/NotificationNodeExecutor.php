<?php

namespace App\Services\Workflow\Executors;

use App\Modules\Workflows\Models\WorkflowExecution;
use App\Modules\Workflows\Models\WorkflowNode;
use App\Services\Twilio\SmsService;
use App\Services\SendGrid\EmailService; // Assuming existence or using generic
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationNodeExecutor implements NodeExecutorInterface
{
    public function __construct(
        protected SmsService $smsService
        // protected EmailService $emailService
    ) {}

    public function execute(WorkflowExecution $execution, WorkflowNode $node): array
    {
        $config = $node->config;
        $context = $execution->context_data;
        
        $channel = $config['channel'] ?? 'sms';
        $message = $this->substituteVariables($config['message'] ?? '', $context);
        $recipient = $this->substituteVariables($config['recipient'] ?? '', $context); // e.g., phone number or email

        if (!$recipient) {
             throw new \Exception("Notification Recipient is missing");
        }

        switch ($channel) {
            case 'sms':
                $success = $this->smsService->send($recipient, $message);
                if (!$success) {
                    throw new \Exception("Failed to send SMS to {$recipient}");
                }
                return ['status' => 'sent', 'channel' => 'sms', 'recipient' => $recipient];
            
            case 'email':
                // Placeholder for EmailService execution
                 // $this->emailService->send(..., $recipient, $message);
                 return ['status' => 'simulated_sent', 'channel' => 'email', 'recipient' => $recipient];

            default:
                throw new \Exception("Unknown Notification Channel: {$channel}");
        }
    }

    private function substituteVariables(string $text, array $context): string
    {
        return preg_replace_callback('/\{\{\s*([\w\.]+)\s*\}\}/', function ($matches) use ($context) {
            $key = $matches[1];
            return data_get($context, $key, $matches[0]);
        }, $text);
    }
}
