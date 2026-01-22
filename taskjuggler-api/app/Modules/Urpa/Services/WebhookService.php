<?php

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaIntegration;
use App\Modules\Urpa\Models\UrpaWebhookEvent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Queue;

class WebhookService
{
    /**
     * Dispatch webhook event to registered integrations
     */
    public function dispatch(string $event, array $data, string $userId): void
    {
        $integrations = UrpaIntegration::where('user_id', $userId)
            ->where('type', 'webhook')
            ->whereJsonContains('config->events', $event)
            ->get();

        foreach ($integrations as $integration) {
            $this->sendWebhook($integration, $event, $data, $userId);
        }
    }

    /**
     * Send webhook to integration
     */
    private function sendWebhook(UrpaIntegration $integration, string $event, array $data, string $userId): void
    {
        $config = $integration->config;
        $webhookUrl = $config['webhook_url'] ?? null;
        $secret = $config['webhook_secret'] ?? null;

        if (!$webhookUrl) {
            Log::warning("Webhook URL not configured for integration: {$integration->id}");
            return;
        }

        $payload = [
            'event' => $event,
            'timestamp' => now()->toIso8601String(),
            'data' => $data,
        ];

        $signature = $this->generateSignature($payload, $secret);

        // Create webhook event record
        $webhookEvent = UrpaWebhookEvent::create([
            'integration_id' => $integration->id,
            'user_id' => $userId,
            'event' => $event,
            'payload' => $payload,
            'webhook_url' => $webhookUrl,
            'attempts' => 1,
            'last_attempted_at' => now(),
        ]);

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'X-URPA-Signature' => $signature,
                    'X-URPA-Event' => $event,
                ])
                ->post($webhookUrl, $payload);

            if ($response->successful()) {
                $webhookEvent->markDelivered($response->status(), substr($response->body(), 0, 1000));
            } else {
                $webhookEvent->markFailed(
                    "HTTP {$response->status()}",
                    $response->status(),
                    substr($response->body(), 0, 1000)
                );
                
                // Queue retry if should retry
                if ($webhookEvent->shouldRetry()) {
                    dispatch(new \App\Modules\Urpa\Jobs\RetryWebhookJob($webhookEvent->id))
                        ->delay(now()->addSeconds(pow(2, $webhookEvent->attempts) * 60)); // Exponential backoff
                }
            }
        } catch (\Exception $e) {
            $webhookEvent->markFailed($e->getMessage());
            
            // Queue retry if should retry
            if ($webhookEvent->shouldRetry()) {
                dispatch(new \App\Modules\Urpa\Jobs\RetryWebhookJob($webhookEvent->id))
                    ->delay(now()->addSeconds(pow(2, $webhookEvent->attempts) * 60));
            }
            
            Log::error("Webhook delivery exception", [
                'integration_id' => $integration->id,
                'url' => $webhookUrl,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Generate HMAC signature for webhook payload
     */
    public function generateSignature(array $payload, ?string $secret): string
    {
        if (!$secret) {
            return '';
        }

        $payloadString = json_encode($payload);
        return hash_hmac('sha256', $payloadString, $secret);
    }

    /**
     * Verify webhook signature
     */
    public function verifySignature(array $payload, string $signature, string $secret): bool
    {
        $expectedSignature = $this->generateSignature($payload, $secret);
        return hash_equals($expectedSignature, $signature);
    }
}

