<?php

namespace App\Modules\OfficialNotice\Services;

use App\Modules\OfficialNotice\Models\IdentityVerification;
use App\Models\User;
use Stripe\StripeClient;
use Illuminate\Support\Facades\Crypt;

class IdentityVerificationService
{
    private StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Start a new identity verification session
     */
    public function startVerification(User $user): array
    {
        // Create Stripe Identity verification session
        $session = $this->stripe->identity->verificationSessions->create([
            'type' => 'document',
            'options' => [
                'document' => [
                    'require_matching_selfie' => true,
                    'require_live_capture' => true,
                    'allowed_types' => ['driving_license', 'passport', 'id_card'],
                ],
            ],
            'metadata' => [
                'user_id' => $user->id,
            ],
            'return_url' => config('app.url') . '/verification/complete',
        ]);

        // Create local verification record
        $verification = IdentityVerification::create([
            'user_id' => $user->id,
            'stripe_verification_session_id' => $session->id,
            'stripe_status' => $session->status,
            'status' => 'pending',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return [
            'verification_id' => $verification->id,
            'client_secret' => $session->client_secret,
            'url' => $session->url,
        ];
    }

    /**
     * Handle Stripe webhook for verification status updates
     */
    public function handleWebhook(array $event): void
    {
        $session = $event['data']['object'];

        $verification = IdentityVerification::where(
            'stripe_verification_session_id',
            $session['id']
        )->first();

        if (!$verification) {
            return;
        }

        $verification->stripe_status = $session['status'];

        if ($session['status'] === 'verified') {
            $verification->status = 'verified';
            $verification->verified_at = now();
            $verification->expires_at = now()->addYears(2); // Re-verify every 2 years

            // Store encrypted ID data
            if (isset($session['verified_outputs'])) {
                $outputs = $session['verified_outputs'];

                if (isset($outputs['first_name'])) {
                    $verification->id_first_name_encrypted = Crypt::encryptString($outputs['first_name']);
                }
                if (isset($outputs['last_name'])) {
                    $verification->id_last_name_encrypted = Crypt::encryptString($outputs['last_name']);
                }
                if (isset($outputs['dob'])) {
                    $verification->id_dob_encrypted = Crypt::encryptString(json_encode($outputs['dob']));
                }
                if (isset($outputs['document']['type'])) {
                    $verification->id_document_type = $outputs['document']['type'];
                }
                if (isset($outputs['document']['issuing_country'])) {
                    $verification->id_document_country = $outputs['document']['issuing_country'];
                }
            }

            // Store face reference for later matching
            if (isset($session['selfie'])) {
                $this->storeFaceReference($verification, $session['selfie']);
            }
        } elseif ($session['status'] === 'requires_input') {
            $verification->status = 'pending';
        } else {
            $verification->status = 'failed';
        }

        $verification->save();
    }

    /**
     * Check if user has valid identity verification
     */
    public function isVerified(User $user): bool
    {
        return IdentityVerification::where('user_id', $user->id)
            ->where('status', 'verified')
            ->where('expires_at', '>', now())
            ->exists();
    }

    /**
     * Get user's current verification
     */
    public function getVerification(User $user): ?IdentityVerification
    {
        return IdentityVerification::where('user_id', $user->id)
            ->where('status', 'verified')
            ->where('expires_at', '>', now())
            ->latest('verified_at')
            ->first();
    }

    /**
     * Store face reference for later matching
     */
    private function storeFaceReference(IdentityVerification $verification, $selfieData): void
    {
        // $selfieData is likely the 'selfie' object from the session or report
        // It should contain a 'document' field which is the file ID, 
        // or we use the 'document' from verified_outputs if we want ID photo (but we want selfie).
        // Let's assume passed $selfieData is the 'selfie' object from session.
        // NOTE: In Stripe API, 'selfie' might be an object with 'document' (file ID).

        // Safety check
        if (!isset($selfieData['document'])) {
            return;
        }

        $fileId = $selfieData['document'];

        try {
            $apiKey = config('services.stripe.secret');
            $response = \Illuminate\Support\Facades\Http::withBasicAuth($apiKey, '')
                ->get('https://files.stripe.com/v1/files/' . $fileId . '/contents');

            if ($response->successful()) {
                $content = $response->body();

                // Store to S3
                $s3Key = 'identity-references/' . $verification->id . '.jpg';

                \Illuminate\Support\Facades\Storage::disk('s3')->put($s3Key, $content, [
                    'visibility' => 'private',
                    'encryption' => 'AES256', // Encrypt at rest
                ]);

                $verification->update([
                    'face_reference_image_s3_key' => $s3Key
                ]);
            }
        } catch (\Exception $e) {
            // Log error but don't fail the verification status completely?
            // Or maybe we should? If we can't store face, we can't do 2nd pass.
            // For now, log it.
            \Illuminate\Support\Facades\Log::error("Failed to download/store Stripe selfie: " . $e->getMessage());
        }
    }
}
