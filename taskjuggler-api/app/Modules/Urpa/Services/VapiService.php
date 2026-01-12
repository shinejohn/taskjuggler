<?php

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaPhoneCall;
use App\Modules\Urpa\Models\UrpaUserProfile;
use App\Modules\Urpa\Services\AiService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VapiService
{
    private string $apiKey;
    private string $apiUrl = 'https://api.vapi.ai';

    public function __construct(
        private ?AiService $aiService = null
    ) {
        $this->apiKey = config('services.vapi.api_key', env('VAPI_API_KEY'));
    }

    /**
     * Initialize a call via Vapi
     */
    public function initiateCall(array $config): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($this->apiUrl . '/call', [
            'assistantId' => $config['assistant_id'],
            'customer' => [
                'number' => $config['customer_number'],
            ],
            'phoneNumberId' => $config['phone_number_id'] ?? null,
            'metadata' => $config['metadata'] ?? [],
        ]);

        if ($response->failed()) {
            Log::error('Vapi call initiation failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \Exception('Failed to initiate Vapi call: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Handle Vapi webhook event
     */
    public function handleWebhook(array $event): void
    {
        $eventType = $event['type'] ?? null;
        $callId = $event['call']['id'] ?? null;

        Log::info("Vapi webhook received: {$eventType}", ['event' => $event]);

        switch ($eventType) {
            case 'call-started':
                $this->handleCallStarted($event);
                break;
            case 'call-ended':
                $this->handleCallEnded($event);
                break;
            case 'transcript-complete':
                $this->handleTranscriptComplete($event);
                break;
            default:
                Log::info("Unhandled Vapi event type: {$eventType}");
        }
    }

    /**
     * Handle call started event
     */
    private function handleCallStarted(array $event): void
    {
        $call = $event['call'] ?? [];
        $userId = $event['metadata']['user_id'] ?? null;

        if (!$userId) {
            Log::warning('Call started event missing user_id');
            return;
        }

        UrpaPhoneCall::create([
            'user_id' => $userId,
            'direction' => $call['direction'] ?? 'inbound',
            'caller_number' => $call['customer']['number'] ?? null,
            'callee_number' => $call['phoneNumber']['number'] ?? null,
            'status' => 'in_progress',
            'handled_by_ai' => true,
            'vapi_call_id' => $call['id'],
            'vapi_assistant_id' => $call['assistantId'] ?? null,
            'started_at' => now(),
        ]);
    }

    /**
     * Handle call ended event
     */
    private function handleCallEnded(array $event): void
    {
        $call = $event['call'] ?? [];
        $callId = $call['id'] ?? null;

        if (!$callId) {
            return;
        }

        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)->first();
        if (!$phoneCall) {
            Log::warning("Call ended event for unknown call: {$callId}");
            return;
        }

        $duration = $call['endedAt'] && $call['startedAt']
            ? strtotime($call['endedAt']) - strtotime($call['startedAt'])
            : 0;

        $phoneCall->update([
            'status' => 'completed',
            'duration_seconds' => $duration,
            'ended_at' => $call['endedAt'] ?? now(),
            'recording_url' => $call['recordingUrl'] ?? null,
        ]);
    }

    /**
     * Handle transcript complete event
     */
    private function handleTranscriptComplete(array $event): void
    {
        $call = $event['call'] ?? [];
        $transcript = $event['transcript'] ?? [];
        $callId = $call['id'] ?? null;

        if (!$callId) {
            return;
        }

        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)->first();
        if (!$phoneCall) {
            return;
        }

        // Combine transcript messages
        $transcriptText = collect($transcript)->map(function ($message) {
            $role = $message['role'] ?? 'unknown';
            $content = $message['content'] ?? '';
            return "[{$role}]: {$content}";
        })->join("\n");

        $phoneCall->update([
            'transcript' => $transcriptText,
        ]);

        // Generate AI summary and extract tasks
        if ($this->aiService) {
            $summary = $this->aiService->generateCallSummary($transcriptText);
            $phoneCall->update([
                'ai_summary' => $summary,
            ]);

            $tasks = $this->aiService->extractTasksFromTranscript(
                $phoneCall->user_id,
                $transcriptText,
                null
            );

            if (!empty($tasks)) {
                $actions = $phoneCall->actions_taken ?? [];
                foreach ($tasks as $task) {
                    $actions[] = "Created task: {$task->title}";
                }
                $phoneCall->update([
                    'actions_taken' => $actions,
                ]);
            }
        }
    }

    /**
     * Get assistant configuration
     */
    public function getAssistantConfig(string $assistantId): ?array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->get($this->apiUrl . '/assistant/' . $assistantId);

        if ($response->failed()) {
            return null;
        }

        return $response->json();
    }
}

