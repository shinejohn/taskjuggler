<?php

namespace App\Services\Workflow\Executors;

use App\Modules\Workflows\Models\WorkflowExecution;
use App\Modules\Workflows\Models\WorkflowNode;
use App\Modules\Tasks\Models\Task;
use Illuminate\Support\Facades\Log;

class HumanReviewNodeExecutor implements NodeExecutorInterface
{
    public function execute(WorkflowExecution $execution, WorkflowNode $node): array
    {
        $config = $node->config;
        $context = $execution->context_data;
        
        $title = $this->substituteVariables($config['title'] ?? 'Workflow Review Task', $context);
        $description = $this->substituteVariables($config['description'] ?? '', $context);
        $priority = $config['priority'] ?? Task::PRIORITY_NORMAL;
        $assigneeId = $this->substituteVariables($config['assignee_id'] ?? '', $context);

        // Create Task
        $task = Task::create([
            'title' => $title,
            'description' => $description,
            'status' => Task::STATUS_PENDING,
            'priority' => $priority,
            'owner_id' => $assigneeId ?: null, // If explicit assignee
            'metadata' => [
                'workflow_execution_id' => $execution->id,
                'workflow_node_id' => $node->id,
                'source' => 'workflow_engine'
            ]
        ]);

        Log::info("Created Human Review Task", ['task_id' => $task->id, 'execution_id' => $execution->id]);

        // Signal to pause workflow
        return [
            'execution_status' => 'paused',
            'task_id' => $task->id,
            'task_status' => $task->status
        ];
    }

    private function substituteVariables(string $text, array $context): string
    {
        return preg_replace_callback('/\{\{\s*([\w\.]+)\s*\}\}/', function ($matches) use ($context) {
            $key = $matches[1];
            return data_get($context, $key, $matches[0]);
        }, $text);
    }
}
