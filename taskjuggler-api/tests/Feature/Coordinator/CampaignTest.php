<?php

namespace Tests\Feature\Coordinator;

use Tests\TestCase;
use App\Models\User;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Campaign;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CampaignTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Organization $organization;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->organization = Organization::factory()->create(['user_id' => $this->user->id]);
        
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'password',
        ]);
        $this->token = $response->json('token');
    }

    public function test_can_list_campaigns(): void
    {
        Campaign::factory()->count(2)->create(['organization_id' => $this->organization->id]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/campaigns", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'type', 'status'],
            ],
            'total',
            'per_page',
            'current_page',
        ]);
    }

    public function test_can_create_campaign(): void
    {
        $data = [
            'name' => 'Test Campaign',
            'type' => 'appointment_booking',
            'description' => 'Test campaign description',
            'target_count' => 100,
        ];

        $response = $this->postJson("/api/coordinator/organizations/{$this->organization->id}/campaigns", $data, [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'name', 'type', 'status']);
        $this->assertDatabaseHas('coord_campaigns', [
            'organization_id' => $this->organization->id,
            'name' => 'Test Campaign',
            'status' => 'draft',
        ]);
    }

    public function test_can_start_campaign(): void
    {
        $campaign = Campaign::factory()->create([
            'organization_id' => $this->organization->id,
            'status' => 'draft',
        ]);

        $response = $this->postJson("/api/coordinator/organizations/{$this->organization->id}/campaigns/{$campaign->id}/start", [], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coord_campaigns', [
            'id' => $campaign->id,
            'status' => 'running',
        ]);
    }

    public function test_can_pause_campaign(): void
    {
        $campaign = Campaign::factory()->create([
            'organization_id' => $this->organization->id,
            'status' => 'running',
        ]);

        $response = $this->postJson("/api/coordinator/organizations/{$this->organization->id}/campaigns/{$campaign->id}/pause", [], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coord_campaigns', [
            'id' => $campaign->id,
            'status' => 'paused',
        ]);
    }

    public function test_can_get_campaign_stats(): void
    {
        $campaign = Campaign::factory()->create([
            'organization_id' => $this->organization->id,
            'contacts_processed' => 50,
            'contacts_contacted' => 40,
            'appointments_booked' => 10,
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/campaigns/{$campaign->id}/stats", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'contacts_processed',
            'contacts_contacted',
            'appointments_booked',
            'booking_rate',
        ]);
    }
}

