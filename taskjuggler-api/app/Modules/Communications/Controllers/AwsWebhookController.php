<?php

namespace App\Modules\Communications\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communications\Models\CommunicationCall;
use App\Modules\Communications\Models\CommunicationSms;
use App\Modules\Communications\Models\CommunicationRecording;
use App\Modules\Communications\Services\AwsS3Service;
use App\Modules\Communications\Services\AwsTranscribeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AwsWebhookController extends Controller
{
    public function __construct(
        private AwsS3Service $s3Service,
        private AwsTranscribeService $transcribeService
    ) {}

    /**
     * Handle AWS Connect webhooks
     * POST /api/communications/webhooks/aws-connect
     */
    public function handleConnect(Request $request): JsonResponse
    {
        try {
            $event = $request->all();
            $eventType = $event['Type'] ?? $event['type'] ?? null;
            $contactId = $event['ContactId'] ?? $event['contactId'] ?? null;

            if (!$contactId) {
                Log::warning('AWS Connect webhook missing contact ID', ['event' => $event]);
                return response()->json(['error' => 'Missing contact ID'], 400);
            }

            Log::info("AWS Connect webhook: {$eventType}", ['contact_id' => $contactId, 'event' => $event]);

            switch ($eventType) {
                case 'CONTACT_INITIATED':
                case 'contact-initiated':
                    $this->handleContactInitiated($event);
                    break;

                case 'CONTACT_CONNECTED':
                case 'contact-connected':
                    $this->handleContactConnected($event);
                    break;

                case 'CONTACT_ENDED':
                case 'contact-ended':
                    $this->handleContactEnded($event);
                    break;

                case 'RECORDING_AVAILABLE':
                case 'recording-available':
                    $this->handleRecordingAvailable($event);
                    break;

                default:
                    Log::info("Unhandled AWS Connect event type: {$eventType}");
            }

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('AWS Connect webhook handling failed', [
                'error' => $e->getMessage(),
                'event' => $request->all(),
            ]);

            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Handle AWS SMS webhooks (SNS/Pinpoint)
     * POST /api/communications/webhooks/aws-sms
     */
    public function handleSms(Request $request): JsonResponse
    {
        try {
            $data = $request->all();

            // Handle SNS subscription confirmation
            if ($request->has('Type') && $request->input('Type') === 'SubscriptionConfirmation') {
                $subscribeUrl = $request->input('SubscribeURL');
                if ($subscribeUrl) {
                    // Confirm subscription
                    file_get_contents($subscribeUrl);
                    return response()->json(['status' => 'subscribed']);
                }
            }

            // Handle SNS notification
            if ($request->has('Type') && $request->input('Type') === 'Notification') {
                $message = json_decode($request->input('Message'), true);
                $this->processSmsMessage($message);
            } else {
                // Direct message (Pinpoint or other format)
                $this->processSmsMessage($data);
            }

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('AWS SMS webhook handling failed', [
                'error' => $e->getMessage(),
                'data' => $request->all(),
            ]);

            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Handle contact initiated event
     */
    private function handleContactInitiated(array $event): void
    {
        $contactId = $event['ContactId'] ?? $event['contactId'] ?? null;
        $attributes = $event['Attributes'] ?? $event['attributes'] ?? [];
        $callerNumber = $event['CustomerEndpoint']['Address'] ?? $event['callerNumber'] ?? null;

        if (!$contactId || !$callerNumber) {
            return;
        }

        // Create or update call record
        CommunicationCall::updateOrCreate(
            ['aws_connect_contact_id' => $contactId],
            [
                'user_id' => $attributes['userId'] ?? null,
                'caller_number' => $callerNumber,
                'callee_number' => $event['SystemEndpoint']['Address'] ?? 'unknown',
                'direction' => 'inbound',
                'status' => 'ringing',
                'metadata' => $attributes,
                'initiated_at' => now(),
            ]
        );
    }

    /**
     * Handle contact connected event
     */
    private function handleContactConnected(array $event): void
    {
        $contactId = $event['ContactId'] ?? $event['contactId'] ?? null;

        if (!$contactId) {
            return;
        }

        $call = CommunicationCall::where('aws_connect_contact_id', $contactId)->first();
        if ($call) {
            $call->markAsConnected();
        }
    }

    /**
     * Handle contact ended event
     */
    private function handleContactEnded(array $event): void
    {
        $contactId = $event['ContactId'] ?? $event['contactId'] ?? null;

        if (!$contactId) {
            return;
        }

        $call = CommunicationCall::where('aws_connect_contact_id', $contactId)->first();
        if ($call) {
            $call->markAsCompleted();
        }
    }

    /**
     * Handle recording available event
     */
    private function handleRecordingAvailable(array $event): void
    {
        $contactId = $event['ContactId'] ?? $event['contactId'] ?? null;
        $recordingUrl = $event['RecordingLocation'] ?? $event['recordingUrl'] ?? null;
        $duration = $event['Duration'] ?? $event['duration'] ?? null;

        if (!$contactId || !$recordingUrl) {
            return;
        }

        $call = CommunicationCall::where('aws_connect_contact_id', $contactId)->first();
        if (!$call) {
            return;
        }

        // Parse S3 location from recording URL
        // Format: s3://bucket/key or https://bucket.s3.region.amazonaws.com/key
        $s3Bucket = null;
        $s3Key = null;

        if (preg_match('/s3:\/\/([^\/]+)\/(.+)/', $recordingUrl, $matches)) {
            $s3Bucket = $matches[1];
            $s3Key = $matches[2];
        } elseif (preg_match('/https?:\/\/([^\.]+)\.s3[^\/]+\/(.+)/', $recordingUrl, $matches)) {
            $s3Bucket = $matches[1];
            $s3Key = $matches[2];
        }

        if ($s3Bucket && $s3Key) {
            // Create recording record
            $recording = CommunicationRecording::create([
                'call_id' => $call->id,
                's3_bucket' => $s3Bucket,
                's3_key' => $s3Key,
                'duration_seconds' => $duration,
                'status' => 'available',
            ]);

            // Update call with recording URL
            $call->update([
                'recording_url' => $recording->getS3Url(),
            ]);

            // Optionally start transcription
            if (config('services.aws_transcribe.auto_transcribe', false)) {
                $this->transcribeService->transcribeCallRecording(
                    $call->id,
                    $recording->getS3Url()
                );
            }
        }
    }

    /**
     * Process SMS message
     */
    private function processSmsMessage(array $message): void
    {
        $smsService = app(\App\Modules\Communications\Services\AwsSmsService::class);
        $smsService->handleInboundSms($message);
    }
}

