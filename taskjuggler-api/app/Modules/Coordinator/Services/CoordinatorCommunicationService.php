<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Communications\Services\AwsConnectService;
use App\Modules\Communications\Services\AwsSmsService;
use App\Modules\Communications\Services\AwsS3Service;
use App\Modules\Communications\Services\AwsTranscribeService;
use App\Modules\Communications\Models\CommunicationCall;
use App\Modules\Communications\Models\CommunicationSms;
use App\Modules\Coordinator\Models\CallLog;
use App\Modules\Coordinator\Models\Coordinator;
use Illuminate\Support\Facades\Log;

class CoordinatorCommunicationService
{
    public function __construct(
        private AwsConnectService $connectService,
        private AwsSmsService $smsService,
        private AwsS3Service $s3Service,
        private AwsTranscribeService $transcribeService
    ) {}

    /**
     * Initiate a call for Coordinator
     */
    public function initiateCallForCoordinator(Coordinator $coordinator, string $to, array $config = []): array
    {
        $organization = $coordinator->organization;
        $from = $config['from'] ?? $organization->phone_number ?? null;
        
        if (!$from) {
            throw new \Exception('No phone number configured for organization');
        }

        $result = $this->connectService->initiateCall($from, $to, array_merge($config, [
            'user_id' => $organization->owner_id ?? null,
            'coordinator_id' => $coordinator->id,
            'organization_id' => $organization->id,
        ]));

        // Create Coordinator call log linked to communication call
        $callLog = CallLog::create([
            'organization_id' => $organization->id,
            'communication_call_id' => $result['call_id'],
            'coordinator_id' => $coordinator->id,
            'direction' => 'outbound',
            'from_number' => $from,
            'to_number' => $to,
            'status' => 'initiated',
            'provider' => 'aws',
            'provider_call_id' => $result['contact_id'],
            'started_at' => now(),
        ]);

        return [
            'call_log_id' => $callLog->id,
            'communication_call_id' => $result['call_id'],
            'contact_id' => $result['contact_id'],
        ];
    }

    /**
     * Send SMS for Coordinator
     */
    public function sendSmsForCoordinator(Coordinator $coordinator, string $to, string $message): array
    {
        $organization = $coordinator->organization;
        $from = $organization->phone_number ?? null;
        
        $result = $this->smsService->sendSms($to, $message, $from);

        return $result;
    }

    /**
     * Get call recordings for coordinator
     */
    public function getCoordinatorCallRecordings(Coordinator $coordinator, int $limit = 50): array
    {
        $callLogs = CallLog::where('coordinator_id', $coordinator->id)
            ->whereNotNull('communication_call_id')
            ->with('communicationCall.recordings')
            ->orderBy('started_at', 'desc')
            ->limit($limit)
            ->get();

        $recordings = [];
        foreach ($callLogs as $callLog) {
            if ($callLog->communicationCall) {
                foreach ($callLog->communicationCall->recordings as $recording) {
                    $recordings[] = [
                        'call_log_id' => $callLog->id,
                        'recording_id' => $recording->id,
                        's3_url' => $this->s3Service->getRecordingUrl($recording->s3_key),
                        'duration_seconds' => $recording->duration_seconds,
                        'transcription' => $recording->transcription_text,
                        'created_at' => $recording->created_at,
                    ];
                }
            }
        }

        return $recordings;
    }

    /**
     * Get call transcriptions for coordinator
     */
    public function getCoordinatorCallTranscriptions(Coordinator $coordinator, int $limit = 50): array
    {
        $callLogs = CallLog::where('coordinator_id', $coordinator->id)
            ->whereNotNull('communication_call_id')
            ->with('communicationCall')
            ->orderBy('started_at', 'desc')
            ->limit($limit)
            ->get();

        $transcriptions = [];
        foreach ($callLogs as $callLog) {
            if ($callLog->communicationCall && $callLog->communicationCall->transcription_id) {
                $transcription = $this->transcribeService->getTranscription($callLog->communicationCall->transcription_id);
                
                if ($transcription) {
                    $transcriptions[] = [
                        'call_log_id' => $callLog->id,
                        'transcription_id' => $callLog->communicationCall->transcription_id,
                        'text' => $transcription['transcript_text'] ?? null,
                        'status' => $transcription['status'] ?? null,
                        'created_at' => $callLog->started_at,
                    ];
                }
            }
        }

        return $transcriptions;
    }

    /**
     * Link existing Coordinator call log to communication call
     */
    public function linkToCommunicationCall(CallLog $callLog, CommunicationCall $communicationCall): void
    {
        $callLog->update([
            'communication_call_id' => $communicationCall->id,
        ]);
    }
}

