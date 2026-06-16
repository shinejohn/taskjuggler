<?php

declare(strict_types=1);

namespace Tests\Feature\Urpa;

use App\Models\User;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use App\Modules\Urpa\Services\AiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

final class PipecatWebhookControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('pipecat.webhook_secret', 'test-pipecat-secret');
        Config::set('services.openrouter.api_key', 'test-openrouter-key');
        $this->user = User::factory()->create();
    }

    public function test_webhook_rejects_missing_secret(): void
    {
        $this->postJson('/api/urpa/voice/pipecat/webhook', [
            'session_id' => 'session-1',
            'event' => 'session.connected',
            'payload' => [],
        ])->assertUnauthorized();
    }

    public function test_session_connected_updates_call_status(): void
    {
        $call = UrpaPhoneCall::create([
            'user_id' => $this->user->id,
            'direction' => 'inbound',
            'caller_number' => '+15551234567',
            'callee_number' => '+15559876543',
            'status' => 'in_progress',
            'handled_by_ai' => true,
            'actions_taken' => [
                'provider' => 'pipecat',
                'session' => ['session_id' => 'session-abc'],
            ],
            'started_at' => now(),
        ]);

        $this->postJson('/api/urpa/voice/pipecat/webhook', [
            'session_id' => 'session-abc',
            'event' => 'session.connected',
            'payload' => ['room_name' => 'room-1'],
        ], [
            'X-Pipecat-Secret' => 'test-pipecat-secret',
        ])->assertOk()
            ->assertJsonPath('processed', true);

        $call->refresh();
        $this->assertSame('in_progress', $call->status);
        $this->assertNotEmpty($call->actions_taken['pipecat_events'] ?? []);
    }

    public function test_session_ended_stores_transcript_and_summary(): void
    {
        $this->mock(AiService::class, function ($mock): void {
            $mock->shouldReceive('generateCallSummary')
                ->once()
                ->andReturn('Caller asked about scheduling.');
            $mock->shouldReceive('extractTasksFromTranscript')
                ->once()
                ->andReturn([]);
        });

        $call = UrpaPhoneCall::create([
            'user_id' => $this->user->id,
            'direction' => 'inbound',
            'caller_number' => '+15551234567',
            'callee_number' => '+15559876543',
            'status' => 'in_progress',
            'handled_by_ai' => true,
            'actions_taken' => [
                'provider' => 'pipecat',
                'session' => ['session_id' => 'session-end'],
            ],
            'started_at' => now(),
        ]);

        $transcript = "[user]: Hello\n[assistant]: Hi, how can I help?";

        $this->postJson('/api/urpa/voice/pipecat/webhook', [
            'session_id' => 'session-end',
            'event' => 'session.ended',
            'payload' => ['transcript' => $transcript],
        ], [
            'X-Pipecat-Secret' => 'test-pipecat-secret',
        ])->assertOk();

        $call->refresh();
        $this->assertSame('completed', $call->status);
        $this->assertSame($transcript, $call->transcript);
        $this->assertSame('Caller asked about scheduling.', $call->ai_summary);
        $this->assertNotNull($call->ended_at);
    }

    public function test_transcript_turn_appends_to_actions(): void
    {
        $call = UrpaPhoneCall::create([
            'user_id' => $this->user->id,
            'direction' => 'inbound',
            'caller_number' => '+15551234567',
            'callee_number' => '+15559876543',
            'status' => 'in_progress',
            'handled_by_ai' => true,
            'actions_taken' => [
                'provider' => 'pipecat',
                'session' => ['session_id' => 'session-turn'],
            ],
            'started_at' => now(),
        ]);

        $this->postJson('/api/urpa/voice/pipecat/webhook', [
            'session_id' => 'session-turn',
            'event' => 'transcript.turn',
            'payload' => ['role' => 'user', 'text' => 'Need a callback tomorrow'],
        ], [
            'X-Pipecat-Secret' => 'test-pipecat-secret',
        ])->assertOk();

        $call->refresh();
        $turns = $call->actions_taken['turns'] ?? [];
        $this->assertCount(1, $turns);
        $this->assertSame('user', $turns[0]['role']);
        $this->assertSame('Need a callback tomorrow', $turns[0]['text']);
    }
}
