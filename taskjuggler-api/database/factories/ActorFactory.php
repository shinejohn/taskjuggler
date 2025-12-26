<?php

namespace Database\Factories;

use App\Models\Actor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Actor>
 */
class ActorFactory extends Factory
{
    protected $model = Actor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'user_id' => User::factory(),
            'actor_type' => Actor::TYPE_HUMAN,
            'display_name' => $this->faker->name(),
            'capabilities' => ['task_creation', 'task_assignment'],
            'contact_methods' => [],
            'metadata' => [],
            'status' => Actor::STATUS_ACTIVE,
        ];
    }

    /**
     * Indicate that the actor is an IoT device.
     */
    public function iotDevice(): static
    {
        return $this->state(fn (array $attributes) => [
            'actor_type' => Actor::TYPE_IOT_DEVICE,
            'display_name' => $this->faker->words(2, true) . ' Device',
            'capabilities' => ['temperature', 'humidity'],
            'contact_methods' => [
                [
                    'protocol' => 'mqtt',
                    'endpoint' => 'mqtt://broker.example.com',
                    'topic' => 'device/' . Str::random(8),
                ],
            ],
        ]);
    }

    /**
     * Indicate that the actor is an AI agent.
     */
    public function aiAgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'actor_type' => Actor::TYPE_AI_AGENT,
            'display_name' => $this->faker->words(2, true) . ' AI Agent',
            'capabilities' => ['task_creation', 'task_completion'],
            'contact_methods' => [
                [
                    'protocol' => 'mcp',
                    'endpoint' => 'http://localhost:8000/mcp',
                ],
            ],
        ]);
    }
}
