<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Team;
use App\Models\User;
use App\Modules\Processes\Models\Process;
use App\Modules\Processes\Models\ProcessStep;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Covers the Processes module revenue path: execute a process via the API
 * and read executions back. Also locks in the route ordering fix —
 * GET /processes/executions must NOT be captured by the {process} binding.
 */
class ProcessExecutionApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Team $team;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->team = Team::factory()->create(['owner_id' => $this->user->id]);
        $this->team->addMember($this->user, true);
        $this->user->update(['current_team_id' => $this->team->id]);
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    private function authHeaders(): array
    {
        return [
            'Authorization' => "Bearer {$this->token}",
            'X-Team-ID' => $this->team->id,
        ];
    }

    private function makeExecutableProcess(): Process
    {
        $process = Process::create([
            'team_id' => $this->team->id,
            'name' => 'Test Process',
            'status' => 'active',
            'trigger_type' => 'manual',
        ]);

        // 'action' + 'log' is the only side-effect-free step type
        ProcessStep::create([
            'process_id' => $process->id,
            'name' => 'Log step',
            'order' => 1,
            'step_type' => 'action',
            'config' => ['action' => 'log', 'message' => 'hello from test'],
        ]);

        return $process;
    }

    public function test_user_can_execute_a_process(): void
    {
        $process = $this->makeExecutableProcess();

        $response = $this->withHeaders($this->authHeaders())
            ->postJson("/api/processes/{$process->id}/execute");

        $response->assertStatus(201)
            ->assertJsonPath('data.process_id', $process->id)
            ->assertJsonPath('data.status', 'completed');

        $this->assertDatabaseHas('process_executions', [
            'process_id' => $process->id,
            'status' => 'completed',
        ]);
    }

    public function test_executions_index_is_not_shadowed_by_process_binding(): void
    {
        $process = $this->makeExecutableProcess();

        $this->withHeaders($this->authHeaders())
            ->postJson("/api/processes/{$process->id}/execute")
            ->assertStatus(201);

        // Literal route — would 404 if apiResource('processes') captured it
        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/processes/executions');

        $response->assertStatus(200);
        $this->assertGreaterThanOrEqual(1, count($response->json('data')));
    }

    public function test_cannot_execute_process_from_another_team(): void
    {
        $process = $this->makeExecutableProcess();

        $otherUser = User::factory()->create();
        $otherTeam = Team::factory()->create(['owner_id' => $otherUser->id]);
        $otherTeam->addMember($otherUser, true);
        $otherUser->update(['current_team_id' => $otherTeam->id]);
        $otherToken = $otherUser->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$otherToken}",
            'X-Team-ID' => $otherTeam->id,
        ])->postJson("/api/processes/{$process->id}/execute");

        $response->assertStatus(403);
    }

    public function test_cannot_execute_draft_process(): void
    {
        $process = Process::create([
            'team_id' => $this->team->id,
            'name' => 'Draft Process',
            'status' => 'draft',
            'trigger_type' => 'manual',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson("/api/processes/{$process->id}/execute");

        $response->assertStatus(500);
        $this->assertDatabaseMissing('process_executions', [
            'process_id' => $process->id,
        ]);
    }
}
