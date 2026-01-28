<?php

namespace App\Modules\OfficialNotice\Services;

use App\Modules\OfficialNotice\Models\IdentityVerification;
use App\Modules\OfficialNotice\Models\Signature;
use Aws\Rekognition\RekognitionClient;
use Illuminate\Support\Facades\Storage;

class FaceMatchService
{
    private RekognitionClient $rekognition;
    private float $matchThreshold = 0.90; // 90% confidence required

    public function __construct()
    {
        $this->rekognition = new RekognitionClient([
            'version' => 'latest',
            'region' => config('services.aws.region'),
            'credentials' => [
                'key' => config('services.aws.key'),
                'secret' => config('services.aws.secret'),
            ],
        ]);
    }

    /**
     * Perform face match between live image and stored reference
     */
    public function matchFace(
        IdentityVerification $verification,
        string $liveImageBase64
    ): array {
        // Get stored reference image
        $referenceImage = Storage::disk('s3')->get($verification->face_reference_image_s3_key);

        // Decode live image
        $liveImageBytes = base64_decode($liveImageBase64);

        // Perform liveness detection first
        $livenessResult = $this->checkLiveness($liveImageBytes);

        if (!$livenessResult['is_live']) {
            return [
                'success' => false,
                'reason' => 'liveness_failed',
                'message' => 'Could not confirm this is a live person. Please try again.',
            ];
        }

        // Compare faces
        $result = $this->rekognition->compareFaces([
            'SourceImage' => [
                'Bytes' => $referenceImage,
            ],
            'TargetImage' => [
                'Bytes' => $liveImageBytes,
            ],
            'SimilarityThreshold' => $this->matchThreshold * 100,
        ]);

        $faceMatches = $result->get('FaceMatches');

        if (empty($faceMatches)) {
            return [
                'success' => false,
                'reason' => 'no_match',
                'confidence' => 0,
                'message' => 'Face does not match verified identity. Please try again.',
            ];
        }

        $confidence = $faceMatches[0]['Similarity'] / 100;

        return [
            'success' => $confidence >= $this->matchThreshold,
            'confidence' => $confidence,
            'is_live' => $livenessResult['is_live'],
            'liveness_confidence' => $livenessResult['confidence'],
        ];
    }

    /**
     * Check if image is of a live person (not a photo of a photo)
     */
    private function checkLiveness(string $imageBytes): array
    {
        $result = $this->rekognition->detectFaces([
            'Image' => [
                'Bytes' => $imageBytes,
            ],
            'Attributes' => ['ALL'],
        ]);

        $faceDetails = $result->get('FaceDetails');

        if (empty($faceDetails)) {
            return ['is_live' => false, 'confidence' => 0];
        }

        $face = $faceDetails[0];

        // Check quality metrics that indicate a real face vs photo
        $quality = $face['Quality'] ?? [];
        $brightness = $quality['Brightness'] ?? 0;
        $sharpness = $quality['Sharpness'] ?? 0;

        // Check for natural eye openness and head pose
        $eyesOpen = $face['EyesOpen']['Value'] ?? false;
        $eyesOpenConfidence = $face['EyesOpen']['Confidence'] ?? 0;

        // Simple heuristic - real faces have natural brightness/sharpness variance
        $isLikelyLive = $brightness > 20 && $brightness < 95
            && $sharpness > 30
            && $eyesOpen
            && $eyesOpenConfidence > 80;

        return [
            'is_live' => $isLikelyLive,
            'confidence' => $eyesOpenConfidence / 100,
        ];
    }

    /**
     * Store face match result on signature
     */
    public function recordFaceMatch(
        Signature $signature,
        array $matchResult,
        string $faceImageBase64
    ): void {
        // Store face image to S3
        $s3Key = 'signing-faces/' . $signature->id . '.jpg';
        Storage::disk('s3')->put($s3Key, base64_decode($faceImageBase64), [
            'encryption' => 'AES256',
        ]);

        $signature->update([
            'face_match_performed' => true,
            'face_match_confidence' => $matchResult['confidence'],
            'face_match_timestamp' => now(),
            'face_liveness_check_passed' => $matchResult['is_live'],
            'face_image_s3_key' => $s3Key,
        ]);
    }
}
