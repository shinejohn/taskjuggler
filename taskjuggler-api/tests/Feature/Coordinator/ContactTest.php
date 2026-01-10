<?php

namespace Tests\Feature\Coordinator;

use Tests\TestCase;
use App\Models\User;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ContactTest extends TestCase
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

    public function test_can_list_contacts(): void
    {
        Contact::factory()->count(5)->create(['organization_id' => $this->organization->id]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/contacts", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'first_name', 'last_name', 'email', 'phone'],
            ],
            'total',
            'page',
        ]);
    }

    public function test_can_search_contacts(): void
    {
        Contact::factory()->create([
            'organization_id' => $this->organization->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/contacts?search=John", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertGreaterThan(0, count($response->json('data')));
    }

    public function test_can_create_contact(): void
    {
        $data = [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com',
            'phone' => '555-123-4567',
        ];

        $response = $this->postJson("/api/coordinator/organizations/{$this->organization->id}/contacts", $data, [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('coord_contacts', [
            'organization_id' => $this->organization->id,
            'first_name' => 'Jane',
            'email' => 'jane@example.com',
        ]);
    }

    public function test_can_get_contact(): void
    {
        $contact = Contact::factory()->create(['organization_id' => $this->organization->id]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/contacts/{$contact->id}", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $contact->id,
        ]);
    }

    public function test_can_update_contact(): void
    {
        $contact = Contact::factory()->create(['organization_id' => $this->organization->id]);

        $response = $this->putJson("/api/coordinator/organizations/{$this->organization->id}/contacts/{$contact->id}", [
            'first_name' => 'Updated',
            'phone' => '555-999-8888',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coord_contacts', [
            'id' => $contact->id,
            'first_name' => 'Updated',
            'phone' => '555-999-8888',
        ]);
    }
}

