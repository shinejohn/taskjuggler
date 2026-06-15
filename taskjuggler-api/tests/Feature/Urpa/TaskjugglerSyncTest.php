<?php

declare(strict_types=1);

namespace Tests\Feature\Urpa;

use App\Events\TaskCreated;
use App\Models\Task;
use App\Models\User;
use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaAiTask;
use App\Modules\Urpa\Models\UrpaTaskjugglerLink;
use App\Modules\Urpa\Services\TaskJugglerSyncService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class TaskjugglerSyncTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum');
    }

    private function link(array $overrides = []): UrpaTaskjugglerLink
    {
        return UrpaTaskjugglerLink::create(array_merge([
            'urpa_user_id' => $this->user->id,
            'taskjuggler_user_id' => $this->user->id,
            'sync_tasks' => true,
            'sync_projects' => true,
            'auto_create_tasks' => true,
            'urpa_originated' => true,
        ], $overrides));
    }

    public function test_link_endpoint_persists_and_updates_link(): void
    {
        // First call creates the link (exercises the updated_at column fix on INSERT).
        $first = $this->postJson('/api/urpa/integrations/taskjuggler/link', [
            'sync_tasks' => true,
        ]);
        $first->assertStatus(201);

        // Second call updates the same link (exercises the column fix on UPDATE).
        $second = $this->postJson('/api/urpa/integrations/taskjuggler/link', [
            'sync_tasks' => false,
        ]);
        $second->assertStatus(201);

        $this->assertSame(1, UrpaTaskjugglerLink::where('urpa_user_id', $this->user->id)->count());
        $this->assertFalse(
            UrpaTaskjugglerLink::where('urpa_user_id', $this->user->id)->first()->sync_tasks
        );
    }

    public function test_sync_ai_tasks_creates_real_taskjuggler_task(): void
    {
        Event::fake([TaskCreated::class]);

        $link = $this->link();

        $aiTask = UrpaAiTask::create([
            'user_id' => $this->user->id,
            'title' => 'Call the plumber',
            'description' => 'Leaking sink',
            'status' => 'pending',
            'synced_to_taskjuggler' => false,
        ]);

        $result = app(TaskJugglerSyncService::class)->syncAITasks((string) $this->user->id);

        $this->assertSame(1, $result['synced']);
        $this->assertSame(0, $result['skipped']);

        $task = Task::where('source_channel_ref', $aiTask->id)->first();
        $this->assertNotNull($task);
        $this->assertSame((string) $this->user->id, $task->requestor_id);
        $this->assertSame('urpa', $task->source_type);
        $this->assertSame('urpa_ai', $task->source_channel);
        $this->assertSame(Task::STATUS_PENDING, $task->status);

        $aiTask->refresh();
        $this->assertTrue($aiTask->synced_to_taskjuggler);
        $this->assertSame($task->id, $aiTask->taskjuggler_task_id);

        $link->refresh();
        $this->assertNotNull($link->last_synced_at);

        Event::assertDispatched(TaskCreated::class, fn (TaskCreated $e) => $e->task->id === $task->id);
    }

    public function test_sync_from_taskjuggler_creates_and_dedupes_activities(): void
    {
        $this->link();

        // A genuine TaskJuggler-side task owned by the user.
        $task = Task::factory()->create([
            'requestor_id' => $this->user->id,
            'source_type' => null,
            'status' => Task::STATUS_PENDING,
        ]);

        // A URPA-originated task must NOT be mirrored back into URPA.
        Task::factory()->create([
            'requestor_id' => $this->user->id,
            'source_type' => 'urpa',
        ]);

        $service = app(TaskJugglerSyncService::class);

        $first = $service->syncFromTaskJuggler((string) $this->user->id);
        $this->assertSame(1, $first['synced']);

        // Running again must update the same activity, not create a duplicate.
        $service->syncFromTaskJuggler((string) $this->user->id);

        $activities = UrpaActivity::where('user_id', $this->user->id)
            ->where('source', 'taskjuggler')
            ->get();

        $this->assertCount(1, $activities);
        $this->assertSame((string) $task->id, $activities->first()->external_id);
        $this->assertSame('task', $activities->first()->activity_type);
    }

    public function test_create_task_endpoint_creates_task_and_ai_task(): void
    {
        Event::fake([TaskCreated::class]);

        $this->link();

        $response = $this->postJson('/api/urpa/integrations/taskjuggler/tasks', [
            'title' => 'Schedule dentist',
            'description' => 'Annual checkup',
            'priority' => 'high',
        ]);

        $response->assertStatus(201);

        $aiTask = UrpaAiTask::where('user_id', $this->user->id)->first();
        $this->assertNotNull($aiTask);
        $this->assertTrue($aiTask->synced_to_taskjuggler);

        $task = Task::find($aiTask->taskjuggler_task_id);
        $this->assertNotNull($task);
        $this->assertSame('Schedule dentist', $task->title);
        $this->assertSame(Task::PRIORITY_HIGH, $task->priority);
        $this->assertSame($aiTask->id, $task->source_channel_ref);

        Event::assertDispatched(TaskCreated::class);
    }

    public function test_create_task_endpoint_requires_link(): void
    {
        $response = $this->postJson('/api/urpa/integrations/taskjuggler/tasks', [
            'title' => 'No link yet',
        ]);

        $response->assertStatus(400);
    }

    public function test_task_update_syncs_to_urpa_activity(): void
    {
        $link = $this->link();

        $task = Task::factory()->create([
            'requestor_id' => $this->user->id,
            'source_type' => null,
            'status' => Task::STATUS_PENDING,
            'title' => 'Original title',
        ]);

        app(TaskJugglerSyncService::class)->syncTaskUpdateToUrpa($task);

        $activity = UrpaActivity::where('user_id', $this->user->id)
            ->where('external_id', $task->id)
            ->first();

        $this->assertNotNull($activity);
        $this->assertSame('Original title', $activity->title);

        $task->update(['title' => 'Updated title', 'status' => Task::STATUS_COMPLETED]);
        app(TaskJugglerSyncService::class)->syncTaskUpdateToUrpa($task->fresh());

        $activity->refresh();
        $this->assertSame('Updated title', $activity->title);
        $this->assertSame('completed', $activity->status);
    }

    public function test_auth_user_includes_enabled_modules(): void
    {
        $this->user->update(['plan' => 'pro']);

        $response = $this->getJson('/api/auth/user');

        $response->assertOk();
        $modules = $response->json('data.enabled_modules');
        $this->assertContains('tasks', $modules);
        $this->assertContains('processes', $modules);
        $this->assertContains('sitehealth', $modules);
    }
}
