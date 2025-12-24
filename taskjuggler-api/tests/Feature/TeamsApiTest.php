<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TeamsApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    }

    public function test_can_create_team(): void
    {
        $this->logTestStart('Create Team', 'api');

        $this->logApiRequest('POST', '/api/teams', [
            'name' => 'Test Team',
            'description' => 'A test team',
        ]);

        $response = $this->postJson('/api/teams', [
            'name' => 'Test Team',
            'description' => 'A test team',
        ]);

        $this->logApiResponse($response->status(), $response->json());

        $response->assertStatus(201);
        
        $this->assertWithLog(
            $response->status() === 201,
            'Team created successfully',
            '201',
            (string) $response->status()
        );

        $response->assertJson([
            'team' => [
                'name' => 'Test Team',
            ],
        ]);

        $this->assertWithLog(
            $response->json('team.name') === 'Test Team',
            'Team name matches',
            'Test Team',
            $response->json('team.name') ?? 'null'
        );

        $this->assertDatabaseHas('teams', [
            'name' => 'Test Team',
            'owner_id' => $this->user->id,
        ]);

        $this->logTestEnd('passed');
    }

    public function test_can_list_teams(): void
    {
        $this->logTestStart('List Teams', 'api');

        // Create a team
        $team = Team::factory()->create(['owner_id' => $this->user->id]);
        $team->addMember($this->user, true);

        $this->logApiRequest('GET', '/api/teams');

        $response = $this->getJson('/api/teams');

        $this->logApiResponse($response->status(), $response->json());

        $this->assertWithLog(
            $response->status() === 200,
            'Teams list retrieved',
            '200',
            (string) $response->status()
        );

        $this->assertWithLog(
            count($response->json('teams')) > 0,
            'Teams list is not empty',
            '> 0',
            (string) count($response->json('teams'))
        );

        $this->logTestEnd('passed');
    }

    public function test_can_invite_member(): void
    {
        $this->logTestStart('Invite Team Member', 'api');

        $team = Team::factory()->create(['owner_id' => $this->user->id]);
        $team->addMember($this->user, true);

        $this->logApiRequest('POST', "/api/teams/{$team->id}/invite", [
            'email' => 'newmember@example.com',
            'name' => 'New Member',
        ]);

        $response = $this->postJson("/api/teams/{$team->id}/invite", [
            'email' => 'newmember@example.com',
            'name' => 'New Member',
        ]);

        $this->logApiResponse($response->status(), $response->json());

        if ($response->status() !== 201) {
            $this->testLogger->logError("Expected status 201, got: " . $response->status(), null);
            $this->testLogger->logDetail('response_body', $response->json());
        }

        $response->assertStatus(201);

        $this->assertWithLog(
            $response->status() === 201,
            'Invitation created',
            '201',
            (string) $response->status()
        );

        $inviteCode = $response->json('invitation.invite_code') ?? $response->json('invite_code') ?? null;
        $this->assertWithLog(
            !empty($inviteCode),
            'Invitation code generated',
            'not empty',
            $inviteCode ?? 'empty'
        );

        $this->logTestEnd('passed');
    }
}
