<?php

namespace App\Modules\Doctors\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * ScribeMD Live Dashboard Visit Service
 * 
 * Manages visit sessions for the live dashboard including:
 * - Visit creation and lifecycle
 * - Dashboard item CRUD operations
 * - Real-time state management
 */
class ScribeMDVisitService
{
    /**
     * Create a new ScribeMD visit session
     */
    public function createVisit(array $data): array
    {
        $visitId = Str::uuid()->toString();
        $encounterId = $data['encounter_id'] ?? null;

        // Create encounter if not provided
        if (!$encounterId) {
            $encounterId = Str::uuid()->toString();
            DB::table('doctors_clinical_encounters')->insert([
                'id' => $encounterId,
                'organization_id' => $data['organization_id'],
                'patient_id' => $data['patient_id'],
                'provider_id' => $data['provider_id'],
                'appointment_id' => $data['appointment_id'] ?? null,
                'encounter_date' => now(),
                'type' => 'office_visit',
                'status' => 'draft',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Create visit
        DB::table('scribemd_visits')->insert([
            'id' => $visitId,
            'organization_id' => $data['organization_id'],
            'provider_id' => $data['provider_id'],
            'patient_id' => $data['patient_id'],
            'appointment_id' => $data['appointment_id'] ?? null,
            'encounter_id' => $encounterId,
            'status' => 'in_progress',
            'recording_started_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Initialize empty claim
        DB::table('scribemd_claims')->insert([
            'id' => Str::uuid()->toString(),
            'visit_id' => $visitId,
            'diagnoses' => json_encode([]),
            'procedures' => json_encode([]),
            'validation_flags' => json_encode([]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Initialize empty note
        DB::table('scribemd_notes')->insert([
            'id' => Str::uuid()->toString(),
            'visit_id' => $visitId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $this->getVisit($visitId);
    }

    /**
     * Get visit with all dashboard items
     */
    public function getVisit(string $visitId): ?array
    {
        $visit = DB::table('scribemd_visits')
            ->where('id', $visitId)
            ->first();

        if (!$visit) {
            return null;
        }

        // Get patient info
        $patient = DB::table('doctors_patients')
            ->where('id', $visit->patient_id)
            ->first();

        // Get provider info
        $provider = DB::table('doctors_providers')
            ->join('users', 'doctors_providers.user_id', '=', 'users.id')
            ->where('doctors_providers.id', $visit->provider_id)
            ->select('doctors_providers.*', 'users.name as provider_name')
            ->first();

        // Get all dashboard items
        $items = DB::table('scribemd_dashboard_items')
            ->where('visit_id', $visitId)
            ->orderBy('category')
            ->orderBy('display_order')
            ->get()
            ->map(function ($item) {
                $item->item_data = json_decode($item->item_data, true);
                return $item;
            })
            ->groupBy('category');

        // Get claim
        $claim = DB::table('scribemd_claims')
            ->where('visit_id', $visitId)
            ->first();

        if ($claim) {
            $claim->diagnoses = json_decode($claim->diagnoses, true);
            $claim->procedures = json_decode($claim->procedures, true);
            $claim->validation_flags = json_decode($claim->validation_flags, true);
        }

        // Get note
        $note = DB::table('scribemd_notes')
            ->where('visit_id', $visitId)
            ->first();

        return [
            'id' => $visit->id,
            'status' => $visit->status,
            'recording_started_at' => $visit->recording_started_at,
            'recording_ended_at' => $visit->recording_ended_at,
            'duration_seconds' => $visit->duration_seconds,
            'approved_at' => $visit->approved_at,
            'full_transcript' => $visit->full_transcript,
            'patient' => $patient ? [
                'id' => $patient->id,
                'first_name' => $patient->first_name,
                'last_name' => $patient->last_name,
                'dob' => $patient->dob,
            ] : null,
            'provider' => $provider ? [
                'id' => $provider->id,
                'name' => $provider->provider_name,
                'specialty' => $provider->specialty,
            ] : null,
            'items' => $items,
            'claim' => $claim,
            'note' => $note,
            'created_at' => $visit->created_at,
            'updated_at' => $visit->updated_at,
        ];
    }

    /**
     * Add a dashboard item
     */
    public function addItem(string $visitId, array $data): array
    {
        $itemId = Str::uuid()->toString();

        DB::table('scribemd_dashboard_items')->insert([
            'id' => $itemId,
            'visit_id' => $visitId,
            'category' => $data['category'],
            'item_data' => json_encode($data['item_data']),
            'source' => $data['source'] ?? 'manual',
            'source_text' => $data['source_text'] ?? null,
            'ai_confidence' => $data['ai_confidence'] ?? null,
            'is_accepted' => $data['is_accepted'] ?? true,
            'is_modified' => false,
            'display_order' => $data['display_order'] ?? 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // If adding diagnosis or procedure, sync with claim
        if (in_array($data['category'], ['diagnosis_code', 'procedure_code'])) {
            $this->syncClaimCodes($visitId);
        }

        return $this->getItem($itemId);
    }

    /**
     * Update a dashboard item
     */
    public function updateItem(string $visitId, string $itemId, array $data): array
    {
        $updateData = [
            'updated_at' => now(),
            'is_modified' => true,
        ];

        if (isset($data['item_data'])) {
            $updateData['item_data'] = json_encode($data['item_data']);
        }

        if (isset($data['is_accepted'])) {
            $updateData['is_accepted'] = $data['is_accepted'];
        }

        DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->where('visit_id', $visitId)
            ->update($updateData);

        // Sync claim if code changed
        $item = $this->getItem($itemId);
        if (in_array($item['category'], ['diagnosis_code', 'procedure_code'])) {
            $this->syncClaimCodes($visitId);
        }

        return $item;
    }

    /**
     * Delete a dashboard item
     */
    public function deleteItem(string $visitId, string $itemId): bool
    {
        $item = $this->getItem($itemId);
        $category = $item['category'] ?? null;

        $deleted = DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->where('visit_id', $visitId)
            ->delete();

        // Sync claim if code deleted
        if ($category && in_array($category, ['diagnosis_code', 'procedure_code'])) {
            $this->syncClaimCodes($visitId);
        }

        return $deleted > 0;
    }

    /**
     * Toggle item acceptance
     */
    public function toggleItem(string $visitId, string $itemId): array
    {
        $item = $this->getItem($itemId);
        
        DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->where('visit_id', $visitId)
            ->update([
                'is_accepted' => !$item['is_accepted'],
                'updated_at' => now(),
            ]);

        return $this->getItem($itemId);
    }

    /**
     * Get a single item
     */
    public function getItem(string $itemId): ?array
    {
        $item = DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->first();

        if (!$item) {
            return null;
        }

        return [
            'id' => $item->id,
            'visit_id' => $item->visit_id,
            'category' => $item->category,
            'item_data' => json_decode($item->item_data, true),
            'source' => $item->source,
            'source_text' => $item->source_text,
            'ai_confidence' => $item->ai_confidence,
            'is_accepted' => (bool) $item->is_accepted,
            'is_modified' => (bool) $item->is_modified,
            'execution_status' => $item->execution_status,
            'executed_at' => $item->executed_at,
            'routed_to' => $item->routed_to,
            'display_order' => $item->display_order,
        ];
    }

    /**
     * Get claim for a visit
     */
    public function getClaim(string $visitId): ?array
    {
        $claim = DB::table('scribemd_claims')
            ->where('visit_id', $visitId)
            ->first();

        if (!$claim) {
            return null;
        }

        return [
            'id' => $claim->id,
            'visit_id' => $claim->visit_id,
            'diagnoses' => json_decode($claim->diagnoses, true),
            'procedures' => json_decode($claim->procedures, true),
            'primary_diagnosis' => $claim->primary_diagnosis,
            'em_level' => $claim->em_level,
            'em_method' => $claim->em_method,
            'total_units' => $claim->total_units,
            'estimated_reimbursement' => $claim->estimated_reimbursement,
            'denial_risk_score' => $claim->denial_risk_score,
            'validation_flags' => json_decode($claim->validation_flags, true),
            'documentation_complete' => (bool) $claim->documentation_complete,
        ];
    }

    /**
     * Update claim
     */
    public function updateClaim(string $visitId, array $data): array
    {
        $updateData = ['updated_at' => now()];

        if (isset($data['primary_diagnosis'])) {
            $updateData['primary_diagnosis'] = $data['primary_diagnosis'];
        }
        if (isset($data['em_level'])) {
            $updateData['em_level'] = $data['em_level'];
        }
        if (isset($data['em_method'])) {
            $updateData['em_method'] = $data['em_method'];
        }

        DB::table('scribemd_claims')
            ->where('visit_id', $visitId)
            ->update($updateData);

        return $this->getClaim($visitId);
    }

    /**
     * Stop recording
     */
    public function stopRecording(string $visitId): array
    {
        $visit = DB::table('scribemd_visits')->where('id', $visitId)->first();
        
        $duration = null;
        if ($visit && $visit->recording_started_at) {
            $duration = now()->diffInSeconds($visit->recording_started_at);
        }

        DB::table('scribemd_visits')
            ->where('id', $visitId)
            ->update([
                'recording_ended_at' => now(),
                'duration_seconds' => $duration,
                'status' => 'review',
                'updated_at' => now(),
            ]);

        return $this->getVisit($visitId);
    }

    /**
     * Sync claim codes from dashboard items
     */
    private function syncClaimCodes(string $visitId): void
    {
        // Get all accepted diagnosis codes
        $diagnoses = DB::table('scribemd_dashboard_items')
            ->where('visit_id', $visitId)
            ->where('category', 'diagnosis_code')
            ->where('is_accepted', true)
            ->get()
            ->map(function ($item) {
                $data = json_decode($item->item_data, true);
                return [
                    'code' => $data['code'] ?? '',
                    'description' => $data['description'] ?? '',
                    'is_primary' => $data['is_primary'] ?? false,
                ];
            })
            ->values()
            ->toArray();

        // Get all accepted procedure codes
        $procedures = DB::table('scribemd_dashboard_items')
            ->where('visit_id', $visitId)
            ->where('category', 'procedure_code')
            ->where('is_accepted', true)
            ->get()
            ->map(function ($item) {
                $data = json_decode($item->item_data, true);
                return [
                    'code' => $data['code'] ?? '',
                    'description' => $data['description'] ?? '',
                    'units' => $data['units'] ?? 1,
                    'modifiers' => $data['modifiers'] ?? [],
                ];
            })
            ->values()
            ->toArray();

        // Find primary diagnosis
        $primary = collect($diagnoses)->firstWhere('is_primary', true);
        $primaryCode = $primary['code'] ?? ($diagnoses[0]['code'] ?? null);

        DB::table('scribemd_claims')
            ->where('visit_id', $visitId)
            ->update([
                'diagnoses' => json_encode($diagnoses),
                'procedures' => json_encode($procedures),
                'primary_diagnosis' => $primaryCode,
                'updated_at' => now(),
            ]);
    }
}
