<?php

namespace App\WorkflowEngine;

use App\Models\WorkflowDefinition;
use App\Models\WorkflowExecution;
use App\Models\WorkflowStepLog;
use Illuminate\Support\Facades\Log;

class Engine
{
    public function __construct(
        protected ActionRegistry $actionRegistry,
        protected ConditionEvaluator $conditionEvaluator,
        protected DataMapper $dataMapper,
    ) {}

    public function handleEvent(
        string $eventKey,
        array $payload,
        ?int $organizationId = null,
        ?int $triggeredById = null,
        ?string $correlationId = null,
    ): array {
        $executionIds = [];

        // Find matching definitions
        $query = WorkflowDefinition::query()
            ->active()
            ->forEvent($eventKey)
            ->orderBy('priority', 'desc');
            
        if ($organizationId) {
             $query->where('organization_id', $organizationId);
        }

        $definitions = $query->get();

        foreach ($definitions as $definition) {
            // Trigger Conditions
            if (!$this->conditionEvaluator->evaluate($definition->trigger_conditions ?? [], $payload)) {
                continue;
            }

            // Concurrency Check
            $activeCount = $definition->executions()
                ->whereIn('status', ['pending', 'running'])
                ->count();
            if ($activeCount >= $definition->max_concurrent) {
                Log::warning("Workflow {$definition->id} skipped - max concurrent reached");
                continue;
            }

            // Create Execution
            $execution = WorkflowExecution::create([
                'organization_id' => $organizationId,
                'definition_id' => $definition->id,
                'trigger_event' => $eventKey,
                'trigger_payload' => $payload,
                'correlation_id' => $correlationId,
                'triggered_by_id' => $triggeredById,
                'status' => 'pending',
                'current_step' => 0,
                'total_steps' => count($definition->steps ?? []),
                'context' => [],
                'max_retries' => 3,
            ]);

            // Dispatch Async Job
            dispatch(new \App\Jobs\ExecuteWorkflow($execution->id));

            $executionIds[] = $execution->id;
        }

        return $executionIds;
    }

    public function execute(WorkflowExecution $execution): void
    {
        $execution->markRunning();
        $definition = $execution->definition;
        $steps = $definition->steps ?? [];

        // Linear Step Processing
        foreach ($steps as $index => $stepDef) {
            $stepNumber = $index + 1;

            // Skip completed steps (resume logic)
            if ($stepNumber <= $execution->current_step) {
                continue;
            }
            
            // Create Log
            $stepLog = WorkflowStepLog::create([
                'execution_id' => $execution->id,
                'step_number' => $stepNumber,
                'step_name' => $stepDef['name'] ?? "Step {$stepNumber}",
                'action' => $stepDef['action'],
                'status' => 'pending',
            ]);

            // Step Conditions
            if (!empty($stepDef['conditions'])) {
                $conditionContext = [
                    'trigger' => $execution->trigger_payload,
                    'context' => $execution->context,
                ];
                if (!$this->conditionEvaluator->evaluateStepConditions($stepDef['conditions'], $conditionContext)) {
                    $stepLog->markSkipped();
                    $execution->advanceStep();
                    continue;
                }
            }
            
            // Resolve Input
            try {
                $input = $this->dataMapper->resolve(
                    $stepDef['input_map'] ?? [],
                    $execution->trigger_payload ?? [],
                    $execution->context ?? [],
                    $execution->stepLogs->pluck('output', 'step_number')->toArray(),
                    $execution->organization_id
                );
                $stepLog->update(['input' => $input]);
            } catch (\Throwable $e) {
                $stepLog->markFailed("Data mapping failed: {$e->getMessage()}");
                $execution->markFailed("Step {$stepNumber} mapping failed");
                return;
            }

            // Execute Action
            $stepLog->markRunning();
            try {
                $output = $this->actionRegistry->execute($stepDef['action'], $input);
                $stepLog->markCompleted($output);

                // Map Output to Context
                 if (!empty($stepDef['output_map'])) {
                    $contextUpdate = [];
                    foreach ($stepDef['output_map'] as $contextKey => $outputPath) {
                        $contextUpdate[$contextKey] = data_get($output, $outputPath);
                    }
                    $execution->mergeContext($contextUpdate);
                }

                $execution->advanceStep();

            } catch (\Throwable $e) {
                // Simplified error handling for now (fail immediately)
                $stepLog->markFailed($e->getMessage(), ['trace' => $e->getTraceAsString()]);
                $execution->markFailed("Step {$stepNumber} failed: {$e->getMessage()}");
                return;
            }
        }

        $execution->markCompleted();
    }
}
