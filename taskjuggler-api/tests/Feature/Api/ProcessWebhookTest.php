<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Team;
use App\Modules\Processes\Models\Process;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProcessWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected Process $process;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->create();
        $team = Team::factory()->create(['owner_id' => $user->id]);

        $this->process = Process::create([
            'team_id' => $team->id,
            'name' => 'Webhook Process',
            'slug' => 'webhook-process',
            'status' => 'active',
            'trigger_type' => 'webhook',
            'trigger_config' => ['webhook_id' => 'wh_test_123'],
        ]);

        $this->process->steps()->create([
            'name' => 'Log step',
            'order' => 1,
            'step_type' => 'action',
            'config' => ['action' => 'log', 'message' => 'Webhook received'],
        ]);
    }

    public function test_webhook_triggers_process_execution(): void
    {
        $response = $this->postJson('/api/webhooks/processes/wh_test_123', [
            'event' => 'external.thing.happened',
        ]);

        $response->assertStatus(202);
        $this->assertDatabaseHas('process_executions', [
            'process_id' => $this->process->id,
        ]);
    }

    public function test_unknown_webhook_id_returns_404(): void
    {
        $response = $this->postJson('/api/webhooks/processes/wh_does_not_exist', []);

        $response->assertStatus(404);
        $this->assertDatabaseMissing('process_executions', [
            'process_id' => $this->process->id,
        ]);
    }

    public function test_inactive_process_webhook_returns_404(): void
    {
        $this->process->update(['status' => 'draft']);

        $response = $this->postJson('/api/webhooks/processes/wh_test_123', []);

        $response->assertStatus(404);
    }
}
