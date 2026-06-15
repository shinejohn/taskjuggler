<?php

declare(strict_types=1);

namespace Tests\Feature\IdeaCircuit;

use App\Models\IdeaCircuit\Meeting;
use App\Models\User;
use App\Services\IdeaCircuit\LiveKitService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

final class LiveKitServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_disabled_by_default(): void
    {
        $this->assertFalse(app(LiveKitService::class)->isEnabled());
    }

    public function test_generates_valid_jwt_token(): void
    {
        Config::set('livekit.enabled', true);
        Config::set('livekit.url', 'wss://livekit.test');
        Config::set('livekit.api_key', 'APIKEY');
        Config::set('livekit.api_secret', 'secret');

        $user = User::factory()->create(['name' => 'Alice']);
        $meeting = Meeting::factory()->create(['user_id' => $user->id]);

        $service = app(LiveKitService::class);
        $creds = $service->joinCredentials($meeting, $user);

        $this->assertSame('wss://livekit.test', $creds['url']);
        $this->assertSame((string) $user->id, $creds['identity']);
        $this->assertNotEmpty($creds['token']);
        $this->assertCount(3, explode('.', $creds['token']));
        $this->assertStringStartsWith('ideacircuit-', $creds['room_name']);
        $this->assertSame($creds['room_name'], $meeting->fresh()->livekit_room_name);
    }

    public function test_livekit_join_endpoint_requires_auth(): void
    {
        $meeting = Meeting::factory()->create();
        $this->postJson("/api/ideacircuit/meetings/{$meeting->id}/livekit/join")
            ->assertUnauthorized();
    }

    public function test_livekit_join_returns_503_when_disabled(): void
    {
        $user = User::factory()->create();
        $meeting = Meeting::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/ideacircuit/meetings/{$meeting->id}/livekit/join")
            ->assertStatus(503);
    }
}
