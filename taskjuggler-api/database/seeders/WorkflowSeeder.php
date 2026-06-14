<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Workflows\Models\Workflow;
use App\Modules\Workflows\Models\WorkflowNode;
use App\Modules\Workflows\Models\WorkflowEdge;

class WorkflowSeeder extends Seeder
{
    public function run()
    {
        $this->seedPrescriptionRouting();
        $this->seedClaimsSubmission();
    }

    private function seedPrescriptionRouting()
    {
        $workflow = Workflow::create([
            'name' => 'Prescription Routing Standard',
            'slug' => 'prescription_routing',
            'trigger_event' => 'scribemd.prescription.created',
            'is_active' => true,
            'version' => 1,
            'input_schema' => [
                'type' => 'object',
                'properties' => [
                    'drug_name' => ['type' => 'string'],
                    'patient_id' => ['type' => 'string'],
                    'pharmacy_id' => ['type' => 'string']
                ]
            ]
        ]);

        // Node 1: Start (Log)
        $start = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'key' => 'start',
            'type' => 'database',
            'label' => 'Log Start',
            'config' => [
                'operation' => 'create',
                'table' => 'scribemd_dashboard_items', // Using existing table for now as audit text
                'data' => [
                    'visit_id' => '{{ visit_id }}', // context variable
                    'category' => 'instruction',
                    'item_data' => '{"instruction": "Started Rx Workflow for {{ drug_name }}"}',
                    'source' => 'workflow_engine'
                ]
            ]
        ]);

        // Node 2: Check Interactions (AI)
        $checkInteractions = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'key' => 'check_interactions',
            'type' => 'ai',
            'label' => 'Check Interactions',
            'config' => [
                'model' => 'openai/gpt-4o-mini',
                'prompt_template' => 'Analyze drug-drug interactions for {{ drug_name }} given patient history: {{ patient_history }}. Return JSON { "has_interaction": boolean, "warning": "string" }',
                'response_format' => 'json'
            ]
        ]);

        // Node 3: Send to Surescripts (Mock API)
        $sendRx = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'key' => 'send_to_surescripts',
            'type' => 'api',
            'label' => 'Submit to Surescripts',
            'config' => [
                'method' => 'POST',
                'url' => 'https://api.surescripts.mock/v1/prescriptions',
                'body' => [
                    'drug' => '{{ drug_name }}',
                    'patient' => '{{ patient_id }}',
                    'quantity' => '{{ quantity }}'
                ]
            ]
        ]);

        // Node 4: Update Dashboard Status
        $updateStatus = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'key' => 'update_status',
            'type' => 'database',
            'label' => 'Mark Sent',
            'config' => [
                'operation' => 'update',
                'table' => 'scribemd_dashboard_items',
                'id' => '{{ item_id }}',
                'data' => [
                    'execution_status' => 'sent', 
                    'routed_to' => 'Surescripts'
                ]
            ]
        ]);
        
        // Node 5: Alert Interaction (Database log for now)
        $alertInteraction = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'key' => 'alert_interaction',
            'type' => 'database',
            'label' => 'Alert Interaction',
            'config' => [
                'operation' => 'update',
                'table' => 'scribemd_dashboard_items',
                'id' => '{{ item_id }}',
                'data' => [
                    'execution_status' => 'warning',
                    'execution_result' => '{"warning": "{{ nodes.check_interactions.output.warning }}"}'
                ]
            ]
        ]);

        // EDGES
        // Start -> Check Interactions
        WorkflowEdge::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $start->id,
            'target_node_id' => $checkInteractions->id
        ]);
        
        // Check Interactions -> Send Rx (If no interaction)
        WorkflowEdge::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $checkInteractions->id,
            'target_node_id' => $sendRx->id,
            'condition_expression' => '{{ nodes.check_interactions.output.has_interaction }} == false',
            'label' => 'No Interaction'
        ]);

        // Check Interactions -> Alert (If interaction)
        WorkflowEdge::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $checkInteractions->id,
            'target_node_id' => $alertInteraction->id,
            'condition_expression' => '{{ nodes.check_interactions.output.has_interaction }} == true',
            'label' => 'Has Interaction'
        ]);
        
        // Send Rx -> Update Status
        WorkflowEdge::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $sendRx->id,
            'target_node_id' => $updateStatus->id
        ]);
    }

    private function seedClaimsSubmission()
    {
         $workflow = Workflow::create([
            'name' => 'Claims Submission Standard',
            'slug' => 'claims_submission',
            'trigger_event' => 'scribemd.claim.created',
            'is_active' => true,
            'version' => 1
        ]);
        
        $start = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'key' => 'start',
            'type' => 'database', // Log start
            'label' => 'Log Claim Start',
             'config' => [
                'operation' => 'create',
                'table' => 'scribemd_dashboard_items',
                'data' => [
                    'visit_id' => '{{ visit_id }}',
                    'category' => 'instruction',
                    'item_data' => '{"instruction": "Started Claim Workflow"}',
                ]
            ]
        ]);

        WorkflowEdge::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $start->id,
            'target_node_id' => $start->id // Loop/End for now
        ]);
    }
}
