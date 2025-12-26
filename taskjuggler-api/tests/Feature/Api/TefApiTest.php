<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Actor;
use App\Models\Relationship;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TefApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;
    private Actor $actor;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
        $this->actor = Actor::factory()->create([
            'user_id' => $this->user->id,
            'actor_type' => Actor::TYPE_HUMAN,
        ]);
    }

    public function test_user_can_register_actor(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/tef/v1/actors', [
                'actor_type' => Actor::TYPE_HUMAN,
                'display_name' => 'Test Actor',
                'capabilities' => ['task_creation', 'task_assignment'],
            ]);

        $response->assertStatus(201);
        $json = $response->json();
        $actorData = $json['data'] ?? $json;
        $this->assertArrayHasKey('id', $actorData);
        $this->assertEquals(Actor::TYPE_HUMAN, $actorData['actor_type']);
    }

    public function test_user_can_view_actor(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/tef/v1/actors/{$this->actor->id}");

        $response->assertStatus(200);
        $json = $response->json();
        $actorData = $json['data'] ?? $json;
        $this->assertEquals($this->actor->id, $actorData['id']);
    }

    public function test_user_can_create_relationship(): void
    {
        $actorB = Actor::factory()->create([
            'actor_type' => Actor::TYPE_HUMAN,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/tef/v1/relationships', [
                'actor_b_id' => $actorB->id,
                'relationship_type' => Relationship::TYPE_PEER,
                'permissions' => ['read', 'write'],
            ]);

        $response->assertStatus(201);
        $json = $response->json();
        // Response might be wrapped or direct
        $relData = $json['data'] ?? $json;
        $this->assertArrayHasKey('id', $relData);
        $this->assertArrayHasKey('actor_a_id', $relData);
        $this->assertArrayHasKey('actor_b_id', $relData);
    }

    public function test_user_can_get_trust_score(): void
    {
        $actorB = Actor::factory()->create(['actor_type' => Actor::TYPE_HUMAN]);
        $relationship = Relationship::factory()->create([
            'actor_a_id' => $this->actor->id,
            'actor_b_id' => $actorB->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/tef/v1/relationships/{$relationship->id}/trust-score");

        $response->assertStatus(200);
        $json = $response->json();
        $data = $json['data'] ?? $json;
        $this->assertArrayHasKey('relationship_id', $data);
        $this->assertArrayHasKey('trust_score', $data);
    }

    public function test_user_can_recalculate_trust_score(): void
    {
        $actorB = Actor::factory()->create(['actor_type' => Actor::TYPE_HUMAN]);
        $relationship = Relationship::factory()->create([
            'actor_a_id' => $this->actor->id,
            'actor_b_id' => $actorB->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/tef/v1/relationships/{$relationship->id}/trust-score/recalculate");

        $response->assertStatus(200);
        $json = $response->json();
        $data = $json['data'] ?? $json;
        $this->assertArrayHasKey('message', $data);
        $this->assertArrayHasKey('trust_score', $data);
    }
}
