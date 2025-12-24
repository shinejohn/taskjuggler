<?php

namespace App\Services\MessageRouter\Adapters;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SlackAdapter implements ChannelAdapter
{
    use HandlesTefFormats;
    public function getChannel(): string
    {
        return 'slack';
    }

    public function canSend(string $recipient): bool
    {
        // Slack channel ID or user ID
        return preg_match('/^[A-Z0-9]+$/i', $recipient);
    }

    public function sendTask(array $tef, string $recipient): bool
    {
        // Extract task data (handles both TEF 1.0 and 2.0.0)
        $taskData = $this->extractTaskData($tef);
        $blocks = $this->formatTaskAsBlocks($taskData);
        
        return $this->sendMessage($recipient, $this->formatTask($taskData), $blocks);
    }

    public function sendNotification(User $user, Task $task, string $type): bool
    {
        $slackId = $user->settings['external_ids']['slack'] ?? null;
        
        if (!$slackId) {
            return false;
        }

        $message = $this->getNotificationMessage($task, $type);
        
        return $this->sendMessage($slackId, $message);
    }

    public function formatTask(array $tef): string
    {
        // Ensure we have normalized task data
        $taskData = $this->extractTaskData($tef);
        return "📋 *Task:* {$taskData['title']}";
    }

    /**
     * Format task as Slack blocks for rich display
     */
    private function formatTaskAsBlocks(array $tef): array
    {
        // Ensure we have normalized task data
        $taskData = $this->extractTaskData($tef);
        
        $blocks = [
            [
                'type' => 'header',
                'text' => [
                    'type' => 'plain_text',
                    'text' => "📋 {$taskData['title']}",
                ],
            ],
        ];

        if (!empty($taskData['description'])) {
            $blocks[] = [
                'type' => 'section',
                'text' => [
                    'type' => 'mrkdwn',
                    'text' => $taskData['description'],
                ],
            ];
        }

        // Add metadata fields
        $fields = [];
        
        if (!empty($taskData['organizer']['name'])) {
            $fields[] = [
                'type' => 'mrkdwn',
                'text' => "*From:*\n{$taskData['organizer']['name']}",
            ];
        }

        if (!empty($taskData['dtdue'])) {
            $fields[] = [
                'type' => 'mrkdwn',
                'text' => "*Due:*\n" . date('M j, Y', strtotime($taskData['dtdue'])),
            ];
        }

        if (!empty($taskData['location']['address'])) {
            $fields[] = [
                'type' => 'mrkdwn',
                'text' => "*Location:*\n{$taskData['location']['address']}",
            ];
        }

        if (!empty($fields)) {
            $blocks[] = [
                'type' => 'section',
                'fields' => $fields,
            ];
        }

        // Add action buttons
        $taskId = $taskData['id'] ?? $taskData['task_id'] ?? '';
        $elements = [
            [
                'type' => 'button',
                'text' => ['type' => 'plain_text', 'text' => '✅ Accept'],
                'style' => 'primary',
                'action_id' => 'accept_task',
                'value' => $taskId,
            ],
            [
                'type' => 'button',
                'text' => ['type' => 'plain_text', 'text' => '❌ Decline'],
                'style' => 'danger',
                'action_id' => 'decline_task',
                'value' => $taskId,
            ],
        ];
        
        if (!empty($taskData['actions']['view'])) {
            $elements[] = [
                'type' => 'button',
                'text' => ['type' => 'plain_text', 'text' => '👁️ View'],
                'url' => $taskData['actions']['view'],
            ];
        }
        
        $blocks[] = [
            'type' => 'actions',
            'elements' => $elements,
        ];

        $blocks[] = [
            'type' => 'context',
            'elements' => [
                [
                    'type' => 'mrkdwn',
                    'text' => "Task ID: `{$taskId}` | via Task Juggler",
                ],
            ],
        ];

        return $blocks;
    }

    private function sendMessage(string $channel, string $text, array $blocks = []): bool
    {
        $token = config('services.slack.bot_token');
        
        if (!$token) {
            Log::warning('SlackAdapter: No bot token configured');
            return false;
        }

        try {
            $payload = [
                'channel' => $channel,
                'text' => $text,
            ];

            if (!empty($blocks)) {
                $payload['blocks'] = $blocks;
            }

            $response = Http::withToken($token)
                ->post('https://slack.com/api/chat.postMessage', $payload);

            return $response->json('ok') === true;
        } catch (\Exception $e) {
            Log::error('SlackAdapter: Failed to send', ['error' => $e->getMessage()]);
            return false;
        }
    }

    private function getNotificationMessage(Task $task, string $type): string
    {
        return match($type) {
            'accepted' => "✅ Task *{$task->title}* has been accepted",
            'declined' => "❌ Task *{$task->title}* has been declined",
            'completed' => "🎉 Task *{$task->title}* has been completed",
            default => "📋 Update on task *{$task->title}*",
        };
    }
}
