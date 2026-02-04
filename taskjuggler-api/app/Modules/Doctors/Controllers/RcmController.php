<?php

namespace App\Modules\Doctors\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Doctors\Services\RcmService;

class RcmController extends Controller
{
    protected $rcmService;

    public function __construct(RcmService $rcmService)
    {
        $this->rcmService = $rcmService;
    }

    /**
     * Generate a claim from a clinical encounter
     */
    public function generate(Request $request)
    {
        $request->validate([
            'encounter_id' => 'required|exists:doctors_clinical_encounters,id'
        ]);

        try {
            $claimId = $this->rcmService->createClaimFromEncounter($request->encounter_id);
            return response()->json([
                'message' => 'Claim generated successfully',
                'claim_id' => $claimId
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate claim',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Submit a claim to the payer
     */
    public function submit(Request $request, $id)
    {
        try {
            $result = $this->rcmService->submitClaim($id);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to submit claim',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
