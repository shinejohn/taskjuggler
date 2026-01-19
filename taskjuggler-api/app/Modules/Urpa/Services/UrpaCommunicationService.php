<?php

namespace App\Modules\Urpa\Services;

use App\Modules\Communications\Services\AwsConnectService;
use App\Modules\Communications\Services\AwsSmsService;
use App\Modules\Communications\Services\AwsS3Service;
use App\Modules\Communications\Services\AwsTranscribeService;
use App\Modules\Communications\Models\CommunicationCall;
use App\Modules\Communications\Models\CommunicationSms;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UrpaCommunicationService
{
    public function __construct(
        private AwsConnectService $connectService,
        private AwsSmsService $smsService,
        private AwsS3Service $s3Service,
        private AwsTranscribeService $transcribeService
    ) {}

    /**
     * Initiate a call for URPA user
     */
    public function initiateCall(User $user, string $to, array $config = []): array
    {
        $from = $config['from'] ?? $user->urpaProfile->phone_number ?? null;
        
        if (!$from) {
            throw new \Exception('No phone number configured for user');
        }

        $result = $this->connectService->initiateCall($from, $to, array_merge($config, [
            'user_id' => $user->id,
        ]));

        // Create URPA phone call record linked to communication call
        $urpaCall = UrpaPhoneCall::create([
            'user_id' => $user->id,
            'communication_call_id' => $result['call_id'],
            'direction' => 'outbound',
            'caller_number' => $from,
            'callee_number' => $to,
            'status' => 'initiated',
            'handled_by_ai' => $config['use_ai'] ?? false,
            'started_at' => now(),
        ]);

        return [
            'urpa_call_id' => $urpaCall->id,
            'communication_call_id' => $result['call_id'],
            'contact_id' => $result['contact_id'],
        ];
    }

    /**
     * Send SMS for URPA user
     */
    public function sendSms(User $user, string $to, string $message): array
    {
        $from = $user->urpaProfile->phone_number ?? null;
        
        $result = $this->smsService->sendSms($to, $message, $from);

        return $result;
    }

    /**
     * Get call recordings for user
     */
    public function getCallRecordings(User $user, int $limit = 50): array
    {
        $calls = CommunicationCall::forUser($user->id)
            ->whereNotNull('recording_url')
            ->with('recordings')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        $recordings = [];
        foreach ($calls as $call) {
            foreach ($call->recordings as $recording) {
                $recordings[] = [
                    'call_id' => $call->id,
                    'recording_id' => $recording->id,
                    's3_url' => $this->s3Service->getRecordingUrl($recording->s3_key),
                    'duration_seconds' => $recording->duration_seconds,
                    'transcription' => $recording->transcription_text,
                    'created_at' => $recording->created_at,
                ];
            }
        }

        return $recordings;
    }

    /**
     * Get call transcriptions for user
     */
    public function getCallTranscriptions(User $user, int $limit = 50): array
    {
        $calls = CommunicationCall::forUser($user->id)
            ->whereNotNull('transcription_id')
            ->with('recordings')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        $transcriptions = [];
        foreach ($calls as $call) {
            $transcription = $this->transcribeService->getTranscription($call->transcription_id);
            
            if ($transcription) {
                $transcriptions[] = [
                    'call_id' => $call->id,
                    'transcription_id' => $call->transcription_id,
                    'text' => $transcription['transcript_text'] ?? null,
                    'status' => $transcription['status'] ?? null,
                    'created_at' => $call->created_at,
                ];
            }
        }

        return $transcriptions;
    }

    /**
     * Link existing URPA call to communication call
     */
    public function linkToCommunicationCall(UrpaPhoneCall $urpaCall, CommunicationCall $communicationCall): void
    {
        $urpaCall->update([
            'communication_call_id' => $communicationCall->id,
        ]);
    }
}

