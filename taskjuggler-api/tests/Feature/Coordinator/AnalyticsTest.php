<?php

declare(strict_types=1);

namespace Tests\Feature\Coordinator;

use Tests\TestCase;
use App\Models\User;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\CallLog;
use App\Modules\Coordinator\Models\Appointment;
use App\Modules\Coordinator\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AnalyticsTest extends TestCase
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

        $response = $this->withHeaders(['X-App-Context' => 'coordinator'])->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'password',
        ]);
        $response->assertStatus(200);
        $this->token = $response->json('data.token') ?? '';
    }

    public function test_can_get_analytics(): void
    {
        CallLog::factory()->count(5)->create([
            'organization_id' => $this->organization->id,
            'started_at' => now()->subDays(2),
        ]);

        $contact = Contact::factory()->create(['organization_id' => $this->organization->id]);
        Appointment::factory()->create([
            'organization_id' => $this->organization->id,
            'contact_id' => $contact->id,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->subDay()->addHour(),
        ]);

        $response = $this->getJson("/api/coordinator/organizations/{$this->organization->id}/analytics", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'period' => ['from', 'to'],
            'calls' => [
                'total_calls',
                'inbound_calls',
                'outbound_calls',
                'answered_calls',
                'missed_calls',
                'answer_rate',
                'avg_duration_seconds',
                'appointments_booked',
                'booking_rate',
                'outcomes',
                'by_hour',
            ],
            'appointments' => [
                'total_appointments',
                'confirmed',
                'completed',
                'cancelled',
                'no_shows',
                'confirmation_rate',
                'completion_rate',
                'no_show_rate',
            ],
            'contacts' => [
                'total_contacts',
                'new_contacts',
                'contacts_with_appointments',
            ],
            'coordinators',
            'trends' => ['calls', 'appointments'],
        ]);

        $this->assertSame(5, $response->json('calls.total_calls'));
        $this->assertSame(1, $response->json('appointments.total_appointments'));
    }

    public function test_supports_custom_date_range(): void
    {
        CallLog::factory()->create([
            'organization_id' => $this->organization->id,
            'started_at' => now()->subDays(60),
        ]);
        CallLog::factory()->create([
            'organization_id' => $this->organization->id,
            'started_at' => now()->subDays(2),
        ]);

        $response = $this->getJson(
            "/api/coordinator/organizations/{$this->organization->id}/analytics?"
            . http_build_query([
                'date_from' => now()->subDays(7)->toDateString(),
                'date_to' => now()->toDateString(),
            ]),
            ['Authorization' => "Bearer {$this->token}"]
        );

        $response->assertStatus(200);
        $this->assertSame(1, $response->json('calls.total_calls'));
    }

    public function test_rejects_date_to_before_date_from(): void
    {
        $response = $this->getJson(
            "/api/coordinator/organizations/{$this->organization->id}/analytics?"
            . http_build_query([
                'date_from' => now()->toDateString(),
                'date_to' => now()->subDays(7)->toDateString(),
            ]),
            ['Authorization' => "Bearer {$this->token}"]
        );

        $response->assertStatus(422);
    }

    public function test_cannot_view_another_users_organization_analytics(): void
    {
        $otherUser = User::factory()->create();
        $otherOrg = Organization::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->getJson("/api/coordinator/organizations/{$otherOrg->id}/analytics", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(404);
    }
}
