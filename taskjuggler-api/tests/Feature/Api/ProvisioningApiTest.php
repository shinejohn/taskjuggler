<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Modules\Core\Models\Subscription;
use App\Modules\Core\Models\Team;
use App\Modules\Core\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Covers the Command Center provisioning bridge
 * (POST /api/provision/subscription — see PROVISIONING_CONTRACT.md).
 */
class ProvisioningApiTest extends TestCase
{
    use RefreshDatabase;

    private const SECRET = 'test-provisioning-secret';

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.provisioning.secret' => self::SECRET]);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'email' => 'owner@example.com',
            'business_name' => 'Acme Plumbing',
            'crm_order_id' => 'order-123',
            'plan_tier' => 'pro',
            'subscription_id' => 'crm-sub-456',
            'stripe_subscription_id' => 'sub_stripe789',
            'app' => 'taskjuggler',
            'started_at' => '2026-06-01T00:00:00Z',
            'expires_at' => '2026-07-01T00:00:00Z',
        ], $overrides);
    }

    private function provision(array $payload, ?string $secret = self::SECRET): \Illuminate\Testing\TestResponse
    {
        $headers = $secret !== null ? ['X-Provisioning-Secret' => $secret] : [];

        return $this->withHeaders($headers)->postJson('/api/provision/subscription', $payload);
    }

    public function test_provisions_new_user_team_and_subscription(): void
    {
        $response = $this->provision($this->validPayload());

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'user_id', 'team_id', 'subscription_id', 'message'])
            ->assertJson(['success' => true]);

        $user = User::where('email', 'owner@example.com')->first();
        $this->assertNotNull($user);

        $team = Team::find($response->json('team_id'));
        $this->assertNotNull($team);
        $this->assertSame('Acme Plumbing', $team->name);
        $this->assertSame($team->id, $user->fresh()->current_team_id);

        $subscription = Subscription::find($response->json('subscription_id'));
        $this->assertNotNull($subscription);
        $this->assertSame('pro', $subscription->plan);
        $this->assertSame('active', $subscription->status);
        $this->assertSame($team->id, $subscription->team_id);
        $this->assertSame('order-123', $subscription->metadata['crm_order_id'] ?? null);
        $this->assertSame('crm-sub-456', $subscription->metadata['crm_subscription_id'] ?? null);
        $this->assertSame('command-center', $subscription->metadata['provisioned_via'] ?? null);
    }

    public function test_rejects_missing_secret(): void
    {
        $this->provision($this->validPayload(), null)->assertStatus(401);
    }

    public function test_rejects_wrong_secret(): void
    {
        $this->provision($this->validPayload(), 'wrong-secret')->assertStatus(401);

        $this->assertDatabaseMissing('users', ['email' => 'owner@example.com']);
    }

    public function test_rejects_invalid_plan_tier(): void
    {
        $response = $this->provision($this->validPayload(['plan_tier' => 'platinum']));

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['plan_tier']]);
    }

    public function test_rejects_missing_required_fields(): void
    {
        $response = $this->provision([
            'email' => 'owner@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors' => ['business_name', 'crm_order_id', 'plan_tier', 'subscription_id', 'started_at', 'expires_at']]);
    }

    public function test_reprovisioning_updates_existing_active_subscription(): void
    {
        $first = $this->provision($this->validPayload());
        $first->assertStatus(200);

        $second = $this->provision($this->validPayload([
            'plan_tier' => 'business',
            'crm_order_id' => 'order-999',
        ]));
        $second->assertStatus(200);

        // Same user, same team, same subscription row — upgraded in place
        $this->assertSame($first->json('user_id'), $second->json('user_id'));
        $this->assertSame($first->json('team_id'), $second->json('team_id'));
        $this->assertSame($first->json('subscription_id'), $second->json('subscription_id'));
        $this->assertSame(1, Subscription::count());

        $subscription = Subscription::find($second->json('subscription_id'));
        $this->assertSame('business', $subscription->plan);
        $this->assertSame('order-999', $subscription->metadata['crm_order_id'] ?? null);
    }

    public function test_returns_500_when_secret_not_configured(): void
    {
        config(['services.provisioning.secret' => null]);

        $this->provision($this->validPayload())->assertStatus(500);
    }
}
