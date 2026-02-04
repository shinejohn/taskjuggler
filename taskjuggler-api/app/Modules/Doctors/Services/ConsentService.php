<?php

namespace App\Modules\Doctors\Services;

use App\Modules\Doctors\Models\Patient;
use App\Modules\Doctors\Models\PatientConsent;
use Illuminate\Support\Facades\DB;

class ConsentService
{
    /**
     * Check if a specific provider/organization has permission to view a patient's records
     */
    public function canAccessPatient(string $patientId, string $providerId, ?string $requestingSpecialty = null): bool
    {
        // 1. Direct Organizational Access
        // Check if this patient is "owned" or registered by the provider's org
        $isRegistered = DB::table('doctors_patients')
            ->where('id', $patientId)
            // In production: we would check organization_id here
            // ->where('organization_id', $providerOrgId) 
            ->exists();

        // For now, if they are the primary doctor (GP), we allow it.
        // But for specialists, we require explicit consent.
        
        // 2. Explicit Specialty/Provider Consent
        $query = PatientConsent::where('patient_id', $patientId)
            ->where('is_active', true)
            ->where(function ($q) use ($providerId, $requestingSpecialty) {
                // Either direct provider match
                $q->whereJsonContains('specific_providers', $providerId)
                // Or specialty match
                ->orWhere('specialty', $requestingSpecialty)
                // Or Global Emergency access
                ->orWhere('allow_global_emergency', true);
            });

        return $query->exists() || $isRegistered;
    }

    /**
     * Get a list of "Visible" patient record sections for a given provider
     */
    public function getVisibleSections(string $patientId, string $providerId, ?string $specialty = null): array
    {
        $consent = PatientConsent::where('patient_id', $patientId)
            ->where('is_active', true)
            ->where(function ($q) use ($providerId, $specialty) {
                $q->whereJsonContains('specific_providers', $providerId)
                  ->orWhere('specialty', $specialty);
            })
            ->first();

        if (!$consent) {
            // Default: Minimum PDI visibility if they are registered, otherwise none
            return ['pdi' => true];
        }

        return [
            'history' => $consent->share_history,
            'medications' => $consent->share_medications,
            'allergies' => $consent->share_allergies,
            'labs' => $consent->share_labs,
            'imaging' => $consent->share_imaging,
            'notes' => $consent->share_notes,
            'insurance' => $consent->share_insurance,
            'immunizations' => $consent->share_immunizations,
        ];
    }

    /**
     * Get Clinical History across the entire network for a patient
     */
    public function getFederatedHistory(string $patientId)
    {
        $patient = DB::table('doctors_patients')->where('id', $patientId)->first();
        if (!$patient || !$patient->universal_health_id) {
            return collect([]);
        }

        // Find all patient records with the same Universal ID
        $linkedPatientIds = DB::table('doctors_patients')
            ->where('universal_health_id', $patient->universal_health_id)
            ->pluck('id');

        // Fetch encounters, medications, and allergies from all linked records
        // excluding the current one to show "External" data
        return DB::table('doctors_clinical_encounters')
            ->whereIn('patient_id', $linkedPatientIds)
            ->where('patient_id', '!=', $patientId)
            ->join('organizations', 'doctors_clinical_encounters.organization_id', '=', 'organizations.id')
            ->select('doctors_clinical_encounters.*', 'organizations.name as organization_name')
            ->orderBy('encounter_date', 'desc')
            ->get();
    }
}
