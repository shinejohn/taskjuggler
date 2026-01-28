# Cursor Instructions: Verified Signing & Identity Verification

## Overview

This document provides implementation instructions for the Verified Signing feature in Official Notice. This is our identity-verified electronic signature system that differentiates us from competitors like DocuSign.

> **IMPORTANT TERMINOLOGY:** Do NOT use "Virtual Notary" or "Notary" anywhere in the codebase, UI, or documentation. Notary is a regulated term requiring state commission. Use "Verified Signing" or "ID-Verified Signature" instead.

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| ID Verification | Stripe Identity | Government ID validation + selfie matching |
| Facial Recognition | AWS Rekognition | Live face matching at time of signing |
| Backend | Laravel (PHP) | API, business logic, audit trail |
| Frontend | Vue 3 + Composition API | Signing UI, verification flows |
| Database | PostgreSQL | Verification records, audit logs |
| State Management | Pinia | Signing session state |
| UI Components | Shadcn/Vue + Tailwind | Consistent UI |

---

## Database Schema

### Table: `identity_verifications`

```sql
CREATE TABLE identity_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Stripe Identity
    stripe_verification_session_id VARCHAR(255),
    stripe_status VARCHAR(50), -- 'pending', 'verified', 'failed', 'canceled'
    
    -- Verification Data (encrypted)
    id_document_type VARCHAR(50), -- 'drivers_license', 'passport', 'id_card'
    id_document_country VARCHAR(2),
    id_first_name_encrypted TEXT,
    id_last_name_encrypted TEXT,
    id_dob_encrypted TEXT,
    id_document_number_hash VARCHAR(255), -- hashed for lookup
    
    -- Face Data
    face_reference_image_s3_key VARCHAR(255), -- stored in S3, encrypted
    face_embedding_encrypted TEXT, -- for AWS Rekognition matching
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'failed', 'expired'
    verified_at TIMESTAMP,
    expires_at TIMESTAMP, -- re-verification needed after this date
    
    -- Audit
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_identity_verifications_user_id ON identity_verifications(user_id);
CREATE INDEX idx_identity_verifications_status ON identity_verifications(status);
```

### Table: `signing_sessions`

```sql
CREATE TABLE signing_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    
    -- Session Status
    status VARCHAR(50) DEFAULT 'pending', 
    -- 'pending', 'in_progress', 'awaiting_verification', 'completed', 'expired', 'canceled'
    
    -- Verification Requirements
    verification_required BOOLEAN DEFAULT FALSE,
    verification_required_by UUID REFERENCES parties(id), -- who requested verification
    verification_ratcheted_up BOOLEAN DEFAULT FALSE, -- true if a later signer triggered verification
    
    -- Signing Order
    signing_order_type VARCHAR(20) DEFAULT 'parallel', -- 'sequential', 'parallel'
    
    -- Deadlines
    signing_deadline TIMESTAMP,
    reminder_sent_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `signatures`

```sql
CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signing_session_id UUID NOT NULL REFERENCES signing_sessions(id),
    party_id UUID NOT NULL REFERENCES parties(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Signature Data
    signature_type VARCHAR(20) NOT NULL, -- 'standard', 'verified', 'witnessed'
    signature_image_s3_key VARCHAR(255),
    signature_method VARCHAR(20), -- 'draw', 'type', 'upload'
    
    -- ID Verification at Signing
    verification_status VARCHAR(50), -- 'verified', 'skipped', 'pending'
    verification_waiver_accepted BOOLEAN DEFAULT FALSE,
    verification_waiver_accepted_at TIMESTAMP,
    identity_verification_id UUID REFERENCES identity_verifications(id),
    
    -- Facial Recognition at Signing
    face_match_performed BOOLEAN DEFAULT FALSE,
    face_match_confidence DECIMAL(5,4), -- 0.0000 to 1.0000
    face_match_timestamp TIMESTAMP,
    face_liveness_check_passed BOOLEAN,
    face_image_s3_key VARCHAR(255), -- signing moment image
    
    -- Audit Trail
    signed_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    geolocation_lat DECIMAL(10, 8),
    geolocation_lng DECIMAL(11, 8),
    geolocation_accuracy_meters INTEGER,
    
    -- Document State
    document_hash_at_signing VARCHAR(64), -- SHA-256 of document at signing moment
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(signing_session_id, party_id)
);

CREATE INDEX idx_signatures_signing_session_id ON signatures(signing_session_id);
CREATE INDEX idx_signatures_party_id ON signatures(party_id);
CREATE INDEX idx_signatures_verification_status ON signatures(verification_status);
```

### Table: `signature_audit_logs`

```sql
CREATE TABLE signature_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signature_id UUID NOT NULL REFERENCES signatures(id),
    
    event_type VARCHAR(50) NOT NULL,
    -- Events: 'session_started', 'verification_offered', 'verification_accepted', 
    -- 'verification_skipped', 'waiver_accepted', 'face_match_started', 'face_match_completed',
    -- 'face_match_failed', 'signature_applied', 'ratchet_triggered', 're_verification_required'
    
    event_data JSONB, -- additional event-specific data
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_signature_audit_logs_signature_id ON signature_audit_logs(signature_id);
CREATE INDEX idx_signature_audit_logs_event_type ON signature_audit_logs(event_type);
```

---

## API Endpoints

### Identity Verification

```
POST   /api/identity/start-verification
       → Creates Stripe Identity session, returns client_secret

POST   /api/identity/verification-webhook
       → Stripe webhook for verification status updates

GET    /api/identity/status
       → Returns current user's verification status

POST   /api/identity/refresh
       → Initiate re-verification if expired
```

### Signing Sessions

```
POST   /api/documents/{document_id}/signing-session
       → Create signing session for document
       Body: { 
         parties: [uuid], 
         signing_order: 'sequential'|'parallel',
         verification_required: boolean,
         deadline: datetime 
       }

GET    /api/signing-sessions/{session_id}
       → Get signing session details and status

POST   /api/signing-sessions/{session_id}/request-verification
       → Request ID verification from all parties (ratchet up)
```

### Signing Flow

```
GET    /api/signing-sessions/{session_id}/my-status
       → Get current user's signing status and requirements

POST   /api/signing-sessions/{session_id}/accept-waiver
       → Accept verification waiver (if skipping)
       Body: { acknowledged: true }

POST   /api/signing-sessions/{session_id}/start-face-match
       → Start facial recognition process
       Returns: { rekognition_session_id, instructions }

POST   /api/signing-sessions/{session_id}/complete-face-match
       → Submit face match result
       Body: { face_image_base64, liveness_token }

POST   /api/signing-sessions/{session_id}/sign
       → Apply signature
       Body: { 
         signature_image_base64,
         signature_method: 'draw'|'type'|'upload',
         geolocation?: { lat, lng, accuracy }
       }
```

---

## Frontend Components

### Directory Structure

```
src/
├── features/
│   └── signing/
│       ├── components/
│       │   ├── SigningCeremony.vue        # Main signing flow container
│       │   ├── VerificationChoice.vue      # Verify vs Skip UI
│       │   ├── VerificationWaiver.vue      # Waiver acknowledgment
│       │   ├── FaceMatchCapture.vue        # Camera + face matching
│       │   ├── SignaturePad.vue            # Draw signature
│       │   ├── SignatureTypeInput.vue      # Type name as signature
│       │   ├── SigningComplete.vue         # Success confirmation
│       │   ├── RatchetNotification.vue     # "Verification now required" notice
│       │   └── SigningProgress.vue         # Multi-party progress tracker
│       ├── composables/
│       │   ├── useSigningSession.ts        # Signing session state
│       │   ├── useFaceMatch.ts             # Camera + Rekognition
│       │   └── useStripeIdentity.ts        # Stripe Identity SDK
│       ├── stores/
│       │   └── signingStore.ts             # Pinia store
│       └── types/
│           └── signing.ts                   # TypeScript interfaces
```

### Key Component: VerificationChoice.vue

```vue
<template>
  <div class="verification-choice max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Identity Verification</h2>
    
    <p class="text-gray-600 mb-6">
      Official Notice offers identity verification to confirm you are who you say you are.
      This creates a legally defensible record that YOU signed this document.
    </p>
    
    <!-- Show if no party has required verification -->
    <p v-if="!verificationRequired" class="text-sm text-amber-600 mb-4">
      No party to this transaction has requested ID verification.
    </p>
    
    <!-- Show if another party has required verification -->
    <div v-else class="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
      <p class="text-blue-800 font-medium">
        {{ requiredByPartyName }} has requested ID verification for all parties.
      </p>
      <p class="text-blue-600 text-sm mt-1">
        Verification is required to complete your signature.
      </p>
    </div>
    
    <div class="space-y-4">
      <!-- Verify Option -->
      <label 
        class="block p-4 border-2 rounded-lg cursor-pointer transition-all"
        :class="choice === 'verify' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <input 
          type="radio" 
          v-model="choice" 
          value="verify" 
          class="sr-only"
        />
        <div class="flex items-start gap-3">
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5"
               :class="choice === 'verify' ? 'border-green-500' : 'border-gray-300'">
            <div v-if="choice === 'verify'" class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          </div>
          <div>
            <span class="font-medium text-green-700">VERIFY MY IDENTITY</span>
            <span class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Recommended</span>
            <p class="text-sm text-gray-600 mt-1">
              Government ID + facial recognition. Takes 2 minutes.
              Creates verified signing record.
            </p>
          </div>
        </div>
      </label>
      
      <!-- Skip Option (only if not required) -->
      <label 
        v-if="!verificationRequired"
        class="block p-4 border-2 rounded-lg cursor-pointer transition-all"
        :class="choice === 'skip' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <input 
          type="radio" 
          v-model="choice" 
          value="skip" 
          class="sr-only"
        />
        <div class="flex items-start gap-3">
          <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5"
               :class="choice === 'skip' ? 'border-amber-500' : 'border-gray-300'">
            <div v-if="choice === 'skip'" class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          </div>
          <div>
            <span class="font-medium text-gray-700">SKIP VERIFICATION</span>
            <p class="text-sm text-gray-500 mt-1">
              I understand that without ID verification, this signature only proves 
              someone with access to my email clicked a button. I accept the risk 
              that this signature could be disputed or challenged. I was offered 
              verification and declined.
            </p>
          </div>
        </div>
      </label>
    </div>
    
    <button 
      @click="handleContinue"
      :disabled="!choice || (verificationRequired && choice !== 'verify')"
      class="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium 
             hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
             transition-colors"
    >
      Continue to Sign
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  verificationRequired: boolean
  requiredByPartyName?: string
}>()

const emit = defineEmits<{
  (e: 'verify'): void
  (e: 'skip'): void
}>()

const choice = ref<'verify' | 'skip' | null>(null)

// Auto-select verify if required
if (props.verificationRequired) {
  choice.value = 'verify'
}

const handleContinue = () => {
  if (choice.value === 'verify') {
    emit('verify')
  } else if (choice.value === 'skip') {
    emit('skip')
  }
}
</script>
```

---

## Backend Services

### IdentityVerificationService.php

```php
<?php

namespace App\Services;

use App\Models\IdentityVerification;
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
            if (isset($session['selfie']['document_photo'])) {
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
}
```

### FaceMatchService.php

```php
<?php

namespace App\Services;

use App\Models\IdentityVerification;
use App\Models\Signature;
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
```

### SigningService.php

```php
<?php

namespace App\Services;

use App\Models\Document;
use App\Models\SigningSession;
use App\Models\Signature;
use App\Models\Party;
use App\Events\SignatureCompleted;
use App\Events\VerificationRatchetTriggered;

class SigningService
{
    public function __construct(
        private IdentityVerificationService $identityService,
        private FaceMatchService $faceMatchService,
    ) {}
    
    /**
     * Create a new signing session
     */
    public function createSession(
        Document $document,
        array $partyIds,
        string $signingOrder = 'parallel',
        bool $verificationRequired = false,
        ?string $requiredByPartyId = null,
        ?\DateTimeInterface $deadline = null
    ): SigningSession {
        $session = SigningSession::create([
            'document_id' => $document->id,
            'transaction_id' => $document->transaction_id,
            'status' => 'pending',
            'verification_required' => $verificationRequired,
            'verification_required_by' => $requiredByPartyId,
            'signing_order_type' => $signingOrder,
            'signing_deadline' => $deadline,
        ]);
        
        // Create signature records for each party
        foreach ($partyIds as $partyId) {
            $party = Party::findOrFail($partyId);
            
            Signature::create([
                'signing_session_id' => $session->id,
                'party_id' => $partyId,
                'user_id' => $party->user_id,
                'signature_type' => $verificationRequired ? 'verified' : 'standard',
                'verification_status' => 'pending',
            ]);
        }
        
        return $session;
    }
    
    /**
     * Handle verification waiver acceptance (when user skips verification)
     */
    public function acceptWaiver(SigningSession $session, Party $party): Signature
    {
        $signature = $session->signatures()->where('party_id', $party->id)->firstOrFail();
        
        $signature->update([
            'verification_status' => 'skipped',
            'verification_waiver_accepted' => true,
            'verification_waiver_accepted_at' => now(),
        ]);
        
        // Log audit event
        $signature->auditLogs()->create([
            'event_type' => 'waiver_accepted',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
        
        return $signature;
    }
    
    /**
     * Handle when a party chooses to verify (may trigger ratchet)
     */
    public function handleVerificationChoice(SigningSession $session, Party $party): void
    {
        $signature = $session->signatures()->where('party_id', $party->id)->firstOrFail();
        
        // If this is the first party to choose verification and it wasn't required before
        if (!$session->verification_required) {
            $session->update([
                'verification_required' => true,
                'verification_required_by' => $party->id,
                'verification_ratcheted_up' => true,
            ]);
            
            // Update all existing signatures to require verification
            $session->signatures()->update([
                'signature_type' => 'verified',
            ]);
            
            // Find parties who already skipped - they need to verify now
            $skippedSignatures = $session->signatures()
                ->where('verification_status', 'skipped')
                ->get();
            
            foreach ($skippedSignatures as $skippedSig) {
                $skippedSig->update([
                    'verification_status' => 'pending',
                    'verification_waiver_accepted' => false,
                    'verification_waiver_accepted_at' => null,
                ]);
                
                // Notify the party that verification is now required
                event(new VerificationRatchetTriggered($skippedSig));
            }
        }
    }
    
    /**
     * Complete signing with all verification
     */
    public function completeSignature(
        SigningSession $session,
        Party $party,
        string $signatureImageBase64,
        string $signatureMethod,
        ?array $geolocation = null
    ): Signature {
        $signature = $session->signatures()->where('party_id', $party->id)->firstOrFail();
        
        // Validate verification status if required
        if ($session->verification_required && $signature->verification_status !== 'verified') {
            throw new \Exception('ID verification required before signing');
        }
        
        // Calculate document hash
        $document = $session->document;
        $documentHash = hash('sha256', Storage::disk('s3')->get($document->file_path));
        
        // Store signature image
        $s3Key = 'signatures/' . $signature->id . '.png';
        Storage::disk('s3')->put($s3Key, base64_decode($signatureImageBase64));
        
        $signature->update([
            'signature_image_s3_key' => $s3Key,
            'signature_method' => $signatureMethod,
            'signed_at' => now(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'device_fingerprint' => request()->header('X-Device-Fingerprint'),
            'geolocation_lat' => $geolocation['lat'] ?? null,
            'geolocation_lng' => $geolocation['lng'] ?? null,
            'geolocation_accuracy_meters' => $geolocation['accuracy'] ?? null,
            'document_hash_at_signing' => $documentHash,
        ]);
        
        // Log audit event
        $signature->auditLogs()->create([
            'event_type' => 'signature_applied',
            'event_data' => [
                'method' => $signatureMethod,
                'document_hash' => $documentHash,
                'verification_status' => $signature->verification_status,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
        
        // Check if all parties have signed
        $this->checkSessionCompletion($session);
        
        event(new SignatureCompleted($signature));
        
        return $signature;
    }
    
    /**
     * Check if all parties have signed and complete session
     */
    private function checkSessionCompletion(SigningSession $session): void
    {
        $pendingSignatures = $session->signatures()
            ->whereNull('signed_at')
            ->count();
        
        if ($pendingSignatures === 0) {
            $session->update(['status' => 'completed']);
            
            // Generate certificate of completion
            // Apply final signatures to PDF
            // etc.
        }
    }
}
```

---

## The Ratchet-Up Flow

### Visual Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SIGNING SESSION                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Party A arrives first                                               │
│    ↓                                                                 │
│  Sees verification choice → Clicks "SKIP"                           │
│    ↓                                                                 │
│  Waiver recorded, signature applied                                  │
│    ↓                                                                 │
│  Status: Party A = signed (unverified)                              │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Party B arrives later                                               │
│    ↓                                                                 │
│  Sees verification choice → Clicks "VERIFY"                         │
│    ↓                                                                 │
│  ⚡ RATCHET TRIGGERED ⚡                                              │
│    ↓                                                                 │
│  Session updated: verification_required = true                       │
│    ↓                                                                 │
│  Party A's signature → HELD PENDING VERIFICATION                    │
│    ↓                                                                 │
│  Party A notified: "Another party has requested verification.       │
│    Please complete identity verification to finalize."              │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Party A completes verification                                      │
│    ↓                                                                 │
│  Party A's signature now verified                                    │
│    ↓                                                                 │
│  Party B completes verification + signature                          │
│    ↓                                                                 │
│  Session complete: ALL PARTIES VERIFIED                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Email Notification Template (Ratchet Triggered)

```
Subject: Verification Required for Your Signature - [Document Name]

Hi [Party A Name],

Another party to the [Document Name] has requested identity verification 
for all signers.

Your signature has been recorded, but will not be finalized until you 
complete identity verification.

This ensures all parties to this agreement have verified their identity 
equally.

[Complete Verification] ← Button

If you have questions, contact [Transaction Creator].

---
Official Notice
You've been officially noticed.
```

---

## Testing Checklist

### Unit Tests
- [ ] IdentityVerificationService creates Stripe session correctly
- [ ] FaceMatchService returns correct match/no-match results
- [ ] SigningService creates sessions with correct party setup
- [ ] Waiver acceptance records correctly
- [ ] Ratchet-up triggers correctly when second party verifies
- [ ] All parties notified when ratchet triggers
- [ ] Audit trail captures all events

### Integration Tests
- [ ] Full signing flow without verification
- [ ] Full signing flow with verification
- [ ] Ratchet-up scenario (Party A skips → Party B verifies → Party A re-verifies)
- [ ] Sequential signing enforces order
- [ ] Parallel signing allows any order
- [ ] Deadline enforcement works

### E2E Tests
- [ ] Complete signing ceremony UI flow
- [ ] Camera capture works on mobile and desktop
- [ ] Face match UI shows clear success/failure
- [ ] Waiver text is visible and acknowledgment required
- [ ] Ratchet notification email received and link works

---

## Security Considerations

1. **Encryption at rest:** All face images, ID data, and signatures encrypted in S3
2. **Encryption in transit:** All API calls over HTTPS
3. **Access control:** Users can only access their own verification data
4. **Audit logging:** Every action logged with IP, timestamp, device info
5. **Data retention:** Face images deleted after [X] years per policy
6. **GDPR compliance:** Users can request deletion of biometric data
7. **No plaintext storage:** ID numbers, DOB, etc. always encrypted

---

## Environment Variables

```env
# Stripe Identity
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# AWS Rekognition
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_DEFAULT_REGION=us-east-1

# S3 Storage
AWS_BUCKET_FACES=officialnotice-faces-prod
AWS_BUCKET_SIGNATURES=officialnotice-signatures-prod

# Face Match
FACE_MATCH_THRESHOLD=0.90
```

---

## Terminology Reference

| DO USE | DON'T USE |
|--------|-----------|
| Verified Signing | Virtual Notary |
| ID-Verified Signature | Notarized Signature |
| Identity Verification | Notarization |
| Verification Required | Notarization Required |
| Verified Signer | Notarized Signer |
| Signing Ceremony | Notarial Act |

---

## Related Documentation

- [Official_Notice_Project_Specification.md] - Full project spec
- [Official_Notice_Data_Model_v2.md] - Database schema overview
- [Stripe Identity Documentation](https://stripe.com/docs/identity)
- [AWS Rekognition Documentation](https://docs.aws.amazon.com/rekognition/)
