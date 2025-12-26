<?php

namespace Database\Factories;

use App\Models\Relationship;
use App\Models\Actor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Relationship>
 */
class RelationshipFactory extends Factory
{
    protected $model = Relationship::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'actor_a_id' => fn() => Actor::factory()->create()->id,
            'actor_b_id' => fn() => Actor::factory()->create()->id,
            'relationship_type' => Relationship::TYPE_PEER,
            'permissions' => ['read', 'write'],
            'established_via' => Relationship::VIA_API,
            'trust_score' => 50.0,
            'task_count' => 0,
            'expires_at' => null,
        ];
    }

    /**
     * Indicate that the relationship has high trust.
     */
    public function highTrust(): static
    {
        return $this->state(fn (array $attributes) => [
            'trust_score' => $this->faker->numberBetween(80, 100),
            'task_count' => $this->faker->numberBetween(10, 50),
        ]);
    }

    /**
     * Indicate that the relationship has low trust.
     */
    public function lowTrust(): static
    {
        return $this->state(fn (array $attributes) => [
            'trust_score' => $this->faker->numberBetween(0, 30),
            'task_count' => $this->faker->numberBetween(1, 5),
        ]);
    }
}
