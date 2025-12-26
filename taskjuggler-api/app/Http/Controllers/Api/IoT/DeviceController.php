<?php

namespace App\Http\Controllers\Api\IoT;

use App\Http\Controllers\Controller;
use App\Models\Actor;
use App\Services\IoT\DeviceRegistrationService;
use App\Services\IoT\MqttBrokerService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * IoT Device Controller
 * 
 * Handles device registration, claiming, and management endpoints
 */
class DeviceController extends Controller
{
    public function __construct(
        private DeviceRegistrationService $registrationService,
        private MqttBrokerService $mqttService
    ) {}

    /**
     * Register a new IoT device
     * POST /api/iot/devices/register
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'nullable|uuid',
            'name' => 'required|string|max:255',
            'device_type' => 'nullable|string|max:100',
            'capabilities' => 'nullable|array',
            'firmware_version' => 'nullable|string|max:50',
            'hardware_info' => 'nullable|array',
            'mqtt_endpoint' => 'nullable|string|max:255',
            'metadata' => 'nullable|array',
        ]);

        try {
            $deviceInfo = [
                'device_id' => $request->input('device_id'),
                'name' => $request->input('name'),
                'device_type' => $request->input('device_type'),
                'capabilities' => $request->input('capabilities', []),
                'firmware_version' => $request->input('firmware_version'),
                'hardware_info' => $request->input('hardware_info', []),
                'mqtt_endpoint' => $request->input('mqtt_endpoint'),
                'metadata' => $request->input('metadata', []),
            ];

            $actor = $this->registrationService->registerDevice($deviceInfo, $request->user()?->id);
            $info = $this->registrationService->getDeviceRegistrationInfo($actor);

            return response()->json([
                'message' => 'Device registered successfully',
                'device' => $info,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Device registration failed',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Claim a device with claim code
     * POST /api/iot/devices/claim
     */
    public function claim(Request $request): JsonResponse
    {
        $request->validate([
            'claim_code' => 'required|string|size:8',
        ]);

        try {
            $actor = $this->registrationService->claimDevice(
                $request->input('claim_code'),
                $request->user()
            );

            return response()->json([
                'message' => 'Device claimed successfully',
                'device' => [
                    'actor_id' => $actor->id,
                    'display_name' => $actor->display_name,
                    'status' => $actor->status,
                    'capabilities' => $actor->capabilities,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Device claiming failed',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * List user's devices
     * GET /api/iot/devices
     */
    public function index(Request $request): JsonResponse
    {
        $devices = Actor::where('actor_type', Actor::TYPE_IOT_DEVICE)
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function ($actor) {
                return $this->registrationService->getDeviceRegistrationInfo($actor);
            });

        return response()->json([
            'data' => $devices,
        ]);
    }

    /**
     * Get device details
     * GET /api/iot/devices/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_IOT_DEVICE)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $info = $this->registrationService->getDeviceRegistrationInfo($actor);

        return response()->json([
            'data' => $info,
        ]);
    }

    /**
     * Update device capabilities
     * PUT /api/iot/devices/{id}/capabilities
     */
    public function updateCapabilities(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'capabilities' => 'required|array',
        ]);

        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_IOT_DEVICE)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->registrationService->updateDeviceCapabilities(
            $actor,
            $request->input('capabilities')
        );

        return response()->json([
            'message' => 'Device capabilities updated',
            'device' => $this->registrationService->getDeviceRegistrationInfo($actor),
        ]);
    }

    /**
     * Generate new claim code for device
     * POST /api/iot/devices/{id}/claim-code
     */
    public function generateClaimCode(Request $request, string $id): JsonResponse
    {
        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_IOT_DEVICE)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $claimCode = $this->registrationService->generateClaimCode($actor);

        return response()->json([
            'claim_code' => $claimCode->code,
            'expires_at' => $claimCode->expires_at->toIso8601String(),
        ]);
    }

    /**
     * Deactivate device
     * DELETE /api/iot/devices/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_IOT_DEVICE)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->registrationService->deactivateDevice($actor);

        return response()->json([
            'message' => 'Device deactivated',
        ]);
    }

    /**
     * Send task to device via MQTT
     * POST /api/iot/devices/{id}/send-task
     */
    public function sendTask(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'task_id' => 'required|uuid|exists:tasks,id',
        ]);

        $actor = Actor::where('id', $id)
            ->where('actor_type', Actor::TYPE_IOT_DEVICE)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $task = \App\Models\Task::findOrFail($request->input('task_id'));

        // Create TEF envelope
        $requestorActor = \App\Models\Actor::where('user_id', $request->user()->id)
            ->where('actor_type', \App\Models\Actor::TYPE_HUMAN)
            ->first();

        if (!$requestorActor) {
            return response()->json([
                'error' => 'Requestor actor not found',
            ], 400);
        }

        $envelope = app(\App\Services\TEF\TEFMessageFactory::class)->createTaskCreate(
            $task,
            $requestorActor,
            $actor
        );

        // Publish to device
        $success = $this->mqttService->publishToDevice($actor->id, $envelope);

        if ($success) {
            return response()->json([
                'message' => 'Task sent to device',
                'task_id' => $task->id,
            ]);
        }

        return response()->json([
            'error' => 'Failed to send task to device',
        ], 500);
    }
}
