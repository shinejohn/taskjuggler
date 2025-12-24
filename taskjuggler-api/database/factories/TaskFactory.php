<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->optional()->paragraph(),
            'requestor_id' => User::factory(),
            'owner_id' => $this->faker->optional(0.5)->randomElement([User::factory(), null]),
            'status' => $this->faker->randomElement(['pending', 'accepted', 'in_progress', 'completed']),
            'priority' => $this->faker->randomElement(['low', 'normal', 'high', 'urgent']),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'color_state' => $this->faker->randomElement(['blue', 'green', 'yellow', 'red']),
        ];
    }
}
