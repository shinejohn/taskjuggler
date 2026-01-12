<?php

namespace Database\Factories\IdeaCircuit;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IdeaCircuit\MeetingParticipant>
 */
class MeetingParticipantFactory extends Factory
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
            'is_guest' => false,
            'display_name' => $this->faker->name(),
            'role' => $this->faker->randomElement(['host', 'co-host', 'presenter', 'attendee']),
            'is_active' => $this->faker->boolean(),
            'connection_status' => $this->faker->randomElement(['connected', 'disconnected', 'reconnecting']),
            'is_muted' => false,
            'is_video_off' => true,
            'is_screen_sharing' => false,
            'can_chat' => true,
            'can_share_screen' => true,
            'can_record' => false,
            'can_view_notes' => true,
            'can_edit_notes' => false,
            'can_invite_others' => false,
            'metadata' => [],
        ];
    }
}
