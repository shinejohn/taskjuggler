<?php

namespace App\Modules\Communications\Services;

use Aws\TranscribeService\TranscribeServiceClient;
use Illuminate\Support\Facades\Log;

class AwsTranscribeService
{
    private TranscribeServiceClient $client;
    private string $languageCode;
    private string $outputBucket;
    private string $outputKeyPrefix;

    public function __construct()
    {
        $this->client = new TranscribeServiceClient([
            'version' => 'latest',
            'region' => config('services.aws.region', 'us-east-1'),
            'credentials' => [
                'key' => config('services.aws.key'),
                'secret' => config('services.aws.secret'),
            ],
        ]);

        $this->languageCode = config('services.aws_transcribe.language_code', 'en-US');
        $this->outputBucket = config('services.aws_transcribe.output_bucket');
        $this->outputKeyPrefix = config('services.aws_transcribe.output_key_prefix', 'transcriptions');
    }

    /**
     * Start async transcription job
     */
    public function startTranscription(string $audioUrl, ?string $languageCode = null, array $options = []): array
    {
        try {
            $jobName = 'transcribe_' . uniqid();
            $language = $languageCode ?? $this->languageCode;

            $params = [
                'TranscriptionJobName' => $jobName,
                'Media' => [
                    'MediaFileUri' => $audioUrl,
                ],
                'LanguageCode' => $language,
                'OutputBucketName' => $this->outputBucket,
                'OutputKey' => $this->outputKeyPrefix . '/' . $jobName . '.json',
            ];

            // Add optional settings
            if (isset($options['vocabulary_name'])) {
                $params['Settings']['VocabularyName'] = $options['vocabulary_name'];
            }

            if (isset($options['show_speaker_labels'])) {
                $params['Settings']['ShowSpeakerLabels'] = $options['show_speaker_labels'];
            }

            $result = $this->client->startTranscriptionJob($params);

            return [
                'job_id' => $jobName,
                'status' => $result['TranscriptionJob']['TranscriptionJobStatus'] ?? 'IN_PROGRESS',
            ];
        } catch (\Exception $e) {
            Log::error('AWS Transcribe start failed', [
                'error' => $e->getMessage(),
                'audio_url' => $audioUrl,
            ]);
            throw $e;
        }
    }

    /**
     * Get transcription result
     */
    public function getTranscription(string $jobId): ?array
    {
        try {
            $result = $this->client->getTranscriptionJob([
                'TranscriptionJobName' => $jobId,
            ]);

            $job = $result['TranscriptionJob'] ?? null;
            if (!$job) {
                return null;
            }

            $status = $job['TranscriptionJobStatus'] ?? null;
            $transcriptUri = $job['Transcript']['TranscriptFileUri'] ?? null;

            $transcriptText = null;
            if ($transcriptUri && $status === 'COMPLETED') {
                // Fetch transcript from S3
                $transcriptText = $this->fetchTranscriptFromS3($transcriptUri);
            }

            return [
                'job_id' => $jobId,
                'status' => $status,
                'transcript_uri' => $transcriptUri,
                'transcript_text' => $transcriptText,
                'language_code' => $job['LanguageCode'] ?? null,
                'media_format' => $job['MediaFormat'] ?? null,
                'creation_time' => $job['CreationTime'] ?? null,
                'completion_time' => $job['CompletionTime'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('AWS Transcribe get failed', [
                'error' => $e->getMessage(),
                'job_id' => $jobId,
            ]);
            return null;
        }
    }

    /**
     * Transcribe a call recording
     */
    public function transcribeCallRecording(string $callId, string $recordingS3Url, ?string $languageCode = null): array
    {
        $result = $this->startTranscription($recordingS3Url, $languageCode);

        // Update recording with transcription job ID
        \App\Modules\Communications\Models\CommunicationRecording::where('call_id', $callId)
            ->where('status', 'available')
            ->first()
            ?->markAsTranscribing($result['job_id']);

        return $result;
    }

    /**
     * Fetch transcript JSON from S3 URI
     */
    private function fetchTranscriptFromS3(string $transcriptUri): ?string
    {
        try {
            // Parse S3 URI: s3://bucket/key or https://bucket.s3.region.amazonaws.com/key
            if (preg_match('/s3:\/\/([^\/]+)\/(.+)/', $transcriptUri, $matches)) {
                $bucket = $matches[1];
                $key = $matches[2];
            } elseif (preg_match('/https?:\/\/([^\.]+)\.s3[^\/]+\/(.+)/', $transcriptUri, $matches)) {
                $bucket = $matches[1];
                $key = $matches[2];
            } else {
                Log::warning('Could not parse S3 URI', ['uri' => $transcriptUri]);
                return null;
            }

            $s3Service = app(\App\Modules\Communications\Services\AwsS3Service::class);
            $jsonContent = $s3Service->getFileContent($bucket, $key);

            if ($jsonContent) {
                $data = json_decode($jsonContent, true);
                // Extract transcript text from AWS Transcribe JSON format
                $transcriptText = '';
                foreach ($data['results']['transcripts'] ?? [] as $transcript) {
                    $transcriptText .= $transcript['transcript'] . ' ';
                }
                return trim($transcriptText);
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Failed to fetch transcript from S3', [
                'error' => $e->getMessage(),
                'uri' => $transcriptUri,
            ]);
            return null;
        }
    }
}

