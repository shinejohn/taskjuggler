<?php

declare(strict_types=1);

namespace Tests\Feature\Urpa;

use App\Models\User;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

final class VapiControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.vapi.api_key', 'test-vapi-key');
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    public function test_end_call_scoped_to_authenticated_user(): void
    {
        $otherCall = UrpaPhoneCall::create([
            'user_id' => $this->otherUser->id,
            'direction' => 'outbound',
            'callee_number' => '+15551234567',
            'status' => 'in_progress',
            'handled_by_ai' => true,
            'actions_taken' => ['provider' => 'pipecat', 'room_name' => 'room-other'],
            'started_at' => now(),
        ]);

        $myCall = UrpaPhoneCall::create([
            'user_id' => $this->user->id,
            'direction' => 'outbound',
            'callee_number' => '+15559876543',
            'status' => 'in_progress',
            'handled_by_ai' => true,
            'actions_taken' => ['provider' => 'pipecat', 'room_name' => 'room-mine'],
            'started_at' => now(),
        ]);

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/urpa/voice/vapi/call/{$otherCall->id}/end")
            ->assertNotFound();

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/urpa/voice/vapi/call/{$myCall->id}/end")
            ->assertOk()
            ->assertJsonPath('provider', 'pipecat');

        $this->assertDatabaseHas('urpa_phone_calls', [
            'id' => $myCall->id,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('urpa_phone_calls', [
            'id' => $otherCall->id,
            'status' => 'in_progress',
        ]);
    }
}
