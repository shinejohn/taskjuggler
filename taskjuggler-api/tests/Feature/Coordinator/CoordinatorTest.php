<?php

namespace Tests\Feature\Coordinator;

use Tests\TestCase;
use App\Models\User;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Coordinator;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CoordinatorTest extends TestCase
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

    public function test_can_list_coordinators(): void
    {
        Coordinator::factory()->count(2)->create(['organization_id' => $this->organization->id]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/coordinators", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id', 'display_name', 'status'],
        ]);
        $this->assertCount(2, $response->json());
    }

    public function test_can_create_coordinator(): void
    {
        $data = [
            'role_template_id' => 'test-role-id',
            'persona_template_id' => 'test-persona-id',
            'display_name' => 'Sally',
        ];

        $response = $this->postJson("/api/coordinator/organizations/{$this->organization->id}/coordinators", $data, [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'display_name', 'status']);
        $this->assertDatabaseHas('coord_coordinators', [
            'organization_id' => $this->organization->id,
            'display_name' => 'Sally',
        ]);
    }

    public function test_can_get_coordinator(): void
    {
        $coordinator = Coordinator::factory()->create(['organization_id' => $this->organization->id]);

        $response = $this->getJson("/api/coordinator/coordinators/{$coordinator->id}", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $coordinator->id,
        ]);
    }

    public function test_can_update_coordinator(): void
    {
        $coordinator = Coordinator::factory()->create(['organization_id' => $this->organization->id]);

        $response = $this->putJson("/api/coordinator/coordinators/{$coordinator->id}", [
            'display_name' => 'Updated Name',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coord_coordinators', [
            'id' => $coordinator->id,
            'display_name' => 'Updated Name',
        ]);
    }

    public function test_can_delete_coordinator(): void
    {
        $coordinator = Coordinator::factory()->create(['organization_id' => $this->organization->id]);

        $response = $this->deleteJson("/api/coordinator/coordinators/{$coordinator->id}", [], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertSoftDeleted('coord_coordinators', [
            'id' => $coordinator->id,
        ]);
    }
}

