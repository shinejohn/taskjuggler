<?php

namespace Database\Factories\IdeaCircuit;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IdeaCircuit\Meeting>
 */
class MeetingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => \Illuminate\Support\Str::uuid(),
            'user_id' => \App\Models\User::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'meeting_type' => $this->faker->randomElement(['general', 'presentation', 'sales_call', 'planning', 'workshop', 'webinar']),
            'status' => $this->faker->randomElement(['scheduled', 'waiting', 'active', 'ended', 'cancelled']),
            'visibility' => $this->faker->randomElement(['private', 'public', 'unlisted']),
            'requires_approval' => false,
            'allow_guests' => true,
            'max_participants' => $this->faker->numberBetween(5, 50),
            'ai_participant_enabled' => false,
            'ai_voice_enabled' => false,
            'ai_language' => 'en-US',
            'recording_enabled' => false,
            'recording_status' => 'not_started',
            'transcription_enabled' => false,
            'chime_region' => 'us-east-1',
            'settings' => [],
            'metadata' => [],
        ];
    }
}
