<?php

namespace App\Modules\Doctors\Services;

use App\Modules\Doctors\Models\Patient;
use App\Modules\Doctors\Models\PatientConsent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class IntakeService
{
    /**
     * Complete the multi-step intake process
     */
    public function submitIntake(string $userId, array $data): Patient
    {
        return DB::transaction(function () use ($userId, $data) {
            /** @var Patient $patient */
            $patient = Patient::updateOrCreate(
                ['user_id' => $userId],
                array_merge(
                    $data['personal_info'] ?? [],
                    [
                        'universal_health_id' => $patient->universal_health_id ?? 'HEL-' . strtoupper(Str::random(8)),
                        'portal_status' => 'active',
                        'onboarding_completed' => true
                    ]
                )
            );

            // 1. Process Insurance
            if (!empty($data['insurance'])) {
                // In production: save to a dedicated insurance table
                // For now: update primary fields on patient
                $patient->update([
                    'insurance_provider' => $data['insurance']['provider'] ?? null,
                    'insurance_policy_number' => $data['insurance']['policy'] ?? null,
                ]);
            }

            // 2. Process Clinical History
            // This would normally go into structured tables (Allergies, Medications)
            // For Phase 7, we'll log this as a foundational audit entry or custom field
            
            // 3. Process Consents (CORE)
            if (!empty($data['consents'])) {
                foreach ($data['consents'] as $specialty => $access) {
                    if ($access === true) {
                        PatientConsent::updateOrCreate(
                            [
                                'patient_id' => $patient->id,
                                'specialty' => $specialty
                            ],
                            [
                                'consent_type' => 'treatment_sharing',
                                'consent_scope' => 'full_records',
                                'share_history' => true,
                                'share_medications' => true,
                                'share_allergies' => true,
                                'share_labs' => true,
                                'allow_bidirectional' => true,
                                'is_active' => true,
                                'effective_date' => now(),
                                'signature_method' => 'digital_portal'
                            ]
                        );
                    }
                }
            }

            return $patient;
        });
    }

    /**
     * Generate or Get the Universal Sharing Code
     */
    public function getSharingCode(string $userId): string
    {
        /** @var Patient $patient */
        $patient = Patient::where('user_id', $userId)->first();
        if (!$patient) return '';

        if (!$patient->universal_health_id) {
            $patient->update(['universal_health_id' => 'HEL-' . strtoupper(Str::random(8))]);
        }

        return $patient->universal_health_id;
    }
}
