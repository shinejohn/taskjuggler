<?php

namespace App\Modules\Urpa\Jobs;

use App\Modules\Urpa\Models\UrpaWebhookEvent;
use App\Modules\Urpa\Services\WebhookService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RetryWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $webhookEventId
    ) {}

    public function handle(): void
    {
        $webhookEvent = UrpaWebhookEvent::find($this->webhookEventId);
        
        if (!$webhookEvent || $webhookEvent->isDelivered()) {
            return;
        }

        if (!$webhookEvent->shouldRetry()) {
            Log::warning("Webhook event exceeded max retries", [
                'webhook_event_id' => $this->webhookEventId,
                'attempts' => $webhookEvent->attempts,
            ]);
            return;
        }

        $integration = $webhookEvent->integration;
        $config = $integration->config ?? [];
        $webhookUrl = $config['webhook_url'] ?? null;
        $secret = $config['webhook_secret'] ?? null;

        if (!$webhookUrl) {
            return;
        }

        $payload = $webhookEvent->payload;
        $webhookService = app(WebhookService::class);
        $signature = $webhookService->generateSignature($payload, $secret);

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'X-URPA-Signature' => $signature,
                    'X-URPA-Event' => $webhookEvent->event,
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
                
                // Queue another retry if should retry
                if ($webhookEvent->shouldRetry()) {
                    $this->dispatch($this->webhookEventId)
                        ->delay(now()->addSeconds(pow(2, $webhookEvent->attempts) * 60));
                }
            }
        } catch (\Exception $e) {
            $webhookEvent->markFailed($e->getMessage());
            
            // Queue another retry if should retry
            if ($webhookEvent->shouldRetry()) {
                $this->dispatch($this->webhookEventId)
                    ->delay(now()->addSeconds(pow(2, $webhookEvent->attempts) * 60));
            }
        }
    }
}

