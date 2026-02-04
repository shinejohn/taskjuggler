<?php

namespace App\Modules\Doctors\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ScribeController extends Controller
{
    /**
     * Start a new recording session
     */
    public function start(Request $request)
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
                'organization_id' => '00000000-0000-0000-0000-000000000000', // Mock Org
                'patient_id' => $request->patient_id,
                'provider_id' => '00000000-0000-0000-0000-000000000000', // Mock Provider 
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
            'provider_id' => '00000000-0000-0000-0000-000000000000', // Mock Provider
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
     * Stop recording and generate note (Simulated)
     */
    public function generate(Request $request, $id)
    {
        // In a real app, this would receive audio blob or text transcript
        // Here we simulate AI generation

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
     * Get visit review data (Mocked)
     */
    public function review($id)
    {
        // Simulate fetching complex data for the review screen
        return response()->json([
            'visit_id' => $id,
            'patient' => [
                'name' => 'Sarah Johnson',
                'dob' => '1985-04-12'
            ],
            'transcript' => [
                ['role' => 'Doctor', 'time' => '0:01', 'text' => "Good morning, Sarah. How’s that blood pressure medication working out?"],
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
}
