<?php

namespace Tests\Unit\Services;

use App\Models\Relationship;
use App\Models\RelationshipHistory;
use App\Models\Task;
use App\Services\TEF\TrustScoringService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrustScoringServiceTest extends TestCase
{
    use RefreshDatabase;

    private TrustScoringService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(TrustScoringService::class);
    }

    public function test_calculates_default_score_for_empty_history(): void
    {
        $user = \App\Models\User::factory()->create();
        $actorA = \App\Models\Actor::factory()->create([
            'user_id' => $user->id,
            'actor_type' => \App\Models\Actor::TYPE_HUMAN,
        ]);
        $actorB = \App\Models\Actor::factory()->create([
            'actor_type' => \App\Models\Actor::TYPE_HUMAN,
        ]);
        $relationship = Relationship::factory()->create([
            'actor_a_id' => $actorA->id,
            'actor_b_id' => $actorB->id,
        ]);

        $score = $this->service->calculateTrustScore($relationship);

        $this->assertEquals(50.0, $score);
    }

    public function test_calculates_higher_score_for_successful_outcomes(): void
    {
        $actorA = \App\Models\Actor::factory()->create();
        $actorB = \App\Models\Actor::factory()->create();
        $relationship = Relationship::factory()->create([
            'actor_a_id' => $actorA->id,
            'actor_b_id' => $actorB->id,
        ]);

        RelationshipHistory::factory()->count(5)->create([
            'relationship_id' => $relationship->id,
            'actor_a_id' => $actorA->id,
            'actor_b_id' => $actorB->id,
            'outcome' => RelationshipHistory::OUTCOME_SUCCESS,
        ]);

        $score = $this->service->calculateTrustScore($relationship);

        $this->assertGreaterThan(50.0, $score);
    }

    public function test_calculates_lower_score_for_failed_outcomes(): void
    {
        $actorA = \App\Models\Actor::factory()->create();
        $actorB = \App\Models\Actor::factory()->create();
        $relationship = Relationship::factory()->create([
            'actor_a_id' => $actorA->id,
            'actor_b_id' => $actorB->id,
        ]);

        RelationshipHistory::factory()->count(5)->create([
            'relationship_id' => $relationship->id,
            'actor_a_id' => $actorA->id,
            'actor_b_id' => $actorB->id,
            'outcome' => RelationshipHistory::OUTCOME_FAILURE,
        ]);

        $score = $this->service->calculateTrustScore($relationship);

        $this->assertLessThan(50.0, $score);
    }

    public function test_updates_trust_score(): void
    {
        $actorA = \App\Models\Actor::factory()->create();
        $actorB = \App\Models\Actor::factory()->create();
        $relationship = Relationship::factory()->create([
            'actor_a_id' => $actorA->id,
            'actor_b_id' => $actorB->id,
            'trust_score' => 50.0,
        ]);

        RelationshipHistory::factory()->count(10)->create([
            'relationship_id' => $relationship->id,
            'actor_a_id' => $actorA->id,
            'actor_b_id' => $actorB->id,
            'outcome' => RelationshipHistory::OUTCOME_SUCCESS,
        ]);

        $this->service->updateTrustScore($relationship);

        $relationship->refresh();
        $this->assertGreaterThan(50.0, $relationship->trust_score);
    }

    public function test_provides_recommendations(): void
    {
        $actorA = \App\Models\Actor::factory()->create();
        $actorB = \App\Models\Actor::factory()->create();
        $relationship = Relationship::factory()->create([
            'actor_a_id' => $actorA->id,
            'actor_b_id' => $actorB->id,
            'trust_score' => 25.0,
        ]);

        $recommendations = $this->service->getTrustRecommendations($relationship);

        $this->assertIsArray($recommendations);
    }
}
