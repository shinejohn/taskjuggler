<?php

namespace App\Modules\Communications\Services;

use App\Modules\Communications\Models\CommunicationSms;
use App\Modules\Communications\Services\Contracts\SmsServiceInterface;
use Aws\Sns\SnsClient;
use Aws\Pinpoint\PinpointClient;
use Illuminate\Support\Facades\Log;

class AwsSmsService implements SmsServiceInterface
{
    private ?SnsClient $snsClient;
    private ?PinpointClient $pinpointClient;
    private string $provider; // 'sns' or 'pinpoint'
    private ?string $senderId;

    public function __construct()
    {
        $this->provider = config('services.aws_pinpoint.application_id') ? 'pinpoint' : 'sns';
        
        $credentials = [
            'key' => config('services.aws.key'),
            'secret' => config('services.aws.secret'),
        ];
        $region = config('services.aws.region', 'us-east-1');

        if ($this->provider === 'pinpoint') {
            $this->pinpointClient = new PinpointClient([
                'version' => 'latest',
                'region' => $region,
                'credentials' => $credentials,
            ]);
            $this->senderId = config('services.aws_pinpoint.sender_id');
        } else {
            $this->snsClient = new SnsClient([
                'version' => 'latest',
                'region' => $region,
                'credentials' => $credentials,
            ]);
            $this->senderId = config('services.aws_sns.sender_id');
        }
    }

    /**
     * Send SMS
     */
    public function sendSms(string $to, string $message, ?string $from = null): array
    {
        try {
            $smsRecord = CommunicationSms::create([
                'to_number' => $to,
                'from_number' => $from ?? $this->senderId ?? 'SYSTEM',
                'message' => $message,
                'direction' => 'outbound',
                'status' => 'pending',
            ]);

            if ($this->provider === 'pinpoint') {
                $result = $this->sendViaPinpoint($to, $message, $from);
            } else {
                $result = $this->sendViaSns($to, $message, $from);
            }

            $smsRecord->update([
                'aws_message_id' => $result['message_id'] ?? null,
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            return [
                'message_id' => $smsRecord->id,
                'aws_message_id' => $result['message_id'] ?? null,
                'status' => 'sent',
            ];
        } catch (\Exception $e) {
            Log::error('AWS SMS send failed', [
                'error' => $e->getMessage(),
                'to' => $to,
            ]);

            if (isset($smsRecord)) {
                $smsRecord->markAsFailed($e->getMessage());
            }

            throw $e;
        }
    }

    /**
     * Send bulk SMS
     */
    public function sendBulkSms(array $recipients, string $message, ?string $from = null): array
    {
        $results = [];
        
        foreach ($recipients as $recipient) {
            try {
                $results[] = $this->sendSms($recipient, $message, $from);
            } catch (\Exception $e) {
                $results[] = [
                    'recipient' => $recipient,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Handle inbound SMS
     */
    public function handleInboundSms(array $message): void
    {
        try {
            CommunicationSms::create([
                'from_number' => $message['from'] ?? $message['originationNumber'] ?? 'unknown',
                'to_number' => $message['to'] ?? $message['destinationNumber'] ?? 'unknown',
                'message' => $message['message'] ?? $message['messageBody'] ?? '',
                'direction' => 'inbound',
                'status' => 'received',
                'aws_message_id' => $message['messageId'] ?? null,
                'metadata' => $message,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to handle inbound SMS', [
                'error' => $e->getMessage(),
                'message' => $message,
            ]);
        }
    }

    /**
     * Send SMS via AWS SNS
     */
    private function sendViaSns(string $to, string $message, ?string $from = null): array
    {
        $attributes = [
            'AWS.SNS.SMS.SMSType' => [
                'DataType' => 'String',
                'StringValue' => config('services.aws_sns.sms_type', 'Transactional'),
            ],
        ];

        if ($this->senderId) {
            $attributes['AWS.SNS.SMS.SenderID'] = [
                'DataType' => 'String',
                'StringValue' => $this->senderId,
            ];
        }

        $result = $this->snsClient->publish([
            'PhoneNumber' => $to,
            'Message' => $message,
            'MessageAttributes' => $attributes,
        ]);

        return [
            'message_id' => $result['MessageId'] ?? null,
        ];
    }

    /**
     * Send SMS via AWS Pinpoint
     */
    private function sendViaPinpoint(string $to, string $message, ?string $from = null): array
    {
        $applicationId = config('services.aws_pinpoint.application_id');

        $result = $this->pinpointClient->sendMessages([
            'ApplicationId' => $applicationId,
            'MessageRequest' => [
                'Addresses' => [
                    $to => [
                        'ChannelType' => 'SMS',
                    ],
                ],
                'MessageConfiguration' => [
                    'SMSMessage' => [
                        'Body' => $message,
                        'MessageType' => 'TRANSACTIONAL',
                        'OriginationNumber' => $from ?? $this->senderId,
                    ],
                ],
            ],
        ]);

        $resultMessage = $result['MessageResponse']['Result'][$to] ?? null;

        return [
            'message_id' => $resultMessage['MessageId'] ?? null,
            'delivery_status' => $resultMessage['DeliveryStatus'] ?? null,
        ];
    }
}

