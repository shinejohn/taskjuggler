<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\DirectMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DirectMessagesApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user1;
    private User $user2;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user1 = User::factory()->create();
        $this->user2 = User::factory()->create();
        $this->actingAs($this->user1, 'sanctum');
    }

    public function test_can_send_direct_message(): void
    {
        $this->logTestStart('Send Direct Message', 'api');

        $this->logApiRequest('POST', "/api/messages/to/{$this->user2->id}", [
            'content' => 'Hello!',
        ]);

        $response = $this->postJson("/api/messages/to/{$this->user2->id}", [
            'content' => 'Hello!',
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
            $messageContent === 'Hello!',
            'Message content matches',
            'Hello!',
            $messageContent
        );

        $this->assertDatabaseHas('direct_messages', [
            'sender_id' => $this->user1->id,
            'recipient_id' => $this->user2->id,
            'content' => 'Hello!',
        ]);

        $this->logTestEnd('passed');
    }

    public function test_can_get_conversations(): void
    {
        $this->logTestStart('Get Conversations', 'api');

        // Create messages
        DirectMessage::factory()->create([
            'sender_id' => $this->user1->id,
            'recipient_id' => $this->user2->id,
        ]);

        $this->logApiRequest('GET', '/api/messages/conversations');

        $response = $this->getJson('/api/messages/conversations');

        $this->logApiResponse($response->status(), $response->json());

        if ($response->status() !== 200) {
            $this->testLogger->logError("Expected status 200, got: " . $response->status(), null);
            $this->testLogger->logDetail('response_body', $response->json());
        }

        $response->assertStatus(200);

        $this->assertWithLog(
            $response->status() === 200,
            'Conversations retrieved',
            '200',
            (string) $response->status()
        );

        $conversations = $response->json('conversations') ?? [];
        $this->assertWithLog(
            count($conversations) > 0,
            'Conversations list is not empty',
            '> 0',
            (string) count($conversations)
        );

        $this->logTestEnd('passed');
    }

    public function test_can_get_unread_count(): void
    {
        $this->logTestStart('Get Unread Count', 'api');

        // Create unread messages
        DirectMessage::factory()->count(3)->create([
            'sender_id' => $this->user2->id,
            'recipient_id' => $this->user1->id,
            'read_at' => null,
        ]);

        $this->logApiRequest('GET', '/api/messages/unread');

        $response = $this->getJson('/api/messages/unread');

        $this->logApiResponse($response->status(), $response->json());

        $this->assertWithLog(
            $response->status() === 200,
            'Unread count retrieved',
            '200',
            (string) $response->status()
        );

        $this->assertWithLog(
            $response->json('unread_count') >= 3,
            'Unread count is correct',
            '>= 3',
            (string) $response->json('unread_count')
        );

        $this->logTestEnd('passed');
    }
}
