<?php

namespace App\Services\IoT;

// use PhpMqtt\Client\Facades\MQTT; // Package not available
use Illuminate\Support\Facades\Log;
use App\Models\Actor;
use App\Models\Message;
use App\Models\Task;
use App\TaskExchange\TaskExchangeFormat;
use App\Services\TEF\TEFMessageFactory;
use App\Services\TEF\TEFValidator;

/**
 * MQTT Broker Service for IoT Device Integration
 * 
 * Handles MQTT connections, device communication, and TEF message routing
 */
class MqttBrokerService
{
    private TEFMessageFactory $messageFactory;
    private TEFValidator $validator;

    public function __construct(
        TEFMessageFactory $messageFactory,
        TEFValidator $validator
    ) {
        $this->messageFactory = $messageFactory;
        $this->validator = $validator;
    }

    /**
     * Connect to MQTT broker
     */
    public function connect(string $connectionName = 'default')
    {
        if (!class_exists('PhpMqtt\Client\Facades\MQTT')) {
            throw new \RuntimeException('MQTT package not installed. Please install php-mqtt/laravel-client');
        }
        try {
            $mqtt = \PhpMqtt\Client\Facades\MQTT::connection($connectionName);
            return $mqtt;
        } catch (\Exception $e) {
            Log::error('MQTT connection failed', [
                'connection' => $connectionName,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Subscribe to device registration topic
     * Topic: taskjuggler/devices/register/+
     */
    public function subscribeToDeviceRegistration(): void
    {
        $mqtt = $this->connect();
        
        $mqtt->subscribe('taskjuggler/devices/register/+', function (string $topic, string $message) {
            $this->handleDeviceRegistration($topic, $message);
        }, 1); // QoS 1
        
        Log::info('Subscribed to device registration topic');
    }

    /**
     * Subscribe to device task topics
     * Topic: taskjuggler/devices/{device_id}/tasks/+
     */
    public function subscribeToDeviceTasks(string $deviceId): void
    {
        $mqtt = $this->connect();
        
        $topic = "taskjuggler/devices/{$deviceId}/tasks/+";
        
        $mqtt->subscribe($topic, function (string $topic, string $message) use ($deviceId) {
            $this->handleDeviceTaskMessage($deviceId, $topic, $message);
        }, 1);
        
        Log::info("Subscribed to device task topics", ['device_id' => $deviceId]);
    }

    /**
     * Publish TEF message to device
     */
    public function publishToDevice(string $deviceId, array $tefEnvelope, int $qos = 1): bool
    {
        try {
            $mqtt = $this->connect();
            
            $topic = "taskjuggler/devices/{$deviceId}/tasks";
            $payload = json_encode($tefEnvelope);
            
            $mqtt->publish($topic, $payload, $qos);
            $mqtt->loop(true, true);
            
            Log::info('Published TEF message to device', [
                'device_id' => $deviceId,
                'topic' => $topic,
                'message_type' => $tefEnvelope['message_type'] ?? 'unknown',
            ]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to publish to device', [
                'device_id' => $deviceId,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Handle device registration message
     */
    private function handleDeviceRegistration(string $topic, string $message): void
    {
        try {
            $data = json_decode($message, true);
            
            if (!$data || !isset($data['device_id'])) {
                Log::warning('Invalid device registration message', ['topic' => $topic]);
                return;
            }

            $deviceId = $data['device_id'];
            $deviceInfo = $data['device_info'] ?? [];
            
            Log::info('Device registration received', [
                'device_id' => $deviceId,
                'device_info' => $deviceInfo,
            ]);

            // Create or update actor for device
            $actor = Actor::updateOrCreate(
                [
                    'id' => $deviceId,
                    'actor_type' => Actor::TYPE_IOT_DEVICE,
                ],
                [
                    'display_name' => $deviceInfo['name'] ?? "IoT Device {$deviceId}",
                    'capabilities' => $deviceInfo['capabilities'] ?? [],
                    'contact_methods' => [
                        ['protocol' => 'mqtt', 'endpoint' => $topic],
                    ],
                    'metadata' => $deviceInfo['metadata'] ?? [],
                    'status' => Actor::STATUS_PENDING_CLAIM,
                ]
            );

            // Publish acknowledgment
            $this->publishAcknowledgment($deviceId, [
                'status' => 'registered',
                'actor_id' => $actor->id,
                'claim_code' => $this->generateClaimCode($actor),
            ]);

        } catch (\Exception $e) {
            Log::error('Error handling device registration', [
                'topic' => $topic,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle task message from device
     */
    private function handleDeviceTaskMessage(string $deviceId, string $topic, string $message): void
    {
        try {
            $envelope = json_decode($message, true);
            
            if (!$envelope) {
                Log::warning('Invalid TEF envelope from device', [
                    'device_id' => $deviceId,
                    'topic' => $topic,
                ]);
                return;
            }

            // Validate TEF envelope
            $validation = $this->validator->validateMessage($envelope);
            if (!$validation['valid']) {
                Log::warning('Invalid TEF envelope from device', [
                    'device_id' => $deviceId,
                    'errors' => $validation['errors'],
                ]);
                return;
            }

            // Get device actor
            $deviceActor = Actor::find($deviceId);
            if (!$deviceActor || $deviceActor->actor_type !== Actor::TYPE_IOT_DEVICE) {
                Log::warning('Device actor not found', ['device_id' => $deviceId]);
                return;
            }

            // Handle different message types
            $messageType = $envelope['message_type'] ?? null;
            
            switch ($messageType) {
                case 'TASK_CREATE':
                    $this->handleTaskCreateFromDevice($deviceActor, $envelope);
                    break;
                case 'TASK_COMPLETE':
                    $this->handleTaskCompleteFromDevice($deviceActor, $envelope);
                    break;
                case 'TASK_ACCEPT':
                    $this->handleTaskAcceptFromDevice($deviceActor, $envelope);
                    break;
                case 'TASK_REJECT':
                    $this->handleTaskRejectFromDevice($deviceActor, $envelope);
                    break;
                default:
                    Log::warning('Unknown message type from device', [
                        'device_id' => $deviceId,
                        'message_type' => $messageType,
                    ]);
            }

        } catch (\Exception $e) {
            Log::error('Error handling device task message', [
                'device_id' => $deviceId,
                'topic' => $topic,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle TASK_CREATE from device
     */
    private function handleTaskCreateFromDevice(Actor $deviceActor, array $envelope): void
    {
        $taskData = $envelope['task'] ?? null;
        if (!$taskData) {
            return;
        }

        // Convert TEF 2.0.0 to task data
        $taskFields = TaskExchangeFormat::toTaskData($taskData);
        
        // Set requestor to device owner (if device is claimed)
        if ($deviceActor->user_id) {
            $taskFields['requestor_id'] = $deviceActor->user_id;
        }
        
        $taskFields['source_channel'] = 'iot';
        $taskFields['source_channel_ref'] = $deviceActor->id;

        $task = Task::create($taskFields);

        // Store message
        $this->storeTefMessage($envelope, $task);

        Log::info('Task created from IoT device', [
            'device_id' => $deviceActor->id,
            'task_id' => $task->id,
        ]);
    }

    /**
     * Handle TASK_COMPLETE from device
     */
    private function handleTaskCompleteFromDevice(Actor $deviceActor, array $envelope): void
    {
        $taskId = $envelope['task_id'] ?? null;
        if (!$taskId) {
            return;
        }

        $task = Task::find($taskId);
        if (!$task) {
            Log::warning('Task not found for completion', ['task_id' => $taskId]);
            return;
        }

        $task->update(['status' => 'completed']);
        
        // Store message
        $this->storeTefMessage($envelope, $task);

        Log::info('Task completed by IoT device', [
            'device_id' => $deviceActor->id,
            'task_id' => $taskId,
        ]);
    }

    /**
     * Handle TASK_ACCEPT from device
     */
    private function handleTaskAcceptFromDevice(Actor $deviceActor, array $envelope): void
    {
        $taskId = $envelope['task_id'] ?? null;
        if (!$taskId) {
            return;
        }

        $task = Task::find($taskId);
        if (!$task) {
            return;
        }

        $task->update(['status' => 'accepted', 'owner_id' => $deviceActor->user_id]);
        
        // Store message
        $this->storeTefMessage($envelope, $task);
    }

    /**
     * Handle TASK_REJECT from device
     */
    private function handleTaskRejectFromDevice(Actor $deviceActor, array $envelope): void
    {
        $taskId = $envelope['task_id'] ?? null;
        if (!$taskId) {
            return;
        }

        $task = Task::find($taskId);
        if (!$task) {
            return;
        }

        $task->update(['status' => 'declined']);
        
        // Store message
        $this->storeTefMessage($envelope, $task);
    }

    /**
     * Publish acknowledgment to device
     */
    private function publishAcknowledgment(string $deviceId, array $data): void
    {
        try {
            $mqtt = $this->connect();
            $topic = "taskjuggler/devices/{$deviceId}/ack";
            $payload = json_encode($data);
            
            $mqtt->publish($topic, $payload, 1);
            $mqtt->loop(true, true);
        } catch (\Exception $e) {
            Log::error('Failed to publish acknowledgment', [
                'device_id' => $deviceId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Generate claim code for device
     */
    private function generateClaimCode(Actor $actor): string
    {
        // Use ClaimCode model if available, otherwise generate simple code
        if (class_exists(\App\Models\ClaimCode::class)) {
            $claimCode = \App\Models\ClaimCode::create([
                'actor_id' => $actor->id,
                'code' => \Illuminate\Support\Str::random(8),
                'expires_at' => now()->addHours(24),
            ]);
            return $claimCode->code;
        }
        
        return \Illuminate\Support\Str::random(8);
    }

    /**
     * Store TEF message in database
     */
    private function storeTefMessage(array $envelope, Task $task): void
    {
        try {
            $conversation = \App\Models\Conversation::firstOrCreate(
                ['task_id' => $task->id],
                [
                    'participants' => [
                        $envelope['source_actor']['actor_id'] ?? null,
                        $envelope['target_actor']['actor_id'] ?? null,
                    ],
                    'message_count' => 0,
                ]
            );

            \App\Models\Message::create([
                'conversation_id' => $conversation->id,
                'task_id' => $task->id,
                'message_type' => $envelope['message_type'],
                'source_actor_id' => $envelope['source_actor']['actor_id'] ?? null,
                'target_actor_id' => $envelope['target_actor']['actor_id'] ?? null,
                'reply_to_id' => $envelope['reply_to_message_id'] ?? null,
                'payload' => $envelope,
                'delivered_at' => now(),
            ]);

            $conversation->incrementMessageCount();
        } catch (\Exception $e) {
            Log::error('Failed to store TEF message', [
                'error' => $e->getMessage(),
                'task_id' => $task->id,
            ]);
        }
    }

    /**
     * Start MQTT event loop (for long-running processes)
     */
    public function startEventLoop(): void
    {
        $mqtt = $this->connect();
        
        // Subscribe to all device topics
        $this->subscribeToDeviceRegistration();
        
        // Keep listening
        $mqtt->loop(true);
    }
}
