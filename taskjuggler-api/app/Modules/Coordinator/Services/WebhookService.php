<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\Organization;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WebhookService
{
    /**
     * Dispatch webhook event to registered webhooks for organization
     */
    public function dispatch(string $event, array $data, string $organizationId): void
    {
        // Get webhooks for organization
        // Note: Webhook storage would need to be implemented
        // For now, we'll use a simple approach with integrations table
        $webhooks = DB::table('coord_webhooks')
            ->where('organization_id', $organizationId)
            ->whereJsonContains('events', $event)
            ->where('active', true)
            ->get();

        foreach ($webhooks as $webhook) {
            $this->sendWebhook($webhook, $event, $data, $organizationId);
        }
    }

    /**
     * Send webhook to registered endpoint
     */
    private function sendWebhook($webhook, string $event, array $data, string $organizationId): void
    {
        $payload = [
            'event' => $event,
            'timestamp' => now()->toIso8601String(),
            'organization_id' => $organizationId,
            'data' => $data,
        ];

        $secret = $webhook->secret ?? null;
        $signature = $this->generateSignature($payload, $secret);

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'X-4Calls-Signature' => $signature,
                    'X-4Calls-Event' => $event,
                ])
                ->post($webhook->url, $payload);

            if ($response->failed()) {
                Log::error("Webhook delivery failed", [
                    'webhook_id' => $webhook->id,
                    'url' => $webhook->url,
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Webhook delivery exception", [
                'webhook_id' => $webhook->id,
                'url' => $webhook->url,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Generate HMAC signature for webhook payload
     */
    private function generateSignature(array $payload, ?string $secret): string
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

