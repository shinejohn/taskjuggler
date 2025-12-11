<?php

namespace App\Services\MessageRouter\Adapters;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SlackAdapter implements ChannelAdapter
{
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
        $blocks = $this->formatTaskAsBlocks($tef);
        
        return $this->sendMessage($recipient, $this->formatTask($tef), $blocks);
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
        return "📋 *Task:* {$tef['title']}";
    }

    /**
     * Format task as Slack blocks for rich display
     */
    private function formatTaskAsBlocks(array $tef): array
    {
        $blocks = [
            [
                'type' => 'header',
                'text' => [
                    'type' => 'plain_text',
                    'text' => "📋 {$tef['title']}",
                ],
            ],
        ];

        if (!empty($tef['description'])) {
            $blocks[] = [
                'type' => 'section',
                'text' => [
                    'type' => 'mrkdwn',
                    'text' => $tef['description'],
                ],
            ];
        }

        // Add metadata fields
        $fields = [];
        
        if (!empty($tef['organizer']['name'])) {
            $fields[] = [
                'type' => 'mrkdwn',
                'text' => "*From:*\n{$tef['organizer']['name']}",
            ];
        }

        if (!empty($tef['dtdue'])) {
            $fields[] = [
                'type' => 'mrkdwn',
                'text' => "*Due:*\n" . date('M j, Y', strtotime($tef['dtdue'])),
            ];
        }

        if (!empty($tef['location']['address'])) {
            $fields[] = [
                'type' => 'mrkdwn',
                'text' => "*Location:*\n{$tef['location']['address']}",
            ];
        }

        if (!empty($fields)) {
            $blocks[] = [
                'type' => 'section',
                'fields' => $fields,
            ];
        }

        // Add action buttons
        $blocks[] = [
            'type' => 'actions',
            'elements' => [
                [
                    'type' => 'button',
                    'text' => ['type' => 'plain_text', 'text' => '✅ Accept'],
                    'style' => 'primary',
                    'action_id' => 'accept_task',
                    'value' => $tef['id'],
                ],
                [
                    'type' => 'button',
                    'text' => ['type' => 'plain_text', 'text' => '❌ Decline'],
                    'style' => 'danger',
                    'action_id' => 'decline_task',
                    'value' => $tef['id'],
                ],
                [
                    'type' => 'button',
                    'text' => ['type' => 'plain_text', 'text' => '👁️ View'],
                    'url' => $tef['actions']['view'],
                ],
            ],
        ];

        $blocks[] = [
            'type' => 'context',
            'elements' => [
                [
                    'type' => 'mrkdwn',
                    'text' => "Task ID: `{$tef['id']}` | via Task Juggler",
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
