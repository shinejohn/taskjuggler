<?php

namespace Database\Factories;

use App\Models\TaskMessage;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaskMessage>
 */
class TaskMessageFactory extends Factory
{
    protected $model = TaskMessage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'task_id' => Task::factory(),
            'sender_id' => User::factory(),
            'sender_type' => $this->faker->randomElement(['human', 'ai_agent', 'system']),
            'content' => $this->faker->sentence(),
            'content_type' => $this->faker->randomElement(['text', 'file', 'image', 'system']),
            'source_channel' => $this->faker->randomElement(['email', 'sms', 'slack', 'in_app']),
            'source_channel_ref' => $this->faker->optional()->uuid(),
            'attachments' => null,
            'metadata' => null,
        ];
    }
}
