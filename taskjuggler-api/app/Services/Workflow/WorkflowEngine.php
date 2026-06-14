<?php

namespace App\Services\Workflow;

use App\Modules\Workflows\Models\Workflow;
use App\Modules\Workflows\Models\WorkflowExecution;
use App\Modules\Workflows\Models\WorkflowNode;
use App\Modules\Workflows\Models\WorkflowLog;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WorkflowEngine
{
    public function __construct(
        protected NodeExecutorFactory $executorFactory
    ) {}

    /**
     * Start a new workflow execution
     */
    public function start(string $workflowSlug, array $payload = []): WorkflowExecution
    {
        $workflow = Workflow::where('slug', $workflowSlug)
            ->where('is_active', true)
            ->firstOrFail();

        // Check input schema if defined
        // TODO: Validate schema

        // Find start node (node with no incoming edges? or explicitly marked?)
        // For now, assume first node created or node with key 'start'
        $startNode = $workflow->nodes()->where('key', 'start')->first() 
            ?? $workflow->nodes()->orderBy('created_at')->first();

        if (!$startNode) {
            throw new \Exception("Workflow {$workflowSlug} has no start node.");
        }

        $execution = WorkflowExecution::create([
            'workflow_id' => $workflow->id,
            'trigger_source' => 'manual', // or passed in options
            'correlation_id' => (string) Str::uuid(),
            'status' => 'running',
            'current_node_id' => $startNode->id,
            'context_data' => $payload,
            'trigger_payload' => $payload,
            'started_at' => now(),
        ]);

        $this->runNodes($execution);

        return $execution;
    }

    /**
     * Resume a paused execution
     */
    public function resume(string $executionId, array $inputData = []): WorkflowExecution
    {
        $execution = WorkflowExecution::findOrFail($executionId);
        
        if ($execution->status !== 'paused') {
             // throw new \Exception("Cannot resume execution in status {$execution->status}");
             // Log warning but continue?
        }

        // Merge new input into context
        $context = $execution->context_data;
        $context = array_merge($context, $inputData);
        
        $execution->update([
            'status' => 'running',
            'context_data' => $context
        ]);

        $this->runNodes($execution);

        return $execution;
    }

    /**
     * Main execution loop
     */
    protected function runNodes(WorkflowExecution $execution): void
    {
        try {
            while ($execution->current_node_id && $execution->status === 'running') {
                $node = $execution->currentNode;
                
                if (!$node) {
                    break;
                }

                $this->processNode($execution, $node);
                
                // Refresh to get updated state
                $execution->refresh();
            }

            if (!$execution->current_node_id && $execution->status === 'running') {
                $execution->update([
                    'status' => 'completed',
                    'completed_at' => now()
                ]);
            }
        } catch (\Throwable $e) {
            $execution->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
            Log::error("Workflow Execution Failed: {$e->getMessage()}", ['execution_id' => $execution->id]);
            throw $e;
        }
    }

    /**
     * Process a single node
     */
    protected function processNode(WorkflowExecution $execution, WorkflowNode $node): void
    {
        $startTime = microtime(true);
        
        try {
            // 1. Log Start
            $log = WorkflowLog::create([
                'execution_id' => $execution->id,
                'node_id' => $node->id,
                'status' => 'started',
                'input_data' => $execution->context_data
            ]);

            // 2. Execute Logic
            $executor = $this->executorFactory->make($node->type);
            $output = $executor->execute($execution, $node);

            // Check for Pause Signal
            if (($output['execution_status'] ?? '') === 'paused') {
                $execution->update([
                    'status' => 'paused',
                    'context_data' => array_merge($execution->context_data, ['nodes' => [$node->key => $output]])
                ]);
                
                $log->update([
                    'status' => 'paused',
                    'output_data' => $output,
                    'duration_ms' => (microtime(true) - $startTime) * 1000
                ]);
                
                return; // Stop processing loop
            }

            // 3. Update Context
            $context = $execution->context_data;
            // Namespaced output? e.g. nodes.key.output
            $context['nodes'][$node->key] = $output;
            // Merge top level for convenience? Or keep strictly scoped?
            // Let's keep strict scope to avoid collisions, but maybe allow "result" key to merge
            if (isset($output['result_merge']) && is_array($output['result_merge'])) {
                 $context = array_merge($context, $output['result_merge']);
            }
            
            $execution->update(['context_data' => $context]);

            // 4. Log Success
            $log->update([
                'status' => 'completed',
                'output_data' => $output,
                'duration_ms' => (microtime(true) - $startTime) * 1000
            ]);

            // 5. Determine Next Node
            $nextNode = $this->determineNextNode($node, $context);
            
            $execution->update([
                'current_node_id' => $nextNode?->id
            ]);

        } catch (\Throwable $e) {
            if (isset($log)) {
                $log->update([
                    'status' => 'failed',
                    'message' => $e->getMessage(),
                    'duration_ms' => (microtime(true) - $startTime) * 1000
                ]);
            }
            throw $e;
        }
    }

    /**
     * Determine next node based on edges and logic
     */
    protected function determineNextNode(WorkflowNode $node, array $context): ?WorkflowNode
    {
        // 1. Check Edges with Conditions
        $edges = $node->outgoingEdges;
        
        foreach ($edges as $edge) {
            if ($edge->condition_expression) {
                if ($this->evaluateCondition($edge->condition_expression, $context)) {
                    return $edge->targetNode;
                }
            } else {
                // Unconditional edge (if multiple, ambiguity? take first)
                return $edge->targetNode;
            }
        }

        // 2. Fallback to `next_node_id` (Legacy/Simple linear)
        if ($node->next_node_id) {
            return $node->nextNode;
        }

        return null; // End of workflow
    }

    /**
     * Evaluate simple condition expression
     * Supports basic boolean logic: {{ variable }} == 'value'
     */
    protected function evaluateCondition(string $expression, array $context): bool
    {
        // This is a SECURITY RISK if using eval().
        // For secure implementation, use Symfony ExpressionLanguage or a simple parser.
        // For MVP, we will implement a very simple parser.
        
        // Matches: {{ var.path }} operator 'value'
        if (preg_match('/\{\{\s*([\w\.]+)\s*\}\}\s*([!=<>]+)\s*[\'"](.*)[\'"]/', $expression, $matches)) {
            $key = $matches[1];
            $operator = $matches[2];
            $targetValue = $matches[3];
            
            $actualValue = data_get($context, $key);
            
            return match ($operator) {
                '==' => $actualValue == $targetValue,
                '===' => $actualValue === $targetValue,
                '!=' => $actualValue != $targetValue,
                '!==' => $actualValue !== $targetValue,
                '>' => $actualValue > $targetValue,
                '<' => $actualValue < $targetValue,
                default => false,
            };
        }
        
        // Boolean check: {{ var.path }}
        if (preg_match('/\{\{\s*([\w\.]+)\s*\}\}/', $expression, $matches)) {
            $key = $matches[1];
            return (bool) data_get($context, $key);
        }

        return false;
    }
}
