<?php

namespace Database\Factories\IdeaCircuit;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IdeaCircuit\MeetingNote>
 */
class MeetingNoteFactory extends Factory
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
            'meeting_id' => \App\Models\IdeaCircuit\Meeting::factory(),
            'user_id' => \App\Models\User::factory(),
            'category' => $this->faker->randomElement(['Action Items', 'Decisions', 'Key Points', 'Questions', 'Follow-ups']),
            'content' => $this->faker->paragraph(),
            'note_type' => 'manual',
            'tags' => [],
            'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'urgent']),
            'status' => $this->faker->randomElement(['open', 'in_progress', 'completed', 'cancelled']),
            'is_shared' => true,
            'shared_with_participant_ids' => [],
            'extracted_from_transcript' => false,
            'metadata' => [],
        ];
    }
}
