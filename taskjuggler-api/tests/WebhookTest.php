<?php

namespace Tests;

use App\Models\User;
use App\Modules\Urpa\Models\UrpaIntegration;
use App\Modules\Urpa\Models\UrpaWebhookEvent;
use App\Modules\Urpa\Services\WebhookService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WebhookTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected UrpaIntegration $webhook;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');

        // Create a test webhook integration
        $this->webhook = UrpaIntegration::create([
            'user_id' => $this->user->id,
            'name' => 'Test Webhook',
            'type' => 'webhook',
            'provider' => 'webhook',
            'config' => [
                'webhook_url' => 'https://webhook.site/test',
                'webhook_secret' => 'test_secret_key_12345',
                'events' => ['activity.created', 'contact.created'],
            ],
            'connected_at' => now(),
        ]);
    }

    public function test_webhook_registration(): void
    {
        Http::fake([
            'https://webhook.site/test' => Http::response(['ok' => true], 200),
        ]);

        $response = $this->postJson('/api/urpa/integrations/webhooks', [
            'name' => 'My Test Webhook',
            'webhook_url' => 'https://myapp.com/webhooks',
            'webhook_secret' => 'my_secret_key_12345678',
            'events' => ['activity.created', 'contact.created'],
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'name',
            'webhook_url',
            'events',
        ]);

        $this->assertDatabaseHas('urpa_integrations', [
            'user_id' => $this->user->id,
            'type' => 'webhook',
            'name' => 'My Test Webhook',
        ]);
    }

    public function test_webhook_dispatch_on_activity_created(): void
    {
        Http::fake([
            'https://webhook.site/test' => Http::response(['ok' => true], 200),
        ]);

        $response = $this->postJson('/api/urpa/activities', [
            'activity_type' => 'task',
            'title' => 'Test Activity',
            'description' => 'Test description',
            'status' => 'pending',
            'source' => 'test',
        ]);

        $response->assertStatus(201);

        // Check webhook event was created
        $this->assertDatabaseHas('urpa_webhook_events', [
            'integration_id' => $this->webhook->id,
            'user_id' => $this->user->id,
            'event' => 'activity.created',
        ]);

        // Verify webhook was called
        Http::assertSent(function ($request) {
            return $request->url() === 'https://webhook.site/test' &&
                   $request->hasHeader('X-URPA-Signature') &&
                   $request->hasHeader('X-URPA-Event') &&
                   $request['event'] === 'activity.created';
        });
    }

    public function test_webhook_dispatch_on_contact_created(): void
    {
        Http::fake([
            'https://webhook.site/test' => Http::response(['ok' => true], 200),
        ]);

        // Update webhook to include contact.created event
        $this->webhook->update([
            'config' => array_merge($this->webhook->config, [
                'events' => ['contact.created'],
            ]),
        ]);

        $response = $this->postJson('/api/urpa/contacts', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
        ]);

        $response->assertStatus(201);

        // Check webhook event was created
        $this->assertDatabaseHas('urpa_webhook_events', [
            'integration_id' => $this->webhook->id,
            'user_id' => $this->user->id,
            'event' => 'contact.created',
        ]);
    }

    public function test_webhook_retry_on_failure(): void
    {
        // First attempt fails
        Http::fake([
            'https://webhook.site/test' => Http::response(['error' => 'Server error'], 500),
        ]);

        $this->postJson('/api/urpa/activities', [
            'activity_type' => 'task',
            'title' => 'Test Activity',
            'status' => 'pending',
        ]);

        // Check webhook event was created with failed status
        $webhookEvent = UrpaWebhookEvent::where('integration_id', $this->webhook->id)
            ->where('event', 'activity.created')
            ->first();

        $this->assertNotNull($webhookEvent);
        $this->assertNull($webhookEvent->delivered_at);
        $this->assertEquals(1, $webhookEvent->attempts);
        $this->assertTrue($webhookEvent->shouldRetry());
    }

    public function test_webhook_signature_verification(): void
    {
        $webhookService = app(WebhookService::class);
        
        $payload = [
            'event' => 'test.event',
            'timestamp' => now()->toIso8601String(),
            'data' => ['test' => 'data'],
        ];

        $secret = 'test_secret';
        $signature = $webhookService->generateSignature($payload, $secret);

        // Verify signature
        $isValid = $webhookService->verifySignature($payload, $signature, $secret);
        $this->assertTrue($isValid);

        // Verify invalid signature fails
        $isInvalid = $webhookService->verifySignature($payload, 'invalid_signature', $secret);
        $this->assertFalse($isInvalid);
    }

    public function test_list_webhook_events(): void
    {
        // Create some webhook events
        UrpaWebhookEvent::create([
            'integration_id' => $this->webhook->id,
            'user_id' => $this->user->id,
            'event' => 'activity.created',
            'payload' => ['test' => 'data'],
            'webhook_url' => 'https://webhook.site/test',
            'attempts' => 1,
            'delivered_at' => now(),
        ]);

        $response = $this->getJson('/api/urpa/webhooks/events');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'event',
                    'attempts',
                    'delivered_at',
                ],
            ],
        ]);
    }

    public function test_retry_failed_webhook_event(): void
    {
        Http::fake([
            'https://webhook.site/test' => Http::response(['ok' => true], 200),
        ]);

        $webhookEvent = UrpaWebhookEvent::create([
            'integration_id' => $this->webhook->id,
            'user_id' => $this->user->id,
            'event' => 'activity.created',
            'payload' => ['test' => 'data'],
            'webhook_url' => 'https://webhook.site/test',
            'attempts' => 1,
            'error_message' => 'Previous failure',
        ]);

        $response = $this->postJson("/api/urpa/webhooks/events/{$webhookEvent->id}/retry");

        $response->assertStatus(200);
        
        // Note: Actual retry happens in queue, so we just verify the endpoint works
        $this->assertTrue(true);
    }
}

