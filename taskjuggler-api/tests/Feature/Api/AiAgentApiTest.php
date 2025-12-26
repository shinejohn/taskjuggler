<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Actor;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiAgentApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    public function test_user_can_register_ai_agent(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/ai/agents/register', [
                'name' => 'Test AI Agent',
                'agent_type' => 'assistant',
                'capabilities' => ['task_creation', 'task_completion'],
                'mcp_endpoint' => 'http://localhost:8000/mcp',
            ]);

        $response->assertStatus(201);
        $json = $response->json();
        $agentData = $json['agent'] ?? $json;
        $this->assertArrayHasKey('id', $agentData);

        $this->assertDatabaseHas('actors', [
            'display_name' => 'Test AI Agent',
            'actor_type' => Actor::TYPE_AI_AGENT,
        ]);
    }

    public function test_user_can_list_agents(): void
    {
        Actor::factory()->count(3)->create([
            'actor_type' => Actor::TYPE_AI_AGENT,
            'user_id' => $this->user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/ai/agents');

        $response->assertStatus(200);
        $json = $response->json();
        $agents = $json['data'] ?? $json;
        $this->assertGreaterThanOrEqual(3, count($agents));
    }

    public function test_user_can_delegate_task_to_agent(): void
    {
        // Create requestor actor for the user
        Actor::factory()->create([
            'actor_type' => Actor::TYPE_HUMAN,
            'user_id' => $this->user->id,
        ]);

        $agent = Actor::factory()->create([
            'actor_type' => Actor::TYPE_AI_AGENT,
            'user_id' => $this->user->id,
            'capabilities' => ['task_completion'],
            'contact_methods' => [
                ['protocol' => 'mcp', 'endpoint' => 'http://localhost:8000/mcp']
            ],
        ]);

        $task = Task::factory()->create([
            'requestor_id' => $this->user->id,
            'status' => 'pending',
        ]);

        // Mock HTTP call to MCP endpoint - match any URL containing the endpoint
        Http::fake([
            '*' => Http::response(['success' => true], 200),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/ai/agents/{$agent->id}/delegate-task", [
                'task_id' => $task->id,
            ]);

        $response->assertStatus(200);
        $json = $response->json();
        $data = $json['data'] ?? $json;
        $this->assertArrayHasKey('message', $data);
        $this->assertArrayHasKey('task_id', $data);
    }

    public function test_user_can_generate_claim_code(): void
    {
        $agent = Actor::factory()->create([
            'actor_type' => Actor::TYPE_AI_AGENT,
            'user_id' => $this->user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/ai/agents/{$agent->id}/claim-code");

        $response->assertStatus(200);
        $json = $response->json();
        $data = $json['data'] ?? $json;
        $this->assertArrayHasKey('claim_code', $data);
    }
}
