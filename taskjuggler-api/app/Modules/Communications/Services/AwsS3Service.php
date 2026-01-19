<?php

namespace App\Modules\Communications\Services;

use Aws\S3\S3Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AwsS3Service
{
    private S3Client $client;
    private string $bucket;
    private string $region;
    private string $recordingsPath;
    private string $audioPath;

    public function __construct()
    {
        $this->client = new S3Client([
            'version' => 'latest',
            'region' => config('services.aws_s3.region', config('services.aws.region', 'us-east-1')),
            'credentials' => [
                'key' => config('services.aws.key'),
                'secret' => config('services.aws.secret'),
            ],
        ]);

        $this->bucket = config('services.aws_s3.bucket');
        $this->region = config('services.aws_s3.region', config('services.aws.region', 'us-east-1'));
        $this->recordingsPath = config('services.aws_s3.recordings_path', 'recordings');
        $this->audioPath = config('services.aws_s3.audio_path', 'audio');
    }

    /**
     * Upload call recording
     */
    public function uploadRecording(string $audioData, string $callId, string $format = 'mp3'): array
    {
        try {
            $filename = "call_{$callId}_" . time() . ".{$format}";
            $key = "{$this->recordingsPath}/{$filename}";

            $result = $this->client->putObject([
                'Bucket' => $this->bucket,
                'Key' => $key,
                'Body' => $audioData,
                'ContentType' => $this->getContentType($format),
                'ACL' => 'private', // Private by default, use signed URLs for access
            ]);

            return [
                's3_bucket' => $this->bucket,
                's3_key' => $key,
                'url' => $result['ObjectURL'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('AWS S3 recording upload failed', [
                'error' => $e->getMessage(),
                'call_id' => $callId,
            ]);
            throw $e;
        }
    }

    /**
     * Get signed URL for recording playback
     */
    public function getRecordingUrl(string $s3Key, int $expirationMinutes = 60): string
    {
        try {
            $command = $this->client->getCommand('GetObject', [
                'Bucket' => $this->bucket,
                'Key' => $s3Key,
            ]);

            $request = $this->client->createPresignedRequest($command, "+{$expirationMinutes} minutes");

            return (string) $request->getUri();
        } catch (\Exception $e) {
            Log::error('AWS S3 signed URL generation failed', [
                'error' => $e->getMessage(),
                'key' => $s3Key,
            ]);
            throw $e;
        }
    }

    /**
     * Delete recording
     */
    public function deleteRecording(string $s3Key): bool
    {
        try {
            $this->client->deleteObject([
                'Bucket' => $this->bucket,
                'Key' => $s3Key,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('AWS S3 recording delete failed', [
                'error' => $e->getMessage(),
                'key' => $s3Key,
            ]);
            return false;
        }
    }

    /**
     * Upload generic audio file
     */
    public function uploadAudioFile($file, string $path, string $filename = null): array
    {
        try {
            $filename = $filename ?? basename($file);
            $key = "{$this->audioPath}/{$path}/{$filename}";

            $fileContent = is_string($file) ? file_get_contents($file) : $file;
            $contentType = $this->getContentType(pathinfo($filename, PATHINFO_EXTENSION));

            $result = $this->client->putObject([
                'Bucket' => $this->bucket,
                'Key' => $key,
                'Body' => $fileContent,
                'ContentType' => $contentType,
                'ACL' => 'private',
            ]);

            return [
                's3_bucket' => $this->bucket,
                's3_key' => $key,
                'url' => $result['ObjectURL'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('AWS S3 audio upload failed', [
                'error' => $e->getMessage(),
                'path' => $path,
            ]);
            throw $e;
        }
    }

    /**
     * Get file content from S3
     */
    public function getFileContent(string $bucket, string $key): ?string
    {
        try {
            $result = $this->client->getObject([
                'Bucket' => $bucket,
                'Key' => $key,
            ]);

            return $result['Body']->getContents();
        } catch (\Exception $e) {
            Log::error('AWS S3 get file content failed', [
                'error' => $e->getMessage(),
                'bucket' => $bucket,
                'key' => $key,
            ]);
            return null;
        }
    }

    /**
     * Get content type from file extension
     */
    private function getContentType(string $extension): string
    {
        return match(strtolower($extension)) {
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',
            'ogg' => 'audio/ogg',
            'm4a' => 'audio/mp4',
            'json' => 'application/json',
            default => 'application/octet-stream',
        };
    }
}

