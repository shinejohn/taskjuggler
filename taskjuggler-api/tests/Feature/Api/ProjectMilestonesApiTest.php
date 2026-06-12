<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Team;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Models\ProjectMilestone;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectMilestonesApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Team $team;
    protected Project $project;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->team = Team::factory()->create(['owner_id' => $this->user->id]);
        $this->team->addMember($this->user, true);

        $this->project = Project::create([
            'team_id' => $this->team->id,
            'owner_id' => $this->user->id,
            'name' => 'Test Project',
        ]);

        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    protected function headers(): array
    {
        return [
            'Authorization' => "Bearer {$this->token}",
            'X-Team-ID' => $this->team->id,
        ];
    }

    public function test_can_list_milestones(): void
    {
        $this->project->milestones()->create(['name' => 'Alpha', 'order' => 2]);
        $this->project->milestones()->create(['name' => 'Beta', 'order' => 1]);

        $response = $this->getJson("/api/projects/{$this->project->id}/milestones", $this->headers());

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        $this->assertSame('Beta', $response->json('data.0.name'));
    }

    public function test_can_create_milestone(): void
    {
        $response = $this->postJson("/api/projects/{$this->project->id}/milestones", [
            'name' => 'Launch',
            'description' => 'Go live',
            'target_date' => now()->addMonth()->toDateString(),
            'is_critical' => true,
        ], $this->headers());

        $response->assertStatus(201);
        $this->assertSame('Launch', $response->json('data.name'));
        $this->assertDatabaseHas('project_milestones', [
            'project_id' => $this->project->id,
            'name' => 'Launch',
        ]);
    }

    public function test_create_requires_name(): void
    {
        $response = $this->postJson(
            "/api/projects/{$this->project->id}/milestones",
            ['description' => 'No name'],
            $this->headers()
        );

        $response->assertStatus(422);
    }

    public function test_rejects_invalid_status(): void
    {
        $response = $this->postJson("/api/projects/{$this->project->id}/milestones", [
            'name' => 'Bad Status',
            'status' => 'not-a-status',
        ], $this->headers());

        $response->assertStatus(422);
    }

    public function test_can_update_milestone(): void
    {
        $milestone = $this->project->milestones()->create(['name' => 'Draft']);

        $response = $this->putJson(
            "/api/projects/{$this->project->id}/milestones/{$milestone->id}",
            ['name' => 'Renamed', 'status' => ProjectMilestone::STATUS_IN_PROGRESS],
            $this->headers()
        );

        $response->assertStatus(200);
        $this->assertSame('Renamed', $response->json('data.name'));
        $this->assertSame(ProjectMilestone::STATUS_IN_PROGRESS, $response->json('data.status'));
    }

    public function test_can_complete_milestone(): void
    {
        $milestone = $this->project->milestones()->create(['name' => 'Ship it']);

        $response = $this->postJson(
            "/api/projects/{$this->project->id}/milestones/{$milestone->id}/complete",
            [],
            $this->headers()
        );

        $response->assertStatus(200);
        $this->assertSame(ProjectMilestone::STATUS_COMPLETED, $response->json('data.status'));
        $this->assertNotNull($response->json('data.completed_date'));
    }

    public function test_can_delete_milestone(): void
    {
        $milestone = $this->project->milestones()->create(['name' => 'Temp']);

        $response = $this->deleteJson(
            "/api/projects/{$this->project->id}/milestones/{$milestone->id}",
            [],
            $this->headers()
        );

        $response->assertStatus(204);
        $this->assertDatabaseMissing('project_milestones', ['id' => $milestone->id]);
    }

    public function test_cannot_access_other_teams_project(): void
    {
        $otherOwner = User::factory()->create();
        $otherTeam = Team::factory()->create(['owner_id' => $otherOwner->id]);
        $otherProject = Project::create([
            'team_id' => $otherTeam->id,
            'owner_id' => $this->user->id,
            'name' => 'Other Team Project',
        ]);

        $response = $this->getJson("/api/projects/{$otherProject->id}/milestones", $this->headers());

        $response->assertStatus(403);
    }

    public function test_milestone_must_belong_to_project(): void
    {
        $otherProject = Project::create([
            'team_id' => $this->team->id,
            'owner_id' => $this->user->id,
            'name' => 'Second Project',
        ]);
        $milestone = $otherProject->milestones()->create(['name' => 'Elsewhere']);

        $response = $this->putJson(
            "/api/projects/{$this->project->id}/milestones/{$milestone->id}",
            ['name' => 'Hijack'],
            $this->headers()
        );

        $response->assertStatus(404);
    }
}
