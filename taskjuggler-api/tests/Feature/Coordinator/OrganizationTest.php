<?php

namespace Tests\Feature\Coordinator;

use Tests\TestCase;
use App\Models\User;
use App\Modules\Coordinator\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrganizationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'password',
        ]);
        $this->token = $response->json('token');
    }

    public function test_can_list_organizations(): void
    {
        Organization::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/coordinator/organizations', [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'industry', 'status'],
            ],
        ]);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_create_organization(): void
    {
        $data = [
            'name' => 'Test Business',
            'industry' => 'dental',
            'phone' => '555-123-4567',
            'email' => 'test@business.com',
        ];

        $response = $this->postJson('/api/coordinator/organizations', $data, [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'name', 'industry']);
        $this->assertDatabaseHas('coord_organizations', [
            'name' => 'Test Business',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_can_get_organization(): void
    {
        $organization = Organization::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/coordinator/organizations/{$organization->id}", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $organization->id,
            'name' => $organization->name,
        ]);
    }

    public function test_can_update_organization(): void
    {
        $organization = Organization::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/coordinator/organizations/{$organization->id}", [
            'name' => 'Updated Business Name',
            'phone' => '555-999-8888',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coord_organizations', [
            'id' => $organization->id,
            'name' => 'Updated Business Name',
            'phone' => '555-999-8888',
        ]);
    }

    public function test_cannot_access_other_user_organization(): void
    {
        $otherUser = User::factory()->create();
        $organization = Organization::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->getJson("/api/coordinator/organizations/{$organization->id}", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(404);
    }
}

