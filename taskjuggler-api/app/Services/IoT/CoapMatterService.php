<?php

namespace App\Services\IoT;

use App\Models\Actor;
use App\Models\Task;
use App\Services\TEF\TEFMessageFactory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

/**
 * CoAP/Matter Protocol Service
 * 
 * Handles CoAP (Constrained Application Protocol) and Matter protocol
 * for IoT device communication
 */
class CoapMatterService
{
    private TEFMessageFactory $messageFactory;

    public function __construct(TEFMessageFactory $messageFactory)
    {
        $this->messageFactory = $messageFactory;
    }

    /**
     * Send task to device via CoAP
     */
    public function sendTaskViaCoap(Actor $device, Task $task): bool
    {
        try {
            $coapEndpoint = $this->getCoapEndpoint($device);
            if (!$coapEndpoint) {
                Log::warning('Device does not have CoAP endpoint', ['device_id' => $device->id]);
                return false;
            }

            // Create TEF envelope
            $requestorActor = Actor::where('user_id', $task->requestor_id)
                ->where('actor_type', Actor::TYPE_HUMAN)
                ->first();

            if (!$requestorActor) {
                return false;
            }

            $envelope = $this->messageFactory->createTaskCreate(
                $task,
                $requestorActor,
                $device
            );

            // CoAP uses binary format, but we'll send JSON over HTTP-CoAP bridge
            // In production, use a CoAP client library
            $response = Http::timeout(5)->post($coapEndpoint . '/task', [
                'tef_envelope' => $envelope,
            ]);

            if ($response->successful()) {
                Log::info('Task sent via CoAP', [
                    'device_id' => $device->id,
                    'task_id' => $task->id,
                ]);
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('CoAP send failed', [
                'device_id' => $device->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send task to device via Matter
     */
    public function sendTaskViaMatter(Actor $device, Task $task): bool
    {
        try {
            $matterEndpoint = $this->getMatterEndpoint($device);
            if (!$matterEndpoint) {
                Log::warning('Device does not have Matter endpoint', ['device_id' => $device->id]);
                return false;
            }

            // Matter uses JSON-RPC over WebSocket or HTTP
            $requestorActor = Actor::where('user_id', $task->requestor_id)
                ->where('actor_type', Actor::TYPE_HUMAN)
                ->first();

            if (!$requestorActor) {
                return false;
            }

            $envelope = $this->messageFactory->createTaskCreate(
                $task,
                $requestorActor,
                $device
            );

            // Matter JSON-RPC format
            $matterRequest = [
                'jsonrpc' => '2.0',
                'method' => 'task.create',
                'params' => [
                    'tef_envelope' => $envelope,
                ],
                'id' => uniqid(),
            ];

            $response = Http::timeout(5)->post($matterEndpoint . '/rpc', $matterRequest);

            if ($response->successful()) {
                Log::info('Task sent via Matter', [
                    'device_id' => $device->id,
                    'task_id' => $task->id,
                ]);
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Matter send failed', [
                'device_id' => $device->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get CoAP endpoint from device
     */
    private function getCoapEndpoint(Actor $device): ?string
    {
        $contactMethods = $device->contact_methods ?? [];
        
        foreach ($contactMethods as $method) {
            if (($method['protocol'] ?? null) === 'coap') {
                return $method['endpoint'] ?? null;
            }
        }

        return null;
    }

    /**
     * Get Matter endpoint from device
     */
    private function getMatterEndpoint(Actor $device): ?string
    {
        $contactMethods = $device->contact_methods ?? [];
        
        foreach ($contactMethods as $method) {
            if (($method['protocol'] ?? null) === 'matter') {
                return $method['endpoint'] ?? null;
            }
        }

        return null;
    }

    /**
     * Register device with CoAP support
     */
    public function registerCoapDevice(array $deviceInfo): Actor
    {
        $deviceInfo['contact_methods'][] = [
            'protocol' => 'coap',
            'endpoint' => $deviceInfo['coap_endpoint'] ?? null,
        ];

        return app(\App\Services\IoT\DeviceRegistrationService::class)
            ->registerDevice($deviceInfo);
    }

    /**
     * Register device with Matter support
     */
    public function registerMatterDevice(array $deviceInfo): Actor
    {
        $deviceInfo['contact_methods'][] = [
            'protocol' => 'matter',
            'endpoint' => $deviceInfo['matter_endpoint'] ?? null,
        ];

        return app(\App\Services\IoT\DeviceRegistrationService::class)
            ->registerDevice($deviceInfo);
    }
}
