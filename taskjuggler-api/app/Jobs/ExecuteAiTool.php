<?php

namespace App\Jobs;

use App\Models\Task;
use App\Models\MarketplaceVendor;
use App\Services\Marketplace\AiToolExecutor;
use App\Services\Notifications\NotificationService;
use App\Events\AiToolCompleted;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ExecuteAiTool implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 minutes
    public $tries = 3;

    public function __construct(
        public Task $task,
        public MarketplaceVendor $vendor,
    ) {}

    public function handle(
        AiToolExecutor $executor,
        NotificationService $notifications,
    ): void {
        $execution = $executor->execute($this->task, $this->vendor);

        // Dispatch event
        event(new AiToolCompleted($execution));

        // Notify requestor of completion
        $notifications->sendTaskNotification($this->task->requestor, 'completed', [
            'id' => $this->task->id,
            'title' => $this->task->title,
        ]);
    }

    public function failed(\Throwable $e): void
    {
        // Log failure and notify owner
        Log::error("AI Tool execution failed for task {$this->task->id}: {$e->getMessage()}");
        
        $this->task->update([
            'status' => Task::STATUS_PENDING,
            'metadata' => array_merge($this->task->metadata ?? [], [
                'ai_execution_error' => $e->getMessage(),
            ]),
        ]);

        // Notify requestor of failure
        $notifications = app(NotificationService::class);
        $notifications->sendTaskNotification($this->task->requestor, 'failed', [
            'id' => $this->task->id,
            'title' => $this->task->title,
            'error' => $e->getMessage(),
        ]);
    }
}
