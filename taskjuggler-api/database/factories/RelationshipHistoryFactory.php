<?php

namespace Database\Factories;

use App\Models\RelationshipHistory;
use App\Models\Relationship;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RelationshipHistory>
 */
class RelationshipHistoryFactory extends Factory
{
    protected $model = RelationshipHistory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => \Illuminate\Support\Str::uuid(),
            'relationship_id' => Relationship::factory(),
            'actor_a_id' => \App\Models\Actor::factory(),
            'actor_b_id' => \App\Models\Actor::factory(),
            'task_id' => Task::factory(),
            'event_type' => RelationshipHistory::EVENT_TASK_SENT,
            'outcome' => RelationshipHistory::OUTCOME_SUCCESS,
            'response_time_ms' => $this->faker->numberBetween(1000, 3600000), // 1 second to 1 hour
            'completion_time_ms' => $this->faker->numberBetween(3600000, 604800000), // 1 hour to 7 days
            'metadata' => [],
        ];
    }

    /**
     * Indicate that the event was a success.
     */
    public function success(): static
    {
        return $this->state(fn (array $attributes) => [
            'outcome' => RelationshipHistory::OUTCOME_SUCCESS,
            'event_type' => RelationshipHistory::EVENT_TASK_COMPLETED,
        ]);
    }

    /**
     * Indicate that the event was a failure.
     */
    public function failure(): static
    {
        return $this->state(fn (array $attributes) => [
            'outcome' => RelationshipHistory::OUTCOME_FAILURE,
            'event_type' => RelationshipHistory::EVENT_TASK_REJECTED,
        ]);
    }
}
