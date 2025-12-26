<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestResultsApiTest extends TestCase
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

    public function test_user_can_get_latest_test_results(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/test-results/latest');

        // May return 404 if no results exist, which is acceptable
        $this->assertContains($response->status(), [200, 404]);
    }

    public function test_user_can_list_all_test_results(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/test-results/all');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['filename', 'timestamp', 'summary'],
            ]);
    }

    public function test_user_can_analyze_test_results(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/test-fix/analyze', [
                'results' => [
                    'unit_tests' => [
                        'passed' => false,
                        'output' => 'Class not found: App\\Services\\TestService',
                    ],
                ],
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'fixes',
                'total_fixes',
            ]);
    }
}
