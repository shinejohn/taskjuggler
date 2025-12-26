<?php

namespace App\Services\IoT;

use App\Models\Actor;
use App\Models\ClaimCode;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Device Registration Service
 * 
 * Handles IoT device registration, claiming, and management
 */
class DeviceRegistrationService
{
    /**
     * Register a new IoT device
     */
    public function registerDevice(array $deviceInfo, ?string $userId = null): Actor
    {
        $deviceId = $deviceInfo['device_id'] ?? Str::uuid()->toString();
        
        $actor = Actor::create([
            'actor_type' => Actor::TYPE_IOT_DEVICE,
            'display_name' => $deviceInfo['name'] ?? "IoT Device {$deviceId}",
            'capabilities' => $deviceInfo['capabilities'] ?? [],
            'contact_methods' => $deviceInfo['mqtt_endpoint'] ? [
                ['protocol' => 'mqtt', 'endpoint' => $deviceInfo['mqtt_endpoint']]
            ] : [
                ['protocol' => 'mqtt', 'endpoint' => 'taskjuggler/devices/' . ($deviceInfo['device_id'] ?? Str::uuid()->toString())]
            ],
            'metadata' => array_merge($deviceInfo['metadata'] ?? [], [
                'device_type' => $deviceInfo['device_type'] ?? 'unknown',
                'firmware_version' => $deviceInfo['firmware_version'] ?? null,
                'hardware_info' => $deviceInfo['hardware_info'] ?? [],
            ]),
            'authentication' => [
                'method' => 'claim_code',
                'credentials' => [],
            ],
            'status' => Actor::STATUS_PENDING_CLAIM,
            'user_id' => $userId,
        ]);

        // Generate claim code
        $claimCode = $this->generateClaimCode($actor);

        Log::info('IoT device registered', [
            'device_id' => $deviceId,
            'actor_id' => $actor->id,
            'claim_code' => $claimCode->code,
        ]);

        return $actor;
    }

    /**
     * Claim a device with claim code
     */
    public function claimDevice(string $claimCode, User $user): Actor
    {
        $code = ClaimCode::where('code', $claimCode)
            ->where('expires_at', '>', now())
            ->whereNull('claimed_at')
            ->first();

        if (!$code) {
            throw new \Exception('Invalid or expired claim code');
        }

        $actor = Actor::find($code->actor_id);
        if (!$actor || $actor->actor_type !== Actor::TYPE_IOT_DEVICE) {
            throw new \Exception('Actor not found or not an IoT device');
        }

        // Claim the device
        $actor->update([
            'user_id' => $user->id,
            'status' => Actor::STATUS_ACTIVE,
        ]);

        $code->update([
            'claimed_at' => now(),
            'claimed_by_user_id' => $user->id,
        ]);

        Log::info('IoT device claimed', [
            'device_id' => $actor->id,
            'user_id' => $user->id,
            'claim_code' => $claimCode,
        ]);

        return $actor;
    }

    /**
     * Generate claim code for device
     */
    public function generateClaimCode(Actor $actor): ClaimCode
    {
        // Invalidate any existing unclaimed codes
        ClaimCode::where('actor_id', $actor->id)
            ->whereNull('claimed_at')
            ->update(['expires_at' => now()]);

        return ClaimCode::create([
            'actor_id' => $actor->id,
            'code' => strtoupper(Str::random(8)),
            'expires_at' => now()->addHours(24),
        ]);
    }

    /**
     * Get device registration info (for API responses)
     */
    public function getDeviceRegistrationInfo(Actor $actor): array
    {
        $claimCode = ClaimCode::where('actor_id', $actor->id)
            ->whereNull('claimed_at')
            ->where('expires_at', '>', now())
            ->first();

        return [
            'id' => $actor->id,
            'actor_id' => $actor->id,
            'device_id' => $actor->id,
            'display_name' => $actor->display_name,
            'status' => $actor->status,
            'capabilities' => $actor->capabilities,
            'claim_code' => $claimCode?->code,
            'claim_code_expires_at' => $claimCode?->expires_at?->toIso8601String(),
            'mqtt_topic' => 'taskjuggler/devices/' . $actor->id . '/tasks',
            'mqtt_ack_topic' => 'taskjuggler/devices/' . $actor->id . '/ack',
        ];
    }

    /**
     * Update device capabilities
     */
    public function updateDeviceCapabilities(Actor $actor, array $capabilities): void
    {
        $actor->update(['capabilities' => $capabilities]);
        
        Log::info('Device capabilities updated', [
            'device_id' => $actor->id,
            'capabilities' => $capabilities,
        ]);
    }

    /**
     * Deactivate device
     */
    public function deactivateDevice(Actor $actor): void
    {
        $actor->update(['status' => Actor::STATUS_SUSPENDED]);
        
        Log::info('Device deactivated', ['device_id' => $actor->id]);
    }
}
