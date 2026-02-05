<?php

namespace App\Services\Process;

use App\Models\Process;
use App\Models\ProcessExecution;
use App\Models\ProcessStep;
use App\Models\Task;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ProcessExecutionService
{
    /**
     * Execute a process
     */
    public function execute(Process $process, array $context = []): ProcessExecution
    {
        if (!$process->canExecute()) {
            throw new \Exception('Process cannot be executed. It must be active and have steps.');
        }

        // Create execution record
        $execution = ProcessExecution::create([
            'process_id' => $process->id,
            'task_id' => $context['task_id'] ?? null,
            'project_id' => $context['project_id'] ?? $process->project_id,
            'status' => 'pending',
            'execution_data' => $context,
        ]);

        try {
            // Start execution
            $execution->start();

            // Get steps in order
            $steps = $process->steps()->orderBy('order')->get();
            $stepResults = [];

            // Execute each step
            foreach ($steps as $step) {
                $execution->current_step_order = $step->order;
                $execution->save();

                try {
                    $result = $this->executeStep($step, $context, $execution);
                    $stepResults[] = [
                        'step_id' => $step->id,
                        'step_order' => $step->order,
                        'step_type' => $step->step_type,
                        'status' => 'completed',
                        'result' => $result,
                    ];
                } catch (\Exception $e) {
                    Log::error('Process step execution failed', [
                        'execution_id' => $execution->id,
                        'step_id' => $step->id,
                        'error' => $e->getMessage(),
                    ]);

                    $stepResults[] = [
                        'step_id' => $step->id,
                        'step_order' => $step->order,
                        'step_type' => $step->step_type,
                        'status' => 'failed',
                        'error' => $e->getMessage(),
                    ];

                    // Decide whether to continue or fail
                    $config = $step->config ?? [];
                    if ($config['stop_on_error'] ?? true) {
                        throw $e;
                    }
                }
            }

            // Complete execution
            $execution->complete($stepResults);

        } catch (\Exception $e) {
            $execution->fail($e->getMessage());
            throw $e;
        }

        return $execution->fresh();
    }

    /**
     * Execute a single step
     */
    protected function executeStep(ProcessStep $step, array $context, ProcessExecution $execution): array
    {
        $stepType = $step->step_type;
        $config = $step->config ?? [];

        return match ($stepType) {
            'action' => $this->executeActionStep($step, $context, $execution),
            'condition' => $this->executeConditionStep($step, $context, $execution),
            'delay' => $this->executeDelayStep($step, $context, $execution),
            'notification' => $this->executeNotificationStep($step, $context, $execution),
            'webhook' => $this->executeWebhookStep($step, $context, $execution),
            'create_task' => $this->executeCreateTaskStep($step, $context, $execution),
            'update_task' => $this->executeUpdateTaskStep($step, $context, $execution),
            default => throw new \Exception("Unknown step type: {$stepType}"),
        };
    }

    /**
     * Execute action step (generic action)
     */
    protected function executeActionStep(ProcessStep $step, array $context, ProcessExecution $execution): array
    {
        $config = $step->config ?? [];
        $action = $config['action'] ?? null;

        if (!$action) {
            throw new \Exception('Action step requires an action in config');
        }

        // Execute the specified action
        $result = match ($action) {
            'log' => $this->executeLogAction($config, $context, $execution),
            'update_status' => $this->executeUpdateStatusAction($config, $context, $execution),
            default => throw new \Exception("Unknown action: {$action}"),
        };

        return [
            'action' => $action,
            'completed' => true,
            'result' => $result,
        ];
    }

    protected function executeLogAction(array $config, array $context, ProcessExecution $execution): array
    {
        $message = $config['message'] ?? 'Process step executed';
        Log::info('Process Action: ' . $message, [
            'execution_id' => $execution->id,
            'context' => $context,
        ]);
        return ['logged' => true, 'message' => $message];
    }

    protected function executeUpdateStatusAction(array $config, array $context, ProcessExecution $execution): array
    {
        $status = $config['status'] ?? null;
        if (!$status) {
            throw new \Exception('Update status action requires status in config');
        }
        // Update execution status based on config
        if (in_array($status, ['pending', 'running', 'completed', 'failed', 'cancelled'])) {
            $execution->status = $status;
            $execution->save();
        }
        return ['status_updated' => true, 'new_status' => $status];
    }

    /**
     * Execute condition step (if/then logic)
     */
    protected function executeConditionStep(ProcessStep $step, array $context, ProcessExecution $execution): array
    {
        $config = $step->config ?? [];
        $condition = $config['condition'] ?? null;
        $value = $this->evaluateCondition($condition, $context);

        return [
            'condition' => $condition,
            'result' => $value,
        ];
    }

    /**
     * Execute delay step
     */
    protected function executeDelayStep(ProcessStep $step, array $context, ProcessExecution $execution): array
    {
        $config = $step->config ?? [];
        $delay = $config['delay_seconds'] ?? 0;

        if ($delay > 0) {
            sleep(min($delay, 60)); // Max 60 seconds delay
        }

        return [
            'delay_seconds' => $delay,
            'completed' => true,
        ];
    }

    /**
     * Execute notification step
     */
    protected function executeNotificationStep(ProcessStep $step, array $context, ProcessExecution $execution): array
    {
        $config = $step->config ?? [];
        $recipients = $config['recipients'] ?? [];
        $subject = $config['subject'] ?? 'Process Notification';
        $message = $config['message'] ?? 'A process step has been executed';

        if (empty($recipients)) {
            throw new \Exception('Notification step requires recipients in config');
        }

        $sent = [];
        foreach ($recipients as $recipient) {
            try {
                $userId = is_string($recipient) ? $this->findUserId($recipient) : $recipient;
                if (!$userId) {
                    continue;
                }

                // Create notification record
                \App\Models\Notification::create([
                    'user_id' => $userId,
                    'organization_id' => $execution->process->organization_id,
                    'type' => 'process_notification',
                    'data' => [
                        'process_id' => $execution->process_id,
                        'execution_id' => $execution->id,
                        'subject' => $subject,
                        'message' => $message,
                    ],
                ]);
                $sent[] = $recipient;
            } catch (\Exception $e) {
                Log::error('Failed to send notification', [
                    'recipient' => $recipient,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return [
            'notification_sent' => count($sent) > 0,
            'recipients' => $sent,
            'total' => count($recipients),
        ];
    }

    protected function findUserId(string $identifier): ?string
    {
        // Try to find user by email or ID
        $user = \App\Models\User::where('email', $identifier)
            ->orWhere('id', $identifier)
            ->first();
        return $user?->id;
    }

    /**
     * Execute webhook step
     */
    protected function executeWebhookStep(ProcessStep $step, array $context, ProcessExecution $execution): array
    {
        $config = $step->config ?? [];
        $url = $config['url'] ?? null;
        $method = strtoupper($config['method'] ?? 'POST');
        $headers = $config['headers'] ?? [];
        $body = $config['body'] ?? [];

        if (!$url) {
            throw new \Exception('Webhook URL not configured');
        }

        try {
            $payload = array_merge($body, [
                'execution_id' => $execution->id,
                'process_id' => $execution->process_id,
                'context' => $context,
            ]);

            $httpClient = Http::timeout($config['timeout'] ?? 10)
                ->withHeaders(array_merge([
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'Fibonacco-AI-Platform/1.0',
                ], $headers));

            $response = match (strtoupper($method)) {
                'POST' => $httpClient->post($url, $payload),
                'PUT' => $httpClient->put($url, $payload),
                'PATCH' => $httpClient->patch($url, $payload),
                'GET' => $httpClient->get($url, $payload),
                'DELETE' => $httpClient->delete($url, $payload),
                default => throw new \Exception("Unsupported HTTP method: {$method}"),
            };

            if (!$response->successful()) {
                throw new \Exception("Webhook returned status {$response->status()}");
            }

            return [
                'webhook_called' => true,
                'url' => $url,
                'method' => $method,
                'status_code' => $response->status(),
                'response' => $response->json(),
            ];
        } catch (\Exception $e) {
            Log::error('Webhook call failed', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);
            throw new \Exception("Webhook call failed: {$e->getMessage()}");
        }
    }

    /**
     * Execute create task step
     */
    protected function executeCreateTaskStep(ProcessStep $step, array $context, ProcessExecution $execution): array
    {
        $config = $step->config ?? [];

        $requestorId = $context['user_id'] ?? $execution->process->organization->users()->first()?->id;
        if (!$requestorId) {
            throw new \Exception('Cannot create task: no requestor ID available');
        }

        $task = Task::create([
            'organization_id' => $execution->process->organization_id,
            'project_id' => $execution->project_id ?? $config['project_id'] ?? null,
            'requestor_id' => $requestorId,
            'title' => $config['title'] ?? 'Task from Process',
            'description' => $config['description'] ?? null,
            'state' => \App\Enums\TaskState::PENDING,
            'source_channel' => \App\Enums\TaskChannel::WEB,
            'priority' => \App\Enums\TaskPriority::from($config['priority'] ?? 'medium'),
            'due_date' => $config['due_date'] ?? null,
        ]);

        return [
            'task_created' => true,
            'task_id' => $task->id,
        ];
    }

    /**
     * Execute update task step
     */
    protected function executeUpdateTaskStep(ProcessStep $step, array $context, ProcessExecution $execution): array
    {
        $config = $step->config ?? [];
        $taskId = $config['task_id'] ?? $context['task_id'] ?? null;

        if (!$taskId) {
            throw new \Exception('Task ID required for update task step');
        }

        $task = Task::findOrFail($taskId);

        // Verify task belongs to same organization
        if ($task->organization_id !== $execution->process->organization_id) {
            throw new \Exception('Task does not belong to the same organization');
        }

        $updates = $config['updates'] ?? [];
        if (empty($updates)) {
            throw new \Exception('Update task step requires updates in config');
        }

        // Validate enum fields
        if (isset($updates['state'])) {
            $updates['state'] = \App\Enums\TaskState::from($updates['state']);
        }
        if (isset($updates['priority'])) {
            $updates['priority'] = \App\Enums\TaskPriority::from($updates['priority']);
        }
        if (isset($updates['source_channel'])) {
            $updates['source_channel'] = \App\Enums\TaskChannel::from($updates['source_channel']);
        }

        $task->update($updates);

        return [
            'task_updated' => true,
            'task_id' => $task->id,
        ];
    }

    /**
     * Evaluate a condition
     */
    protected function evaluateCondition($condition, array $context): bool
    {
        if (!$condition) {
            return true;
        }

        // Support both string conditions and array-based conditions
        if (is_string($condition)) {
            return $this->evaluateStringCondition($condition, $context);
        }

        if (is_array($condition)) {
            $field = $condition['field'] ?? null;
            $operator = $condition['operator'] ?? 'equals';
            $value = $condition['value'] ?? null;

            if (!$field) {
                return true;
            }

            $fieldValue = $this->getFieldValue($field, $context);

            return match ($operator) {
                'equals' => $fieldValue === $value,
                'not_equals' => $fieldValue !== $value,
                'contains' => is_string($fieldValue) && str_contains(strtolower($fieldValue), strtolower($value)),
                'greater_than' => is_numeric($fieldValue) && $fieldValue > $value,
                'less_than' => is_numeric($fieldValue) && $fieldValue < $value,
                'in' => in_array($fieldValue, (array) $value, true),
                'not_in' => !in_array($fieldValue, (array) $value, true),
                'exists' => !empty($fieldValue),
                'not_exists' => empty($fieldValue),
                default => false,
            };
        }

        return true;
    }

    protected function evaluateStringCondition(string $condition, array $context): bool
    {
        // Simple evaluation for common patterns
        // Example: "task.priority == 'high'" or "context.user_id exists"
        if (str_contains($condition, '==')) {
            [$left, $right] = explode('==', $condition, 2);
            $left = trim($left);
            $right = trim($right, " '\"");
            $leftValue = $this->getFieldValue($left, $context);
            return $leftValue == $right;
        }

        if (str_contains($condition, '!=')) {
            [$left, $right] = explode('!=', $condition, 2);
            $left = trim($left);
            $right = trim($right, " '\"");
            $leftValue = $this->getFieldValue($left, $context);
            return $leftValue != $right;
        }

        if (str_contains($condition, 'exists')) {
            $field = trim(str_replace('exists', '', $condition));
            $value = $this->getFieldValue($field, $context);
            return !empty($value);
        }

        // Default: evaluate as boolean expression
        return (bool) $condition;
    }

    protected function getFieldValue(string $field, array $context): mixed
    {
        // Support dot notation: "task.priority" or "context.user_id"
        if (str_contains($field, '.')) {
            [$prefix, $key] = explode('.', $field, 2);
            if ($prefix === 'context') {
                return $context[$key] ?? null;
            }
            if ($prefix === 'task' && isset($context['task_id'])) {
                $task = Task::find($context['task_id']);
                return $task?->{$key} ?? null;
            }
            if ($prefix === 'execution') {
                // Access execution data
                return $context['execution'][$key] ?? null;
            }
        }

        return $context[$field] ?? null;
    }
}
