<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Models\TaskMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskMessagesApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->task = Task::factory()->create(['requestor_id' => $this->user->id]);
        $this->actingAs($this->user, 'sanctum');
    }

    public function test_can_send_task_message(): void
    {
        $this->logTestStart('Send Task Message', 'api');

        $this->logApiRequest('POST', "/api/tasks/{$this->task->id}/messages", [
            'content' => 'Test message',
        ]);

        $response = $this->postJson("/api/tasks/{$this->task->id}/messages", [
            'content' => 'Test message',
        ]);

        $this->logApiResponse($response->status(), $response->json());

        if ($response->status() !== 201) {
            $this->testLogger->logError("Expected status 201, got: " . $response->status(), null);
            $this->testLogger->logDetail('response_body', $response->json());
        }

        $response->assertStatus(201);

        $this->assertWithLog(
            $response->status() === 201,
            'Message sent successfully',
            '201',
            (string) $response->status()
        );

        $messageContent = $response->json('message.content') ?? $response->json('content') ?? 'NOT_FOUND';
        $this->assertWithLog(
            $messageContent === 'Test message',
            'Message content matches',
            'Test message',
            $messageContent
        );

        $this->assertDatabaseHas('task_messages', [
            'task_id' => $this->task->id,
            'sender_id' => $this->user->id,
            'content' => 'Test message',
        ]);

        $this->logTestEnd('passed');
    }

    public function test_can_get_task_messages(): void
    {
        $this->logTestStart('Get Task Messages', 'api');

        // Create some messages
        TaskMessage::factory()->count(3)->create([
            'task_id' => $this->task->id,
            'sender_id' => $this->user->id,
        ]);

        $this->logApiRequest('GET', "/api/tasks/{$this->task->id}/messages");

        $response = $this->getJson("/api/tasks/{$this->task->id}/messages");

        $this->logApiResponse($response->status(), $response->json());

        if ($response->status() !== 200) {
            $this->testLogger->logError("Expected status 200, got: " . $response->status(), null);
            $this->testLogger->logDetail('response_body', $response->json());
        }

        $response->assertStatus(200);

        $this->assertWithLog(
            $response->status() === 200,
            'Messages retrieved',
            '200',
            (string) $response->status()
        );

        $messages = $response->json('messages') ?? [];
        $this->assertWithLog(
            count($messages) >= 3,
            'All messages retrieved',
            '>= 3',
            (string) count($messages)
        );

        $this->logTestEnd('passed');
    }

    public function test_can_get_unread_count(): void
    {
        $this->logTestStart('Get Unread Count', 'api');

        // Create unread messages
        TaskMessage::factory()->count(2)->create([
            'task_id' => $this->task->id,
            'sender_id' => User::factory()->create()->id, // Different sender
        ]);

        $this->logApiRequest('GET', "/api/tasks/{$this->task->id}/messages/unread");

        $response = $this->getJson("/api/tasks/{$this->task->id}/messages/unread");

        $this->logApiResponse($response->status(), $response->json());

        if ($response->status() !== 200) {
            $this->testLogger->logError("Expected status 200, got: " . $response->status(), null);
            $this->testLogger->logDetail('response_body', $response->json());
        }

        $response->assertStatus(200);

        $this->assertWithLog(
            $response->status() === 200,
            'Unread count retrieved',
            '200',
            (string) $response->status()
        );

        $unreadCount = $response->json('unread_count') ?? 0;
        $this->assertWithLog(
            $unreadCount >= 2,
            'Unread count is correct',
            '>= 2',
            (string) $unreadCount
        );

        $this->logTestEnd('passed');
    }
}
