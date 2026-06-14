<?php

namespace App\Jobs;

use App\Models\WorkflowExecution;
use App\WorkflowEngine\Engine;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExecuteWorkflow implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(public int $executionId) 
    {
        $this->onQueue('workflows');
    }

    public function handle(Engine $engine): void
    {
        $execution = WorkflowExecution::find($this->executionId);

        if (!$execution || $execution->status === 'cancelled') {
            return;
        }

        $engine->execute($execution);
    }

    public function failed(\Throwable $exception): void
    {
        $execution = WorkflowExecution::find($this->executionId);
        $execution?->markFailed("Job failed: {$exception->getMessage()}");
    }
}
