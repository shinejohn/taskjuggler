<?php

namespace App\Modules\Doctors\Services;

use Illuminate\Support\Facades\DB;

/**
 * ScribeMD Routing Service
 * 
 * Routes approved dashboard items to their destinations:
 * - Prescriptions → E-Prescribing service  
 * - Claims → Clearinghouse
 * - Prior Auths → PA queue
 * - Orders → Lab/imaging interfaces
 * - Notes → EHR
 */
class ScribeMDRoutingService
{
    /**
     * Approve visit and route all accepted items
     */
    public function approveAndRoute(string $visitId, array $options = []): array
    {
        $results = [
            'prescriptions' => [],
            'orders' => [],
            'prior_auths' => [],
            'claim' => null,
            'note' => null,
            'follow_ups' => [],
            'instructions' => [],
        ];

        // Get all accepted items by category
        $items = DB::table('scribemd_dashboard_items')
            ->where('visit_id', $visitId)
            ->where('is_accepted', true)
            ->get();

        foreach ($items as $item) {
            $category = $item->category;
            $itemData = json_decode($item->item_data, true);

            switch ($category) {
                case 'prescription':
                    if ($options['send_prescriptions'] ?? true) {
                        $result = $this->routePrescription($visitId, $item->id, $itemData);
                        $results['prescriptions'][] = $result;
                    }
                    break;

                case 'order':
                    if ($options['send_orders'] ?? true) {
                        $result = $this->routeOrder($visitId, $item->id, $itemData);
                        $results['orders'][] = $result;
                    }
                    break;

                case 'prior_auth':
                    if ($options['queue_prior_auths'] ?? true) {
                        $result = $this->routePriorAuth($visitId, $item->id, $itemData);
                        $results['prior_auths'][] = $result;
                    }
                    break;

                case 'follow_up':
                    if ($options['schedule_follow_ups'] ?? true) {
                        $result = $this->routeFollowUp($visitId, $item->id, $itemData);
                        $results['follow_ups'][] = $result;
                    }
                    break;

                case 'instruction':
                    if ($options['send_instructions'] ?? true) {
                        $result = $this->routeInstruction($visitId, $item->id, $itemData);
                        $results['instructions'][] = $result;
                    }
                    break;
            }
        }

        // Submit claim if requested
        if ($options['submit_claim'] ?? false) {
            $results['claim'] = $this->submitClaim($visitId);
        }

        // Sign note if requested
        if ($options['sign_note'] ?? true) {
            $results['note'] = $this->signNote($visitId, $options['signer_id'] ?? null);
        }

        // Update visit status
        DB::table('scribemd_visits')
            ->where('id', $visitId)
            ->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $options['approved_by'] ?? null,
                'routing_results' => json_encode($results),
                'updated_at' => now(),
            ]);

        return $results;
    }

    /**
     * Route prescription to pharmacy
     */
    private function routePrescription(string $visitId, string $itemId, array $data): array
    {
        // In production: integrate with E-Prescribing service (Surescripts, etc.)
        // For now: simulate successful queueing
        
        DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->update([
                'execution_status' => 'queued',
                'routed_to' => 'pharmacy',
                'executed_at' => now(),
                'execution_result' => json_encode([
                    'status' => 'queued',
                    'pharmacy' => $data['pharmacy'] ?? 'default',
                    'message' => 'Prescription queued for e-prescribing',
                ]),
                'updated_at' => now(),
            ]);

        // Create Patient Visit Item
        $this->createPatientVisitItem($visitId, 'medication', [
            'title' => 'New Medication: ' . ($data['drug_name'] ?? 'Unknown'),
            'description' => "Dose: {$data['dose']}, Sig: {$data['sig']}",
            'why_explanation' => $data['indication'] ?? 'To treat your current symptoms.',
            'status' => 'processing',
            'linked_record_type' => 'prescription',
            'linked_record_id' => $itemId
        ]);

        return [
            'item_id' => $itemId,
            'drug' => $data['drug_name'] ?? 'Unknown',
            'status' => 'queued',
            'destination' => 'E-Prescribing Queue',
        ];
    }

    /**
     * Route order to lab/imaging
     */
    private function routeOrder(string $visitId, string $itemId, array $data): array
    {
        // In production: integrate with lab interfaces (HL7, FHIR)
        
        $orderType = $data['order_type'] ?? 'lab';
        
        DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->update([
                'execution_status' => 'sent',
                'routed_to' => $orderType,
                'executed_at' => now(),
                'execution_result' => json_encode([
                    'status' => 'sent',
                    'order_type' => $orderType,
                    'message' => "Order sent to {$orderType} interface",
                ]),
                'updated_at' => now(),
            ]);

        // Create Patient Visit Item
        $this->createPatientVisitItem($visitId, 'test', [
            'title' => 'Ordered ' . ($orderType === 'lab' ? 'Lab Test' : 'Imaging') . ': ' . ($data['name'] ?? 'Unknown'),
            'description' => $data['instructions'] ?? "Requested {$orderType} at preferred facility.",
            'why_explanation' => $data['clinical_indication'] ?? 'To further investigate your symptoms.',
            'status' => 'sent',
            'linked_record_type' => 'order',
            'linked_record_id' => $itemId
        ]);

        return [
            'item_id' => $itemId,
            'order' => $data['name'] ?? 'Unknown',
            'type' => $orderType,
            'status' => 'sent',
        ];
    }

    /**
     * Queue prior authorization
     */
    private function routePriorAuth(string $visitId, string $itemId, array $data): array
    {
        // Send to PA queue for processing
        
        DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->update([
                'execution_status' => 'queued',
                'routed_to' => 'pa_queue',
                'executed_at' => now(),
                'execution_result' => json_encode([
                    'status' => 'queued',
                    'queue' => 'prior_authorization',
                    'message' => 'Prior authorization queued for processing',
                ]),
                'updated_at' => now(),
            ]);

        // Create Patient Visit Item
        $this->createPatientVisitItem($visitId, 'prior_auth', [
            'title' => 'Insurance Approval: ' . ($data['procedure_name'] ?? 'Treatment'),
            'description' => 'We have sent a request to your insurance for approval.',
            'why_explanation' => 'Some treatments require direct authorization from your insurance provider.',
            'status' => 'pending',
            'linked_record_type' => 'prior_auth',
            'linked_record_id' => $itemId
        ]);

        return [
            'item_id' => $itemId,
            'procedure' => $data['procedure_name'] ?? 'Unknown',
            'status' => 'queued',
            'destination' => 'PA Queue',
        ];
    }

    /**
     * Route follow-up scheduling request
     */
    private function routeFollowUp(string $visitId, string $itemId, array $data): array
    {
        DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->update([
                'execution_status' => 'queued',
                'routed_to' => 'scheduling',
                'executed_at' => now(),
                'execution_result' => json_encode([
                    'status' => 'queued',
                    'message' => 'Follow-up scheduling requested',
                ]),
                'updated_at' => now(),
            ]);

        // Create Patient Visit Item
        $this->createPatientVisitItem($visitId, 'follow_up', [
            'title' => 'Follow-up Recommendation',
            'description' => "Plan for follow-up in {$data['timeframe']}.",
            'why_explanation' => 'Regular follow-ups ensure your treatment plan is working as intended.',
            'status' => 'pending',
            'linked_record_type' => 'follow_up',
            'linked_record_id' => $itemId
        ]);

        return [
            'item_id' => $itemId,
            'timeframe' => $data['timeframe'] ?? 'Unknown',
            'status' => 'queued',
            'destination' => 'Scheduling Queue',
        ];
    }

    /**
     * Route patient instruction
     */
    private function routeInstruction(string $visitId, string $itemId, array $data): array
    {
        // Create patient notification
        $visit = DB::table('scribemd_visits')->where('id', $visitId)->first();
        
        if ($visit) {
            DB::table('patient_notifications')->insert([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'patient_id' => $visit->patient_id,
                'source_type' => 'scribemd_visit',
                'source_id' => $visitId,
                'source_provider_id' => $visit->provider_id,
                'title' => 'New Care Instructions',
                'summary' => $data['instruction'] ?? 'You have new care instructions.',
                'patient_friendly_title' => $data['title'] ?? 'Care Instructions',
                'patient_friendly_summary' => $data['instruction'],
                'priority' => 'normal',
                'notification_type' => 'info',
                'created_at' => now(),
            ]);
        }

        DB::table('scribemd_dashboard_items')
            ->where('id', $itemId)
            ->update([
                'execution_status' => 'sent',
                'routed_to' => 'patient_portal',
                'executed_at' => now(),
                'updated_at' => now(),
            ]);

        return [
            'item_id' => $itemId,
            'status' => 'sent',
            'destination' => 'Patient Portal',
        ];
    }

    /**
     * Submit claim to clearinghouse
     */
    private function submitClaim(string $visitId): array
    {
        // In production: format and submit CMS-1500/837P to clearinghouse
        
        DB::table('scribemd_claims')
            ->where('visit_id', $visitId)
            ->update([
                'submitted_at' => now(),
                'submitted_to' => 'ChangeHealthcare', // Example clearinghouse
                'submission_result' => json_encode([
                    'status' => 'accepted',
                    'tracking_id' => 'CLM-' . time(),
                    'message' => 'Claim accepted for processing',
                ]),
                'updated_at' => now(),
            ]);

        return [
            'status' => 'submitted',
            'clearinghouse' => 'ChangeHealthcare',
            'tracking_id' => 'CLM-' . time(),
        ];
    }

    /**
     * Sign clinical note
     */
    private function signNote(string $visitId, ?string $signerId = null): array
    {
        $visit = DB::table('scribemd_visits')->where('id', $visitId)->first();
        $signerId = $signerId ?? $visit->provider_id ?? null;

        // Generate full note from SOAP components
        $note = DB::table('scribemd_notes')->where('visit_id', $visitId)->first();
        
        $fullNote = '';
        if ($note) {
            $fullNote = "## Subjective\n" . ($note->subjective ?? 'Not documented') . "\n\n";
            $fullNote .= "## Objective\n" . ($note->objective ?? 'Not documented') . "\n\n";
            $fullNote .= "## Assessment\n" . ($note->assessment ?? 'Not documented') . "\n\n";
            $fullNote .= "## Plan\n" . ($note->plan_text ?? 'Not documented');
        }

        DB::table('scribemd_notes')
            ->where('visit_id', $visitId)
            ->update([
                'full_note' => $fullNote,
                'is_signed' => true,
                'signed_at' => now(),
                'signed_by' => $signerId,
                'updated_at' => now(),
            ]);

        return [
            'status' => 'signed',
            'signed_by' => $signerId,
            'signed_at' => now()->toIso8601String(),
        ];
    }

    /**
     * Helper to create a patient-facing visit item
     */
    private function createPatientVisitItem(string $visitId, string $type, array $data): void
    {
        $visit = DB::table('scribemd_visits')->where('id', $visitId)->first();
        if (!$visit) return;

        DB::table('patient_visit_items')->insert([
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'patient_id' => $visit->patient_id,
            'visit_id' => $visitId,
            'item_type' => $type,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'why_explanation' => $data['why_explanation'] ?? null,
            'status' => $data['status'] ?? 'pending',
            'status_message' => $data['status_message'] ?? null,
            'linked_record_type' => $data['linked_record_type'] ?? null,
            'linked_record_id' => $data['linked_record_id'] ?? null,
            'available_actions' => json_encode($data['available_actions'] ?? []),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
