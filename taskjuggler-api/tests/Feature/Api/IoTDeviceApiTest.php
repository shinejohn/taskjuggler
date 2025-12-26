<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Actor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IoTDeviceApiTest extends TestCase
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

    public function test_user_can_register_iot_device(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/iot/devices/register', [
                'name' => 'Test Device',
                'device_type' => 'sensor',
                'capabilities' => ['temperature', 'humidity'],
                'mqtt_endpoint' => 'mqtt://broker.example.com',
            ]);

        $response->assertStatus(201);
        $json = $response->json();
        $deviceData = $json['device'] ?? $json;
        $this->assertArrayHasKey('id', $deviceData);
        // Check that device was created
        $this->assertDatabaseHas('actors', [
            'display_name' => 'Test Device',
            'actor_type' => Actor::TYPE_IOT_DEVICE,
        ]);

        $this->assertDatabaseHas('actors', [
            'display_name' => 'Test Device',
            'actor_type' => Actor::TYPE_IOT_DEVICE,
        ]);
    }

    public function test_user_can_list_devices(): void
    {
        Actor::factory()->count(3)->create([
            'actor_type' => Actor::TYPE_IOT_DEVICE,
            'user_id' => $this->user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/iot/devices');

        $response->assertStatus(200);
        $json = $response->json();
        $devices = $json['data'] ?? $json;
        $this->assertGreaterThanOrEqual(3, count($devices));
    }

    public function test_user_can_view_device(): void
    {
        $device = Actor::factory()->create([
            'actor_type' => Actor::TYPE_IOT_DEVICE,
            'user_id' => $this->user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/iot/devices/{$device->id}");

        $response->assertStatus(200);
        $json = $response->json();
        $deviceData = $json['data'] ?? $json;
        $this->assertEquals($device->id, $deviceData['id']);
    }

    public function test_user_can_generate_claim_code(): void
    {
        $device = Actor::factory()->create([
            'actor_type' => Actor::TYPE_IOT_DEVICE,
            'user_id' => $this->user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/iot/devices/{$device->id}/claim-code");

        $response->assertStatus(200);
        $json = $response->json();
        $data = $json['data'] ?? $json;
        $this->assertArrayHasKey('claim_code', $data);
    }

    public function test_user_can_update_device_capabilities(): void
    {
        $device = Actor::factory()->create([
            'actor_type' => Actor::TYPE_IOT_DEVICE,
            'user_id' => $this->user->id,
            'capabilities' => ['temperature'],
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/iot/devices/{$device->id}/capabilities", [
                'capabilities' => ['temperature', 'humidity', 'pressure'],
            ]);

        $response->assertStatus(200);

        $device->refresh();
        $this->assertContains('humidity', $device->capabilities);
    }
}
