<?php

namespace App\Modules\Communications\Services;

use App\Modules\Communications\Models\CommunicationCall;
use App\Modules\Communications\Services\Contracts\CallServiceInterface;
use Aws\Connect\ConnectClient;
use Illuminate\Support\Facades\Log;

class AwsConnectService implements CallServiceInterface
{
    private ConnectClient $client;
    private string $instanceId;
    private ?string $contactFlowId;
    private ?string $queueId;

    public function __construct()
    {
        $this->client = new ConnectClient([
            'version' => 'latest',
            'region' => config('services.aws.region', 'us-east-1'),
            'credentials' => [
                'key' => config('services.aws.key'),
                'secret' => config('services.aws.secret'),
            ],
        ]);

        $this->instanceId = config('services.aws_connect.instance_id');
        $this->contactFlowId = config('services.aws_connect.contact_flow_id');
        $this->queueId = config('services.aws_connect.queue_id');
    }

    /**
     * Initiate an outbound call
     */
    public function initiateCall(string $from, string $to, array $config = []): array
    {
        try {
            $attributes = array_merge([
                'userId' => $config['user_id'] ?? null,
                'source' => $config['source'] ?? 'api',
            ], $config['attributes'] ?? []);

            $result = $this->client->startOutboundVoiceContact([
                'InstanceId' => $this->instanceId,
                'ContactFlowId' => $this->contactFlowId ?? $config['contact_flow_id'],
                'DestinationPhoneNumber' => $to,
                'SourcePhoneNumber' => $from,
                'Attributes' => $attributes,
                'QueueId' => $this->queueId ?? $config['queue_id'] ?? null,
            ]);

            $contactId = $result['ContactId'] ?? null;

            if (!$contactId) {
                throw new \Exception('Failed to initiate call: No contact ID returned');
            }

            // Create call record
            $call = CommunicationCall::create([
                'user_id' => $config['user_id'] ?? null,
                'caller_number' => $from,
                'callee_number' => $to,
                'direction' => 'outbound',
                'status' => 'initiated',
                'aws_connect_contact_id' => $contactId,
                'metadata' => $config,
                'initiated_at' => now(),
            ]);

            return [
                'contact_id' => $contactId,
                'call_id' => $call->id,
                'status' => 'initiated',
            ];
        } catch (\Exception $e) {
            Log::error('AWS Connect call initiation failed', [
                'error' => $e->getMessage(),
                'from' => $from,
                'to' => $to,
            ]);
            throw $e;
        }
    }

    /**
     * Handle an inbound call
     */
    public function handleInboundCall(string $contactId, string $callerNumber): array
    {
        try {
            // Get contact details from AWS Connect
            $result = $this->client->describeContact([
                'InstanceId' => $this->instanceId,
                'ContactId' => $contactId,
            ]);

            $contact = $result['Contact'] ?? [];
            $attributes = $contact['Attributes'] ?? [];

            // Create or update call record
            $call = CommunicationCall::updateOrCreate(
                ['aws_connect_contact_id' => $contactId],
                [
                    'user_id' => $attributes['userId'] ?? null,
                    'caller_number' => $callerNumber,
                    'callee_number' => $contact['Channel'] ?? 'unknown',
                    'direction' => 'inbound',
                    'status' => 'ringing',
                    'metadata' => $attributes,
                    'initiated_at' => isset($contact['InitiationTimestamp']) 
                        ? \Carbon\Carbon::parse($contact['InitiationTimestamp'])
                        : now(),
                ]
            );

            return [
                'contact_id' => $contactId,
                'call_id' => $call->id,
                'status' => $call->status,
            ];
        } catch (\Exception $e) {
            Log::error('AWS Connect inbound call handling failed', [
                'error' => $e->getMessage(),
                'contact_id' => $contactId,
            ]);
            throw $e;
        }
    }

    /**
     * Transfer a call
     */
    public function transferCall(string $contactId, string $destination): bool
    {
        try {
            $this->client->transferContact([
                'InstanceId' => $this->instanceId,
                'ContactId' => $contactId,
                'ContactFlowId' => $this->contactFlowId,
                'QueueId' => $destination, // Can be queue ID or user ID
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('AWS Connect call transfer failed', [
                'error' => $e->getMessage(),
                'contact_id' => $contactId,
            ]);
            return false;
        }
    }

    /**
     * End a call
     */
    public function endCall(string $contactId): bool
    {
        try {
            $this->client->stopContact([
                'InstanceId' => $this->instanceId,
                'ContactId' => $contactId,
            ]);

            // Update call record
            $call = CommunicationCall::where('aws_connect_contact_id', $contactId)->first();
            if ($call) {
                $call->markAsCompleted();
            }

            return true;
        } catch (\Exception $e) {
            Log::error('AWS Connect call end failed', [
                'error' => $e->getMessage(),
                'contact_id' => $contactId,
            ]);
            return false;
        }
    }

    /**
     * Get call status
     */
    public function getCallStatus(string $contactId): ?array
    {
        try {
            $result = $this->client->describeContact([
                'InstanceId' => $this->instanceId,
                'ContactId' => $contactId,
            ]);

            $contact = $result['Contact'] ?? null;
            if (!$contact) {
                return null;
            }

            return [
                'contact_id' => $contactId,
                'state' => $contact['State'] ?? null,
                'initiation_timestamp' => $contact['InitiationTimestamp'] ?? null,
                'disconnect_timestamp' => $contact['DisconnectTimestamp'] ?? null,
                'channel' => $contact['Channel'] ?? null,
                'attributes' => $contact['Attributes'] ?? [],
            ];
        } catch (\Exception $e) {
            Log::error('AWS Connect get call status failed', [
                'error' => $e->getMessage(),
                'contact_id' => $contactId,
            ]);
            return null;
        }
    }
}

