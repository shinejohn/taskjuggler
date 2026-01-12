<?php

namespace Database\Factories\IdeaCircuit;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IdeaCircuit\MeetingMessage>
 */
class MeetingMessageFactory extends Factory
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
            'participant_id' => \App\Models\IdeaCircuit\MeetingParticipant::factory(),
            'user_id' => \App\Models\User::factory(),
            'message_text' => $this->faker->sentence(),
            'message_type' => $this->faker->randomElement(['text', 'system', 'ai_response']),
            'is_ai_generated' => false,
            'is_edited' => false,
            'is_deleted' => false,
            'thread_count' => 0,
            'mentioned_users' => [],
            'action_items' => [],
            'key_phrases' => [],
            'has_attachments' => false,
            'attachment_urls' => [],
            'metadata' => [],
        ];
    }
}
