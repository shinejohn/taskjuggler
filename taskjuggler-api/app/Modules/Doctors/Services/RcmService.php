<?php

namespace App\Modules\Doctors\Services;

use App\Modules\Doctors\Models\ClinicalEncounter;
use App\Modules\Doctors\Models\Claim;
use App\Modules\Doctors\Models\ClaimLine;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Modules\Doctors\Services\PriorAuthService;

class RcmService
{
    protected $priorAuthService;

    public function __construct(PriorAuthService $priorAuthService)
    {
        $this->priorAuthService = $priorAuthService;
    }

    /**
     * Generate a claim from a clinical encounter
     */
    public function createClaimFromEncounter($encounterId)
    {
        // 1. Fetch Encounter details with patient and provider
        $encounter = DB::table('doctors_clinical_encounters')->where('id', $encounterId)->first();
        if (!$encounter) {
            throw new \Exception("Encounter not found");
        }

        // 2. Find Patient's Primary Insurance Policy
        $policy = DB::table('doctors_rcm_patient_policies')
            ->where('patient_id', $encounter->patient_id)
            ->where('status', 'active')
            ->orderBy('order', 'asc')
            ->first();

        // 3. Determine CPT Codes (Mock logic based on visit type)
        $cptCodes = [];
        $totalBilled = 0;

        if ($encounter->type === 'office_visit') {
            // New Patient Level 3
            $cptCodes[] = [
                'code' => '99203',
                'description' => 'Office Visit New Patient Level 3',
                'charge' => 150.00
            ];
            $totalBilled += 150.00;
        } elseif ($encounter->type === 'follow_up') {
            // Est Patient Level 3
            $cptCodes[] = [
                'code' => '99213',
                'description' => 'Office Visit Est Patient Level 3',
                'charge' => 100.00
            ];
            $totalBilled += 100.00;
        }

        // 4. Create Claim Record
        $claimId = Str::uuid();
        DB::beginTransaction();
        try {
            DB::table('doctors_rcm_claims')->insert([
                'id' => $claimId,
                'organization_id' => $encounter->organization_id,
                'patient_id' => $encounter->patient_id,
                'provider_id' => $encounter->provider_id,
                'encounter_id' => $encounterId,
                'primary_policy_id' => $policy ? $policy->id : null,
                'total_billed' => $totalBilled,
                'status' => 'draft',
                'service_date' => $encounter->encounter_date,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 5. Create Claim Lines
            $requiresAuth = false;
            foreach ($cptCodes as $cpt) {
                // Check Prior Auth
                $authCheck = $this->priorAuthService->checkAuthorizationRequirement(
                    $policy ? $policy->id : 'default',
                    $cpt['code']
                );

                if ($authCheck['required']) {
                    $requiresAuth = true;
                    // In real app, we would link the auth request here
                }

                DB::table('doctors_rcm_claim_lines')->insert([
                    'id' => Str::uuid(),
                    'claim_id' => $claimId,
                    'visit_type_cpt' => $cpt['code'],
                    'description' => $cpt['description'],
                    'charge_amount' => $cpt['charge'],
                    'units' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // If Prior Auth needed, set status to 'auth_required'
            if ($requiresAuth) {
                DB::table('doctors_rcm_claims')->where('id', $claimId)->update(['status' => 'auth_required']);
            }

            DB::commit();
            return $claimId;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Submit claim to mock payer
     */
    public function submitClaim($claimId)
    {
        $claim = DB::table('doctors_rcm_claims')->where('id', $claimId)->first();
        if (!$claim)
            throw new \Exception("Claim not found");

        if ($claim->status !== 'draft')
            throw new \Exception("Claim already submitted");

        // Simulate submission
        DB::table('doctors_rcm_claims')->where('id', $claimId)->update([
            'status' => 'submitted',
            'updated_at' => now()
        ]);

        return ['status' => 'submitted', 'message' => 'Claim sent to payer'];
    }
}
