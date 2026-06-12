<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NotificationsApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    protected function headers(): array
    {
        return ['Authorization' => "Bearer {$this->token}"];
    }

    protected function makeNotification(User $user, array $attributes = []): Notification
    {
        return Notification::create(array_merge([
            'user_id' => $user->id,
            'type' => 'task_assigned',
            'title' => 'A notification',
            'body' => 'Something happened',
            'channels' => ['in_app'],
            'created_at' => now(),
        ], $attributes));
    }

    public function test_can_list_notifications_with_unread_count(): void
    {
        $this->makeNotification($this->user);
        $this->makeNotification($this->user, ['read_at' => now()]);

        $response = $this->getJson('/api/notifications', $this->headers());

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'unread_count']);
        $response->assertJsonCount(2, 'data');
        $this->assertSame(1, $response->json('unread_count'));
    }

    public function test_does_not_list_other_users_notifications(): void
    {
        $otherUser = User::factory()->create();
        $this->makeNotification($otherUser);

        $response = $this->getJson('/api/notifications', $this->headers());

        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
    }

    public function test_can_create_notification(): void
    {
        $response = $this->postJson('/api/notifications', [
            'type' => 'system',
            'title' => 'Welcome',
            'message' => 'Hello there',
        ], $this->headers());

        $response->assertStatus(201);
        $this->assertSame('Hello there', $response->json('data.body'));
        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->user->id,
            'title' => 'Welcome',
        ]);
    }

    public function test_create_requires_type_and_title(): void
    {
        $response = $this->postJson('/api/notifications', [
            'message' => 'No type or title',
        ], $this->headers());

        $response->assertStatus(422);
    }

    public function test_can_mark_notification_read(): void
    {
        $notification = $this->makeNotification($this->user);

        $response = $this->postJson("/api/notifications/{$notification->id}/read", [], $this->headers());

        $response->assertStatus(200);
        $this->assertNotNull($response->json('data.read_at'));
        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_cannot_mark_other_users_notification_read(): void
    {
        $otherUser = User::factory()->create();
        $notification = $this->makeNotification($otherUser);

        $response = $this->postJson("/api/notifications/{$notification->id}/read", [], $this->headers());

        $response->assertStatus(404);
        $this->assertNull($notification->fresh()->read_at);
    }

    public function test_can_mark_all_notifications_read(): void
    {
        $this->makeNotification($this->user);
        $this->makeNotification($this->user);
        $otherUser = User::factory()->create();
        $otherNotification = $this->makeNotification($otherUser);

        $response = $this->postJson('/api/notifications/mark-all-read', [], $this->headers());

        $response->assertStatus(200);
        $this->assertSame(
            0,
            Notification::where('user_id', $this->user->id)->whereNull('read_at')->count()
        );
        $this->assertNull($otherNotification->fresh()->read_at);
    }
}
