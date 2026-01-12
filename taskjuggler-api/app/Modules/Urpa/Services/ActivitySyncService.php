<?php

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaIntegration;
use App\Modules\Urpa\Models\UrpaContact;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Crypt;

class ActivitySyncService
{
    /**
     * Sync activities from an integration
     */
    public function syncIntegration(UrpaIntegration $integration): array
    {
        $result = [
            'synced' => 0,
            'errors' => 0,
        ];

        try {
            switch ($integration->integration_type) {
                case 'email':
                    $result = $this->syncEmail($integration);
                    break;
                case 'calendar':
                    $result = $this->syncCalendar($integration);
                    break;
                case 'messaging':
                    $result = $this->syncMessaging($integration);
                    break;
                case 'social':
                    $result = $this->syncSocial($integration);
                    break;
                default:
                    Log::warning("Unknown integration type: {$integration->integration_type}");
            }

            $integration->updateSyncStatus();
        } catch (\Exception $e) {
            Log::error("Sync failed for integration {$integration->id}", [
                'error' => $e->getMessage(),
            ]);
            $integration->markAsError($e->getMessage());
            $result['errors']++;
        }

        return $result;
    }

    /**
     * Sync email activities
     */
    private function syncEmail(UrpaIntegration $integration): array
    {
        $synced = 0;
        $errors = 0;

        try {
            $accessToken = Crypt::decryptString($integration->access_token_encrypted);
            $provider = $integration->provider;

            if ($provider === 'google') {
                $result = $this->syncGmail($integration, $accessToken);
                $synced += $result['synced'];
                $errors += $result['errors'];
            } elseif ($provider === 'microsoft') {
                $result = $this->syncOutlook($integration, $accessToken);
                $synced += $result['synced'];
                $errors += $result['errors'];
            } else {
                Log::warning("Unsupported email provider: {$provider}");
            }
        } catch (\Exception $e) {
            Log::error("Email sync failed for integration {$integration->id}", [
                'error' => $e->getMessage(),
            ]);
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync Gmail messages
     */
    private function syncGmail(UrpaIntegration $integration, string $accessToken): array
    {
        $synced = 0;
        $errors = 0;
        $lastSync = $integration->last_sync_at;

        try {
            // Fetch messages from Gmail API
            $url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages';
            $params = [
                'maxResults' => 50,
                'q' => $lastSync ? 'after:' . $lastSync->timestamp : 'is:unread',
            ];

            $response = Http::withToken($accessToken)->get($url, $params);

            if ($response->failed()) {
                Log::error('Gmail API error', ['response' => $response->body()]);
                return ['synced' => 0, 'errors' => 1];
            }

            $messages = $response->json()['messages'] ?? [];

            foreach ($messages as $messageRef) {
                try {
                    // Fetch full message details
                    $messageResponse = Http::withToken($accessToken)
                        ->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$messageRef['id']}");

                    if ($messageResponse->failed()) {
                        continue;
                    }

                    $message = $messageResponse->json();
                    $headers = collect($message['payload']['headers'] ?? [])
                        ->keyBy('name')
                        ->map(fn($h) => $h['value']);

                    $snippet = $message['snippet'] ?? '';
                    $subject = $headers['Subject'] ?? 'No Subject';
                    $from = $headers['From'] ?? '';
                    $date = $headers['Date'] ?? now();

                    // Extract email from "Name <email@example.com>" format
                    preg_match('/<(.+)>/', $from, $matches);
                    $email = $matches[1] ?? $from;

                    $this->createActivityFromExternal(
                        $integration->user_id,
                        'email',
                        'gmail',
                        [
                            'title' => $subject,
                            'description' => $snippet,
                            'email' => $email,
                            'external_id' => $message['id'],
                            'timestamp' => $date,
                            'raw_content' => $message,
                        ]
                    );

                    $synced++;
                } catch (\Exception $e) {
                    Log::error("Failed to sync Gmail message {$messageRef['id']}", [
                        'error' => $e->getMessage(),
                    ]);
                    $errors++;
                }
            }
        } catch (\Exception $e) {
            Log::error("Gmail sync failed", ['error' => $e->getMessage()]);
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync Outlook messages
     */
    private function syncOutlook(UrpaIntegration $integration, string $accessToken): array
    {
        $synced = 0;
        $errors = 0;
        $lastSync = $integration->last_sync_at;

        try {
            // Fetch messages from Microsoft Graph API
            $url = 'https://graph.microsoft.com/v1.0/me/messages';
            $params = [
                '$top' => 50,
                '$filter' => $lastSync ? "receivedDateTime ge {$lastSync->toIso8601String()}" : "isRead eq false",
                '$orderby' => 'receivedDateTime desc',
            ];

            $response = Http::withToken($accessToken)->get($url, $params);

            if ($response->failed()) {
                Log::error('Outlook API error', ['response' => $response->body()]);
                return ['synced' => 0, 'errors' => 1];
            }

            $messages = $response->json()['value'] ?? [];

            foreach ($messages as $message) {
                try {
                    $this->createActivityFromExternal(
                        $integration->user_id,
                        'email',
                        'outlook',
                        [
                            'title' => $message['subject'] ?? 'No Subject',
                            'description' => $message['bodyPreview'] ?? '',
                            'email' => $message['from']['emailAddress']['address'] ?? '',
                            'first_name' => $message['from']['emailAddress']['name'] ?? null,
                            'external_id' => $message['id'],
                            'timestamp' => $message['receivedDateTime'] ?? now(),
                            'raw_content' => $message,
                        ]
                    );

                    $synced++;
                } catch (\Exception $e) {
                    Log::error("Failed to sync Outlook message {$message['id']}", [
                        'error' => $e->getMessage(),
                    ]);
                    $errors++;
                }
            }
        } catch (\Exception $e) {
            Log::error("Outlook sync failed", ['error' => $e->getMessage()]);
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync calendar activities
     */
    private function syncCalendar(UrpaIntegration $integration): array
    {
        $synced = 0;
        $errors = 0;

        try {
            $accessToken = Crypt::decryptString($integration->access_token_encrypted);
            $provider = $integration->provider;

            if ($provider === 'google') {
                $result = $this->syncGoogleCalendar($integration, $accessToken);
                $synced += $result['synced'];
                $errors += $result['errors'];
            } elseif ($provider === 'microsoft') {
                $result = $this->syncOutlookCalendar($integration, $accessToken);
                $synced += $result['synced'];
                $errors += $result['errors'];
            }
        } catch (\Exception $e) {
            Log::error("Calendar sync failed for integration {$integration->id}", [
                'error' => $e->getMessage(),
            ]);
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync Google Calendar events
     */
    private function syncGoogleCalendar(UrpaIntegration $integration, string $accessToken): array
    {
        $synced = 0;
        $errors = 0;
        $timeMin = $integration->last_sync_at?->toIso8601String() ?? now()->subDays(7)->toIso8601String();

        try {
            $url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
            $params = [
                'timeMin' => $timeMin,
                'maxResults' => 50,
                'singleEvents' => true,
                'orderBy' => 'startTime',
            ];

            $response = Http::withToken($accessToken)->get($url, $params);

            if ($response->failed()) {
                return ['synced' => 0, 'errors' => 1];
            }

            $events = $response->json()['items'] ?? [];

            foreach ($events as $event) {
                try {
                    $start = $event['start']['dateTime'] ?? $event['start']['date'] ?? now();
                    
                    $this->createActivityFromExternal(
                        $integration->user_id,
                        'calendar',
                        'google_calendar',
                        [
                            'title' => $event['summary'] ?? 'Untitled Event',
                            'description' => $event['description'] ?? null,
                            'external_id' => $event['id'],
                            'timestamp' => $start,
                            'raw_content' => $event,
                        ]
                    );

                    $synced++;
                } catch (\Exception $e) {
                    $errors++;
                }
            }
        } catch (\Exception $e) {
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync Outlook Calendar events
     */
    private function syncOutlookCalendar(UrpaIntegration $integration, string $accessToken): array
    {
        $synced = 0;
        $errors = 0;
        $startDateTime = $integration->last_sync_at?->toIso8601String() ?? now()->subDays(7)->toIso8601String();

        try {
            $url = 'https://graph.microsoft.com/v1.0/me/calendar/events';
            $params = [
                '$filter' => "start/dateTime ge '{$startDateTime}'",
                '$top' => 50,
                '$orderby' => 'start/dateTime',
            ];

            $response = Http::withToken($accessToken)->get($url, $params);

            if ($response->failed()) {
                return ['synced' => 0, 'errors' => 1];
            }

            $events = $response->json()['value'] ?? [];

            foreach ($events as $event) {
                try {
                    $this->createActivityFromExternal(
                        $integration->user_id,
                        'calendar',
                        'outlook_calendar',
                        [
                            'title' => $event['subject'] ?? 'Untitled Event',
                            'description' => $event['bodyPreview'] ?? null,
                            'external_id' => $event['id'],
                            'timestamp' => $event['start']['dateTime'] ?? now(),
                            'raw_content' => $event,
                        ]
                    );

                    $synced++;
                } catch (\Exception $e) {
                    $errors++;
                }
            }
        } catch (\Exception $e) {
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync messaging activities
     */
    private function syncMessaging(UrpaIntegration $integration): array
    {
        $synced = 0;
        $errors = 0;

        try {
            $accessToken = Crypt::decryptString($integration->access_token_encrypted);
            $provider = $integration->provider;

            if ($provider === 'slack') {
                $result = $this->syncSlack($integration, $accessToken);
                $synced += $result['synced'];
                $errors += $result['errors'];
            } elseif ($provider === 'microsoft') {
                // Teams integration
                $result = $this->syncTeams($integration, $accessToken);
                $synced += $result['synced'];
                $errors += $result['errors'];
            }
        } catch (\Exception $e) {
            Log::error("Messaging sync failed for integration {$integration->id}", [
                'error' => $e->getMessage(),
            ]);
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync Slack messages
     */
    private function syncSlack(UrpaIntegration $integration, string $accessToken): array
    {
        $synced = 0;
        $errors = 0;

        try {
            // Get user's DMs and mentions
            $url = 'https://slack.com/api/conversations.list';
            $response = Http::withToken($accessToken)->post($url, [
                'types' => 'im,mpim',
                'exclude_archived' => true,
            ]);

            if ($response->failed() || !($response->json()['ok'] ?? false)) {
                return ['synced' => 0, 'errors' => 1];
            }

            $channels = $response->json()['channels'] ?? [];

            foreach ($channels as $channel) {
                try {
                    // Fetch messages from channel
                    $messagesUrl = 'https://slack.com/api/conversations.history';
                    $messagesResponse = Http::withToken($accessToken)->post($messagesUrl, [
                        'channel' => $channel['id'],
                        'limit' => 50,
                    ]);

                    if ($messagesResponse->failed() || !($messagesResponse->json()['ok'] ?? false)) {
                        continue;
                    }

                    $messages = $messagesResponse->json()['messages'] ?? [];

                    foreach ($messages as $message) {
                        if (($message['ts'] ?? 0) > ($integration->sync_cursor ?? 0)) {
                            $this->createActivityFromExternal(
                                $integration->user_id,
                                'text',
                                'slack',
                                [
                                    'title' => 'Slack Message',
                                    'description' => $message['text'] ?? '',
                                    'external_id' => $message['ts'],
                                    'timestamp' => now()->setTimestamp($message['ts']),
                                    'raw_content' => $message,
                                ]
                            );

                            $synced++;
                        }
                    }
                } catch (\Exception $e) {
                    $errors++;
                }
            }
        } catch (\Exception $e) {
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync Microsoft Teams messages
     */
    private function syncTeams(UrpaIntegration $integration, string $accessToken): array
    {
        $synced = 0;
        $errors = 0;

        try {
            // Get chats
            $url = 'https://graph.microsoft.com/v1.0/me/chats';
            $response = Http::withToken($accessToken)->get($url);

            if ($response->failed()) {
                return ['synced' => 0, 'errors' => 1];
            }

            $chats = $response->json()['value'] ?? [];

            foreach ($chats as $chat) {
                try {
                    // Get messages from chat
                    $messagesUrl = "https://graph.microsoft.com/v1.0/me/chats/{$chat['id']}/messages";
                    $messagesResponse = Http::withToken($accessToken)->get($messagesUrl, [
                        '$top' => 50,
                    ]);

                    if ($messagesResponse->failed()) {
                        continue;
                    }

                    $messages = $messagesResponse->json()['value'] ?? [];

                    foreach ($messages as $message) {
                        $this->createActivityFromExternal(
                            $integration->user_id,
                            'text',
                            'teams',
                            [
                                'title' => 'Teams Message',
                                'description' => $message['body']['content'] ?? '',
                                'external_id' => $message['id'],
                                'timestamp' => $message['createdDateTime'] ?? now(),
                                'raw_content' => $message,
                            ]
                        );

                        $synced++;
                    }
                } catch (\Exception $e) {
                    $errors++;
                }
            }
        } catch (\Exception $e) {
            $errors++;
        }

        return ['synced' => $synced, 'errors' => $errors];
    }

    /**
     * Sync social media activities
     */
    private function syncSocial(UrpaIntegration $integration): array
    {
        // Social media sync would require specific APIs (Twitter, LinkedIn, etc.)
        // For now, return empty result
        Log::info("Social media sync not yet implemented for provider: {$integration->provider}");
        
        return ['synced' => 0, 'errors' => 0];
    }

    /**
     * Create activity from external data
     */
    public function createActivityFromExternal(
        string $userId,
        string $type,
        string $source,
        array $data
    ): UrpaActivity {
        // Find or create contact
        $contact = null;
        if (!empty($data['email'])) {
            $contact = UrpaContact::where('user_id', $userId)
                ->where('email', $data['email'])
                ->first();

            if (!$contact) {
                $contact = UrpaContact::create([
                    'user_id' => $userId,
                    'email' => $data['email'],
                    'first_name' => $data['first_name'] ?? null,
                    'last_name' => $data['last_name'] ?? null,
                    'source' => $source,
                    'external_id' => $data['external_id'] ?? null,
                ]);
            }
        }

        return UrpaActivity::create([
            'user_id' => $userId,
            'activity_type' => $type,
            'source' => $source,
            'title' => $data['title'] ?? 'Untitled',
            'description' => $data['description'] ?? null,
            'raw_content' => $data,
            'contact_id' => $contact?->id,
            'external_id' => $data['external_id'] ?? null,
            'activity_timestamp' => isset($data['timestamp']) ? \Carbon\Carbon::parse($data['timestamp']) : now(),
        ]);
    }
}
