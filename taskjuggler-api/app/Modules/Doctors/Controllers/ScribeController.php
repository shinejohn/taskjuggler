<?php

namespace App\Modules\Doctors\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Doctors\Services\ScribeMDVisitService;
use App\Modules\Doctors\Services\ScribeMDRoutingService;
use App\Modules\Doctors\Services\TranscriptionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ScribeController extends Controller
{
    public function __construct(
        private ScribeMDVisitService $visitService,
        private ScribeMDRoutingService $routingService,
        private TranscriptionService $transcriptionService
    ) {}

    // =====================================================
    // LEGACY ENDPOINTS (Preserved for backwards compatibility)
    // =====================================================

    /**
     * Start a new recording session (Legacy)
     */
    public function start(Request $request): JsonResponse
    {
        $request->validate([
            'patient_id' => 'required|exists:doctors_patients,id',
            'encounter_id' => 'nullable|exists:doctors_clinical_encounters,id',
        ]);

        // If no encounter exists, create one
        $encounterId = $request->encounter_id;
        if (!$encounterId) {
            $encounterId = Str::uuid();
            DB::table('doctors_clinical_encounters')->insert([
                'id' => $encounterId,
                'organization_id' => '00000000-0000-0000-0000-000000000000',
                'patient_id' => $request->patient_id,
                'provider_id' => '00000000-0000-0000-0000-000000000000',
                'encounter_date' => now(),
                'type' => 'office_visit',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Create Note Record
        $noteId = Str::uuid();
        DB::table('doctors_clinical_notes')->insert([
            'id' => $noteId,
            'encounter_id' => $encounterId,
            'provider_id' => '00000000-0000-0000-0000-000000000000',
            'status' => 'recording',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'note_id' => $noteId,
            'encounter_id' => $encounterId,
            'status' => 'recording'
        ]);
    }

    /**
     * Stop recording and generate note (Legacy - Simulated)
     */
    public function generate(Request $request, $id): JsonResponse
    {
        $mockTranscript = "Patient presents with persistent cough for 3 days. Denies fever. Lungs clear on auscultation. BP 120/80.";
        $mockNote = "# SOAP Note\n\n**Subjective:**\nPatient reports persistent cough x3 days. No fever.\n\n**Objective:**\nBP 120/80. Lungs clear.\n\n**Assessment:**\nAcute bronchitis.\n\n**Plan:**\nSupportive care.\n";

        DB::table('doctors_clinical_notes')
            ->where('id', $id)
            ->update([
                'raw_transcript' => $mockTranscript,
                'generated_note' => $mockNote,
                'status' => 'ready',
                'updated_at' => now(),
            ]);

        return response()->json([
            'id' => $id,
            'note' => $mockNote,
            'status' => 'ready'
        ]);
    }

    /**
     * Get visit review data (Legacy - Mocked)
     */
    public function review($id): JsonResponse
    {
        return response()->json([
            'visit_id' => $id,
            'patient' => [
                'name' => 'Sarah Johnson',
                'dob' => '1985-04-12'
            ],
            'transcript' => [
                ['role' => 'Doctor', 'time' => '0:01', 'text' => "Good morning, Sarah. How's that blood pressure medication working out?"],
                ['role' => 'Patient', 'time' => '0:12', 'text' => "It's okay, but I've been feeling a bit dizzy in the mornings lately."],
                ['role' => 'Doctor', 'time' => '0:25', 'text' => "I see. Let's take a look at your latest vitals."],
            ],
            'note' => [
                'subjective' => "Patient reports morning dizziness since starting Lisinopril 10mg. Denies chest pain or shortness of breath. Overall adherence is good.",
                'objective' => "BP: 105/65 mmHg. HR: 72 bpm. RCM shows stable cardiac rhythm. Physical exam: Lungs clear to auscultation, no peripheral edema.",
                'assessment' => "1. Orthostatic hypotension - likely secondary to Lisinopril. 2. Essential hypertension - well controlled but over-suppressed.",
                'plan' => "Decrease Lisinopril to 5mg daily. Follow up BP log in 2 weeks. Referred to cardiology for baseline Echo."
            ],
            'diagnoses' => [
                ['code' => 'I10', 'description' => 'Essential (primary) hypertension', 'confidence' => 99, 'hcc' => false],
                ['code' => 'I95.1', 'description' => 'Orthostatic hypotension', 'confidence' => 94, 'hcc' => true]
            ],
            'procedures' => [
                ['code' => '99214', 'description' => 'Office visit, established patient, moderate complexity', 'level' => 4]
            ],
            'medications' => [
                ['name' => 'Lisinopril', 'dose' => '5mg', 'sig' => '1 tab PO Daily', 'status' => 'Renew'],
                ['name' => 'Atorvastatin', 'dose' => '20mg', 'sig' => '1 tab PO QHS', 'status' => 'Historical']
            ]
        ]);
    }

    // =====================================================
    // NEW LIVE DASHBOARD ENDPOINTS
    // =====================================================

    /**
     * Create new ScribeMD Live Dashboard visit
     * POST /doctors/scribemd/visits
     */
    public function createVisit(Request $request): JsonResponse
    {
        $request->validate([
            'patient_id' => 'required|exists:doctors_patients,id',
            'appointment_id' => 'nullable|exists:doctors_appointments,id',
            'encounter_id' => 'nullable|exists:doctors_clinical_encounters,id',
        ]);

        // Get authenticated user's provider and org
        $user = $request->user();
        $provider = DB::table('doctors_providers')
            ->where('user_id', $user->id)
            ->first();

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 403);
        }

        $visit = $this->visitService->createVisit([
            'patient_id' => $request->patient_id,
            'provider_id' => $provider->id,
            'organization_id' => $provider->organization_id,
            'appointment_id' => $request->appointment_id,
            'encounter_id' => $request->encounter_id,
        ]);

        return response()->json($visit, 201);
    }

    /**
     * Get ScribeMD visit with all dashboard items
     * GET /doctors/scribemd/visits/{id}
     */
    public function getVisit(string $id): JsonResponse
    {
        $visit = $this->visitService->getVisit($id);

        if (!$visit) {
            return response()->json(['error' => 'Visit not found'], 404);
        }

        return response()->json($visit);
    }

    /**
     * Stop recording and move to review
     * POST /doctors/scribemd/visits/{id}/stop
     */
    public function stopVisitRecording(string $id): JsonResponse
    {
        $visit = $this->visitService->stopRecording($id);
        return response()->json($visit);
    }

    /**
     * Add dashboard item
     * POST /doctors/scribemd/visits/{id}/items
     */
    public function addItem(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'category' => 'required|in:symptom,finding,assessment,plan,prescription,order,prior_auth,diagnosis_code,procedure_code,follow_up,instruction',
            'item_data' => 'required|array',
            'source' => 'nullable|in:ai,manual',
            'source_text' => 'nullable|string',
            'ai_confidence' => 'nullable|numeric|min:0|max:1',
        ]);

        $item = $this->visitService->addItem($id, [
            'category' => $request->category,
            'item_data' => $request->item_data,
            'source' => $request->source ?? 'manual',
            'source_text' => $request->source_text,
            'ai_confidence' => $request->ai_confidence,
        ]);

        return response()->json($item, 201);
    }

    /**
     * Update dashboard item
     * PATCH /doctors/scribemd/visits/{visitId}/items/{itemId}
     */
    public function updateItem(Request $request, string $visitId, string $itemId): JsonResponse
    {
        $request->validate([
            'item_data' => 'nullable|array',
            'is_accepted' => 'nullable|boolean',
        ]);

        $item = $this->visitService->updateItem($visitId, $itemId, $request->only(['item_data', 'is_accepted']));

        return response()->json($item);
    }

    /**
     * Delete dashboard item
     * DELETE /doctors/scribemd/visits/{visitId}/items/{itemId}
     */
    public function deleteItem(string $visitId, string $itemId): JsonResponse
    {
        $deleted = $this->visitService->deleteItem($visitId, $itemId);

        if (!$deleted) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Toggle item acceptance
     * POST /doctors/scribemd/visits/{visitId}/items/{itemId}/toggle
     */
    public function toggleItem(string $visitId, string $itemId): JsonResponse
    {
        $item = $this->visitService->toggleItem($visitId, $itemId);
        return response()->json($item);
    }

    /**
     * Get claim details
     * GET /doctors/scribemd/visits/{id}/claim
     */
    public function getClaim(string $id): JsonResponse
    {
        $claim = $this->visitService->getClaim($id);

        if (!$claim) {
            return response()->json(['error' => 'Claim not found'], 404);
        }

        return response()->json($claim);
    }

    /**
     * Update claim
     * PATCH /doctors/scribemd/visits/{id}/claim
     */
    public function updateClaim(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'primary_diagnosis' => 'nullable|string|max:10',
            'em_level' => 'nullable|integer|min:1|max:5',
            'em_method' => 'nullable|in:mdm,time',
        ]);

        $claim = $this->visitService->updateClaim($id, $request->only(['primary_diagnosis', 'em_level', 'em_method']));

        return response()->json($claim);
    }

    /**
     * Approve visit and route all items
     * POST /doctors/scribemd/visits/{id}/approve
     */
    public function approveVisit(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'sign_note' => 'nullable|boolean',
            'send_prescriptions' => 'nullable|boolean',
            'send_orders' => 'nullable|boolean',
            'queue_prior_auths' => 'nullable|boolean',
            'submit_claim' => 'nullable|boolean',
            'schedule_follow_ups' => 'nullable|boolean',
            'send_instructions' => 'nullable|boolean',
        ]);

        $user = $request->user();

        $results = $this->routingService->approveAndRoute($id, array_merge(
            $request->only([
                'sign_note',
                'send_prescriptions',
                'send_orders',
                'queue_prior_auths',
                'submit_claim',
                'schedule_follow_ups',
                'send_instructions',
            ]),
            ['approved_by' => $user->id]
        ));

        return response()->json([
            'status' => 'approved',
            'routing_results' => $results
        ]);
    }

    /**
     * Update note content
     * PATCH /doctors/scribemd/visits/{id}/note
     */
    public function updateNote(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'subjective' => 'nullable|string',
            'objective' => 'nullable|string',
            'assessment' => 'nullable|string',
            'plan_text' => 'nullable|string',
        ]);

        DB::table('scribemd_notes')
            ->where('visit_id', $id)
            ->update(array_merge(
                $request->only(['subjective', 'objective', 'assessment', 'plan_text']),
                ['updated_at' => now()]
            ));

        $note = DB::table('scribemd_notes')->where('visit_id', $id)->first();

        return response()->json($note);
    }

    /**
     * Get list of visits for current provider
     * GET /doctors/scribemd/visits
     */
    public function listVisits(Request $request): JsonResponse
    {
        $user = $request->user();
        $provider = DB::table('doctors_providers')
            ->where('user_id', $user->id)
            ->first();

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 403);
        }

        $query = DB::table('scribemd_visits')
            ->join('doctors_patients', 'scribemd_visits.patient_id', '=', 'doctors_patients.id')
            ->where('scribemd_visits.provider_id', $provider->id)
            ->whereNull('scribemd_visits.deleted_at')
            ->select(
                'scribemd_visits.id',
                'scribemd_visits.status',
                'scribemd_visits.created_at',
                'scribemd_visits.duration_seconds',
                'doctors_patients.first_name as patient_first_name',
                'doctors_patients.last_name as patient_last_name'
            )
            ->orderBy('scribemd_visits.created_at', 'desc');

        // Optional status filter
        if ($request->has('status')) {
            $query->where('scribemd_visits.status', $request->status);
        }

        // Pagination
        $perPage = $request->input('per_page', 20);
        $visits = $query->paginate($perPage);

        return response()->json($visits);
    }

    /**
     * Process audio chunk for transcription
     * POST /doctors/scribemd/transcribe
     */
    public function transcribe(Request $request): JsonResponse
    {
        $request->validate([
            'audio' => 'required|file|mimes:webm,mp3,wav,ogg|max:10240',
            'visit_id' => 'required|exists:scribemd_visits,id',
            'timestamp' => 'required|numeric',
        ]);

        $result = $this->transcriptionService->processAudioChunk(
            $request->visit_id,
            $request->file('audio'),
            (float) $request->timestamp
        );

        return response()->json($result);
    }
}

