<?php

namespace Database\Factories;

use App\Models\DirectMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DirectMessage>
 */
class DirectMessageFactory extends Factory
{
    protected $model = DirectMessage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'sender_id' => User::factory(),
            'recipient_id' => User::factory(),
            'content' => $this->faker->sentence(),
            'read_at' => $this->faker->optional(0.3)->dateTime(),
        ];
    }
}
