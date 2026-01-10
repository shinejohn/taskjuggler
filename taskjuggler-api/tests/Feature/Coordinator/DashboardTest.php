<?php

namespace Tests\Feature\Coordinator;

use Tests\TestCase;
use App\Models\User;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\CallLog;
use App\Modules\Coordinator\Models\Appointment;
use App\Modules\Coordinator\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DashboardTest extends TestCase
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

    public function test_can_get_dashboard_metrics(): void
    {
        CallLog::factory()->count(5)->create([
            'organization_id' => $this->organization->id,
            'started_at' => now(),
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/dashboard/metrics", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'calls_today',
            'calls_today_trend',
            'appointments_this_week',
            'appointments_trend',
            'total_contacts',
            'no_show_rate',
        ]);
    }

    public function test_can_get_recent_calls(): void
    {
        CallLog::factory()->count(10)->create([
            'organization_id' => $this->organization->id,
            'started_at' => now(),
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/dashboard/recent-calls", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'time', 'contact_name', 'duration', 'outcome'],
            ],
        ]);
    }

    public function test_can_get_today_appointments(): void
    {
        $contact = Contact::factory()->create(['organization_id' => $this->organization->id]);
        
        Appointment::factory()->create([
            'organization_id' => $this->organization->id,
            'contact_id' => $contact->id,
            'starts_at' => now()->startOfDay()->addHours(10),
            'ends_at' => now()->startOfDay()->addHours(11),
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/dashboard/today-appointments", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'time', 'contact_name', 'type', 'status'],
            ],
        ]);
    }
}

