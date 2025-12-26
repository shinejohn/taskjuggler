<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TasksApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    public function test_user_can_list_tasks(): void
    {
        Task::factory()->count(3)->create(['requestor_id' => $this->user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/tasks');

        $response->assertStatus(200);
        $json = $response->json();
        // Response might be wrapped in 'data' key or be direct array
        $tasks = $json['data'] ?? $json;
        $this->assertGreaterThanOrEqual(1, count($tasks));
    }

    public function test_user_can_create_task(): void
    {
        $taskData = [
            'title' => 'Test Task',
            'description' => 'Test Description',
            'priority' => 'high',
            'due_date' => now()->addDays(7)->toIso8601String(),
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/tasks', $taskData);

        $response->assertStatus(201);
        $json = $response->json();
        // Response might be wrapped or direct
        $task = $json['data'] ?? $json;
        $this->assertArrayHasKey('id', $task);
        $this->assertEquals('Test Task', $task['title']);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'requestor_id' => $this->user->id,
        ]);
    }

    public function test_user_can_view_task(): void
    {
        $task = Task::factory()->create(['requestor_id' => $this->user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
        $json = $response->json();
        $taskData = $json['data'] ?? $json;
        $this->assertEquals($task->id, $taskData['id']);
        $this->assertEquals($task->title, $taskData['title']);
    }

    public function test_user_can_update_task(): void
    {
        $task = Task::factory()->create(['requestor_id' => $this->user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/tasks/{$task->id}", [
                'title' => 'Updated Title',
                'description' => 'Updated Description',
            ]);

        $response->assertStatus(200);
        $json = $response->json();
        $taskData = $json['data'] ?? $json;
        $this->assertEquals('Updated Title', $taskData['title']);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_user_can_delete_task(): void
    {
        $task = Task::factory()->create(['requestor_id' => $this->user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_user_can_complete_task(): void
    {
        $task = Task::factory()->create([
            'requestor_id' => $this->user->id,
            'status' => 'in_progress',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/tasks/{$task->id}/complete");

        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
    }

    public function test_user_can_assign_task(): void
    {
        $task = Task::factory()->create([
            'requestor_id' => $this->user->id,
            'status' => Task::STATUS_PENDING,
        ]);
        $assignee = User::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/tasks/{$task->id}/assign", [
                'assignee_type' => 'user',
                'assignee_id' => $assignee->id,
            ]);

        $response->assertStatus(200);

        $task->refresh();
        $this->assertEquals($assignee->id, $task->owner_id);
    }

    public function test_user_can_export_task_as_tef(): void
    {
        $task = Task::factory()->create(['requestor_id' => $this->user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/tasks/{$task->id}/tef?version=2.0.0");

        $response->assertStatus(200);
        $json = $response->json();
        // TEF export returns task data directly, not wrapped
        $tefData = $json['data'] ?? $json;
        $this->assertArrayHasKey('tef_version', $tefData);
        $this->assertArrayHasKey('task_id', $tefData);
        $this->assertArrayHasKey('title', $tefData);
        $this->assertEquals($task->id, $tefData['task_id']);
    }

    public function test_user_cannot_access_other_users_tasks(): void
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['requestor_id' => $otherUser->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(403);
    }
}
