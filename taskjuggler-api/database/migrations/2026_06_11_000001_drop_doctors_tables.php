<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

/**
 * The Doctors module was extracted to the 4healthcare-Platform fork (HIPAA isolation).
 * The module was never enabled in config/modules.php, so these tables never held data.
 * This migration removes the empty scaffolding tables from environments where the
 * original create migrations ran.
 */
return new class extends Migration
{
    /**
     * Tables in FK-safe drop order (children before parents).
     *
     * @var array<int, string>
     */
    private array $tables = [
        'doctors_clinical_notes',
        'doctors_rcm_claim_lines',
        'doctors_rcm_claims',
        'doctors_rcm_patient_policies',
        'doctors_rcm_insurance_carriers',
        'doctors_clinical_allergies',
        'doctors_clinical_medications',
        'doctors_clinical_diagnoses',
        'doctors_clinical_vitals',
        'doctors_clinical_encounters',
        'doctors_appointments',
        'doctors_appointment_types',
        'doctors_patients',
        'doctors_providers',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            Schema::dropIfExists($table);
        }
    }

    public function down(): void
    {
        // Intentionally a no-op. The Doctors schema now lives in the
        // 4healthcare-Platform repository; recreate it there, not here.
    }
};
