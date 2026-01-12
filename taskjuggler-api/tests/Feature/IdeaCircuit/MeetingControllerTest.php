<?php

namespace Tests\Feature\IdeaCircuit;

use App\Models\User;
use App\Models\IdeaCircuit\Meeting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MeetingControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function it_can_list_user_meetings()
    {
        Meeting::factory()->count(3)->create(['user_id' => $this->user->id]);
        Meeting::factory()->count(2)->create(); // Other user's meetings

        $response = $this->actingAs($this->user)
            ->getJson('/api/ideacircuit/meetings');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => []]);
        
        $this->assertCount(3, $response->json('data'));
    }

    /** @test */
    public function it_can_create_a_meeting()
    {
        $meetingData = [
            'title' => 'Test Meeting',
            'description' => 'Test Description',
            'meeting_type' => 'general',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/ideacircuit/meetings', $meetingData);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'title', 'description']]);

        $this->assertDatabaseHas('ideacircuit_meetings', [
            'title' => 'Test Meeting',
            'user_id' => $this->user->id,
        ]);
    }

    /** @test */
    public function it_can_show_a_meeting()
    {
        $meeting = Meeting::factory()->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/ideacircuit/meetings/{$meeting->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'title']]);
    }

    /** @test */
    public function it_can_update_a_meeting()
    {
        $meeting = Meeting::factory()->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/ideacircuit/meetings/{$meeting->id}", [
                'title' => 'Updated Title',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('ideacircuit_meetings', [
            'id' => $meeting->id,
            'title' => 'Updated Title',
        ]);
    }

    /** @test */
    public function it_can_delete_a_meeting()
    {
        $meeting = Meeting::factory()->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/ideacircuit/meetings/{$meeting->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('ideacircuit_meetings', [
            'id' => $meeting->id,
        ]);
    }

    /** @test */
    public function it_prevents_unauthorized_access()
    {
        $otherUser = User::factory()->create();
        $meeting = Meeting::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/ideacircuit/meetings/{$meeting->id}");

        $response->assertStatus(403);
    }
}
