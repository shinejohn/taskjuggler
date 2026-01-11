<?php

namespace Tests\Feature\Coordinator;

use Tests\TestCase;
use App\Models\User;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Contact;
use App\Modules\Coordinator\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Organization $organization;
    protected Contact $contact;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->organization = Organization::factory()->create(['user_id' => $this->user->id]);
        $this->contact = Contact::factory()->create(['organization_id' => $this->organization->id]);
        
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'password',
        ]);
        $response->assertStatus(200);
        $this->token = $response->json('data.token') ?? '';
    }

    public function test_can_list_appointments(): void
    {
        Appointment::factory()->count(3)->create([
            'organization_id' => $this->organization->id,
            'contact_id' => $this->contact->id,
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/appointments", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'title', 'starts_at', 'ends_at', 'status'],
            ],
        ]);
    }

    public function test_can_create_appointment(): void
    {
        $data = [
            'contact_id' => $this->contact->id,
            'title' => 'Test Appointment',
            'starts_at' => now()->addDay()->toDateTimeString(),
            'ends_at' => now()->addDay()->addHour()->toDateTimeString(),
            'status' => 'scheduled',
        ];

        $response = $this->postJson("/api/coordinator/organizations/{$this->organization->id}/appointments", $data, [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'title', 'starts_at', 'ends_at']);
        $this->assertDatabaseHas('coord_appointments', [
            'organization_id' => $this->organization->id,
            'contact_id' => $this->contact->id,
            'title' => 'Test Appointment',
        ]);
    }

    public function test_can_get_appointment(): void
    {
        $appointment = Appointment::factory()->create([
            'organization_id' => $this->organization->id,
            'contact_id' => $this->contact->id,
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/appointments/{$appointment->id}", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $appointment->id,
        ]);
    }

    public function test_can_update_appointment(): void
    {
        $appointment = Appointment::factory()->create([
            'organization_id' => $this->organization->id,
            'contact_id' => $this->contact->id,
        ]);

        $response = $this->putJson("/api/coordinator/organizations/{$this->organization->id}/appointments/{$appointment->id}", [
            'title' => 'Updated Appointment',
            'status' => 'confirmed',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coord_appointments', [
            'id' => $appointment->id,
            'title' => 'Updated Appointment',
            'status' => 'confirmed',
        ]);
    }

    public function test_can_cancel_appointment(): void
    {
        $appointment = Appointment::factory()->create([
            'organization_id' => $this->organization->id,
            'contact_id' => $this->contact->id,
            'status' => 'scheduled',
        ]);

        $response = $this->postJson("/api/coordinator/organizations/{$this->organization->id}/appointments/{$appointment->id}/cancel", [
            'reason' => 'Customer requested',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coord_appointments', [
            'id' => $appointment->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_can_delete_appointment(): void
    {
        $appointment = Appointment::factory()->create([
            'organization_id' => $this->organization->id,
            'contact_id' => $this->contact->id,
        ]);

        $response = $this->deleteJson("/api/coordinator/organizations/{$this->organization->id}/appointments/{$appointment->id}", [], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertSoftDeleted('coord_appointments', [
            'id' => $appointment->id,
        ]);
    }

    public function test_can_get_today_appointments(): void
    {
        Appointment::factory()->create([
            'organization_id' => $this->organization->id,
            'contact_id' => $this->contact->id,
            'starts_at' => now()->startOfDay()->addHours(10),
            'ends_at' => now()->startOfDay()->addHours(11),
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/appointments/today", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'starts_at', 'ends_at'],
            ],
        ]);
    }
}

