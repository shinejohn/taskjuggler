# Communications Module Documentation

## Overview

The Communications module provides common AWS-based telecommunications infrastructure shared between URPA Communications and 4Calls.AI (Coordinator module). It replaces Twilio functionality while keeping Vapi (AI voice) and ElevenLabs (TTS).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Common Telco Services Module                    │
│  app/Modules/Communications/                               │
│  ├── Services/                                              │
│  │   ├── AwsConnectService.php      (Call routing)         │
│  │   ├── AwsSmsService.php          (SMS via SNS/Pinpoint) │
│  │   ├── AwsTranscribeService.php   (Speech-to-text)      │
│  │   ├── AwsS3Service.php           (Audio storage)        │
│  │   └── PhoneNumberService.php     (Abstract, Twilio/AWS) │
│  ├── Models/                                                │
│  │   ├── CommunicationCall.php                             │
│  │   ├── CommunicationSms.php                              │
│  │   └── CommunicationRecording.php                         │
│  └── Controllers/                                           │
│      └── AwsWebhookController.php   (Connect webhooks)     │
└─────────────────────────────────────────────────────────────┘
```

## AWS Services Used

- **Amazon Connect**: Call routing and management
- **Amazon SNS/Pinpoint**: SMS messaging
- **Amazon Transcribe**: Speech-to-text transcription
- **Amazon S3**: Audio file storage
- **Twilio** (optional): Phone number provisioning (can be replaced with AWS in future)

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# AWS Credentials
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1

# AWS Connect
AWS_CONNECT_INSTANCE_ID=your_instance_id
AWS_CONNECT_CONTACT_FLOW_ID=your_flow_id
AWS_CONNECT_QUEUE_ID=your_queue_id
AWS_CONNECT_WEBHOOK_URL=https://your-domain.com/api/communications/webhooks/aws-connect

# AWS SNS (for SMS)
AWS_SNS_TOPIC_ARN=arn:aws:sns:region:account:topic
AWS_SNS_SMS_TYPE=Transactional
AWS_SNS_SENDER_ID=YourSenderId

# AWS Pinpoint (alternative to SNS for SMS)
AWS_PINPOINT_APPLICATION_ID=your_app_id
AWS_PINPOINT_SENDER_ID=YourSenderId

# AWS S3
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=us-east-1
AWS_S3_RECORDINGS_PATH=recordings
AWS_S3_AUDIO_PATH=audio

# AWS Transcribe
AWS_TRANSCRIBE_LANGUAGE_CODE=en-US
AWS_TRANSCRIBE_OUTPUT_BUCKET=your-bucket-name
AWS_TRANSCRIBE_OUTPUT_KEY_PREFIX=transcriptions
AWS_TRANSCRIBE_AUTO_TRANSCRIBE=false

# Phone Number Provider
PHONE_NUMBER_PROVIDER=twilio  # 'twilio' or 'aws'
```

## Service Usage Examples

### AwsConnectService

```php
use App\Modules\Communications\Services\AwsConnectService;

$connectService = app(AwsConnectService::class);

// Initiate outbound call
$result = $connectService->initiateCall(
    from: '+1234567890',
    to: '+0987654321',
    config: [
        'user_id' => $user->id,
        'contact_flow_id' => 'optional-flow-id',
    ]
);

// Get call status
$status = $connectService->getCallStatus($contactId);

// Transfer call
$connectService->transferCall($contactId, $destinationQueueId);

// End call
$connectService->endCall($contactId);
```

### AwsSmsService

```php
use App\Modules\Communications\Services\AwsSmsService;

$smsService = app(AwsSmsService::class);

// Send SMS
$result = $smsService->sendSms(
    to: '+1234567890',
    message: 'Hello from TaskJuggler!',
    from: '+0987654321' // optional
);

// Send bulk SMS
$results = $smsService->sendBulkSms(
    recipients: ['+1234567890', '+0987654321'],
    message: 'Bulk message',
    from: '+0987654321'
);
```

### AwsS3Service

```php
use App\Modules\Communications\Services\AwsS3Service;

$s3Service = app(AwsS3Service::class);

// Upload recording
$result = $s3Service->uploadRecording(
    audioData: $audioFileContents,
    callId: $call->id,
    format: 'mp3'
);

// Get signed URL for playback (expires in 60 minutes)
$url = $s3Service->getRecordingUrl($s3Key, expirationMinutes: 60);

// Delete recording
$s3Service->deleteRecording($s3Key);
```

### AwsTranscribeService

```php
use App\Modules\Communications\Services\AwsTranscribeService;

$transcribeService = app(AwsTranscribeService::class);

// Start transcription
$result = $transcribeService->startTranscription(
    audioUrl: 's3://bucket/key/audio.mp3',
    languageCode: 'en-US',
    options: [
        'show_speaker_labels' => true,
    ]
);

// Get transcription result
$transcription = $transcribeService->getTranscription($jobId);

// Transcribe call recording
$result = $transcribeService->transcribeCallRecording(
    callId: $call->id,
    recordingS3Url: 's3://bucket/key/recording.mp3'
);
```

## Webhook Setup

### AWS Connect Webhooks

1. Configure AWS Connect to send webhooks to:
   ```
   POST https://your-domain.com/api/communications/webhooks/aws-connect
   ```

2. Supported events:
   - `CONTACT_INITIATED` - New call started
   - `CONTACT_CONNECTED` - Call connected
   - `CONTACT_ENDED` - Call ended
   - `RECORDING_AVAILABLE` - Recording ready

### SMS Webhooks

1. Configure AWS SNS/Pinpoint to send webhooks to:
   ```
   POST https://your-domain.com/api/communications/webhooks/aws-sms
   ```

2. For SNS, subscribe your endpoint to the SNS topic
3. For Pinpoint, configure webhook URL in Pinpoint console

## Integration with URPA

The URPA module uses `UrpaCommunicationService` to bridge to common communication services:

```php
use App\Modules\Urpa\Services\UrpaCommunicationService;

$service = app(UrpaCommunicationService::class);

// Initiate call
$result = $service->initiateCall($user, '+1234567890', [
    'use_ai' => true,
]);

// Send SMS
$result = $service->sendSms($user, '+1234567890', 'Message');

// Get recordings
$recordings = $service->getCallRecordings($user, limit: 50);

// Get transcriptions
$transcriptions = $service->getCallTranscriptions($user, limit: 50);
```

## Integration with Coordinator (4Calls)

The Coordinator module uses `CoordinatorCommunicationService`:

```php
use App\Modules\Coordinator\Services\CoordinatorCommunicationService;

$service = app(CoordinatorCommunicationService::class);

// Initiate call for coordinator
$result = $service->initiateCallForCoordinator($coordinator, '+1234567890', [
    'from' => '+0987654321',
]);

// Send SMS
$result = $service->sendSmsForCoordinator($coordinator, '+1234567890', 'Message');

// Get recordings
$recordings = $service->getCoordinatorCallRecordings($coordinator, limit: 50);

// Get transcriptions
$transcriptions = $service->getCoordinatorCallTranscriptions($coordinator, limit: 50);
```

## Database Schema

### communication_calls
- `id` (uuid)
- `user_id` (uuid, nullable)
- `caller_number` (string)
- `callee_number` (string)
- `direction` (enum: inbound, outbound)
- `status` (enum: initiated, ringing, connected, completed, failed, etc.)
- `aws_connect_contact_id` (string, unique)
- `recording_url` (text, nullable)
- `transcription_id` (string, nullable)
- `metadata` (json, nullable)
- `initiated_at`, `connected_at`, `ended_at` (timestamps)
- `duration_seconds` (integer, nullable)

### communication_sms
- `id` (uuid)
- `user_id` (uuid, nullable)
- `from_number` (string)
- `to_number` (string)
- `message` (text)
- `direction` (enum: inbound, outbound)
- `status` (enum: pending, sent, delivered, failed, received)
- `aws_message_id` (string, unique, nullable)
- `error_message` (text, nullable)
- `metadata` (json, nullable)
- `sent_at`, `delivered_at` (timestamps)

### communication_recordings
- `id` (uuid)
- `call_id` (uuid, foreign key)
- `s3_bucket` (string)
- `s3_key` (string)
- `duration_seconds` (integer, nullable)
- `transcription_id` (string, nullable)
- `transcription_text` (text, nullable)
- `status` (enum: uploading, available, transcribing, transcribed, failed)
- `metadata` (json, nullable)

## AWS IAM Permissions

Your AWS IAM role/user needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "connect:StartOutboundVoiceContact",
        "connect:DescribeContact",
        "connect:TransferContact",
        "connect:StopContact"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish",
        "sns:Subscribe"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "mobiletargeting:SendMessages"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "transcribe:StartTranscriptionJob",
        "transcribe:GetTranscriptionJob"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:GetObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Migration Guide

### From Twilio to AWS

1. Set up AWS Connect instance
2. Configure phone numbers in AWS Connect
3. Update environment variables
4. Set `PHONE_NUMBER_PROVIDER=aws` (when AWS phone provisioning is implemented)
5. Migrate existing call records using migration scripts

## Notes

- Vapi integration for AI voice calls is preserved (both URPA and Coordinator)
- ElevenLabs for TTS is preserved (shared service)
- Phone number provisioning defaults to Twilio (abstracted via PhoneNumberService)
- All AWS services are abstracted behind interfaces for testability
- Webhook endpoints validate AWS signatures for security
- S3 bucket should have lifecycle policies for old recordings
- Transcription jobs are async with webhook callbacks

