<?php

namespace App\Services\Workflow\Executors;

use App\Modules\Workflows\Models\WorkflowExecution;
use App\Modules\Workflows\Models\WorkflowNode;

interface NodeExecutorInterface
{
    /**
     * Execute the node logic
     * 
     * @return array The output data to be merged into context
     */
    public function execute(WorkflowExecution $execution, WorkflowNode $node): array;
}
