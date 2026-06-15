<?php

declare(strict_types=1);

namespace Tests\Feature\Communications;

use App\Events\TaskCreated;
use App\Jobs\CreateMatrixRoomForTask;
use App\Jobs\RegisterMatrixUser;
use App\Listeners\ProvisionMatrixOnTaskCreated;
use App\Models\Conversation;
use App\Models\Task;
use App\Models\User;
use App\Modules\Communications\Models\MatrixAccount;
use App\Modules\Communications\Services\MatrixService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

final class MatrixServiceTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    }

    public function test_matrix_disabled_by_default(): void
    {
        $service = app(MatrixService::class);
        $this->assertFalse($service->isEnabled());
        $this->assertSame(['enabled' => false], $service->clientSession($this->user));
    }

    public function test_matrix_status_endpoint(): void
    {
        $response = $this->getJson('/api/matrix/status');
        $response->assertOk();
        $response->assertJsonPath('data.enabled', false);
    }

    public function test_registers_user_on_homeserver_when_enabled(): void
    {
        Config::set('matrix.enabled', true);
        Config::set('matrix.homeserver_url', 'https://matrix.test');
        Config::set('matrix.server_name', 'fibonacco.ai');

        Http::fake([
            'https://matrix.test/_matrix/client/v3/register' => Http::response([
                'user_id' => '@tj-test:fibonacco.ai',
                'access_token' => 'syt_test_token',
            ], 200),
        ]);

        $account = app(MatrixService::class)->ensureUserRegistered($this->user);

        $this->assertNotNull($account);
        $this->assertSame('syt_test_token', $account->access_token);
        $this->assertDatabaseHas('matrix_accounts', [
            'user_id' => $this->user->id,
        ]);
    }

    public function test_creates_matrix_room_for_task(): void
    {
        Config::set('matrix.enabled', true);
        Config::set('matrix.homeserver_url', 'https://matrix.test');
        Config::set('matrix.server_name', 'fibonacco.ai');

        MatrixAccount::create([
            'user_id' => $this->user->id,
            'matrix_user_id' => '@tj-test:fibonacco.ai',
            'access_token' => 'syt_test_token',
            'provisioned_at' => now(),
        ]);

        Http::fake([
            'https://matrix.test/_matrix/client/v3/createRoom' => Http::response([
                'room_id' => '!room123:matrix.test',
            ], 200),
        ]);

        $task = Task::factory()->create(['requestor_id' => $this->user->id]);
        $roomId = app(MatrixService::class)->ensureTaskRoom($task);

        $this->assertSame('!room123:matrix.test', $roomId);
        $this->assertDatabaseHas('conversations', [
            'task_id' => $task->id,
            'matrix_room_id' => '!room123:matrix.test',
        ]);
    }

    public function test_task_created_listener_dispatches_matrix_jobs_when_enabled(): void
    {
        Config::set('matrix.enabled', true);
        Config::set('matrix.homeserver_url', 'https://matrix.test');

        Queue::fake();

        $task = Task::factory()->create(['requestor_id' => $this->user->id]);
        app(ProvisionMatrixOnTaskCreated::class)->handle(new TaskCreated($task));

        Queue::assertPushed(RegisterMatrixUser::class);
        Queue::assertPushed(CreateMatrixRoomForTask::class);
    }

    public function test_inbound_webhook_creates_task_message(): void
    {
        $task = Task::factory()->create(['requestor_id' => $this->user->id]);
        Conversation::create([
            'task_id' => $task->id,
            'participants' => [$this->user->id],
            'matrix_room_id' => '!room123:matrix.test',
        ]);

        MatrixAccount::create([
            'user_id' => $this->user->id,
            'matrix_user_id' => '@tj-test:fibonacco.ai',
            'access_token' => 'token',
            'provisioned_at' => now(),
        ]);

        Config::set('matrix.webhook_secret', 'test-secret');

        $response = $this->postJson('/api/matrix/webhook', [
            'events' => [[
                'type' => 'm.room.message',
                'event_id' => '$evt123',
                'room_id' => '!room123:matrix.test',
                'sender' => '@tj-test:fibonacco.ai',
                'content' => ['body' => 'Hello from Matrix'],
            ]],
        ], ['X-Matrix-Webhook-Secret' => 'test-secret']);

        $response->assertOk();
        $this->assertDatabaseHas('task_messages', [
            'task_id' => $task->id,
            'content' => 'Hello from Matrix',
            'source_channel' => 'matrix',
            'source_channel_ref' => '$evt123',
        ]);
    }
}
