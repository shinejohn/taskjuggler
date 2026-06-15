<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Task;
use App\Modules\Communications\Services\MatrixService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class CreateMatrixRoomForTask implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $taskId
    ) {}

    public function handle(MatrixService $matrix): void
    {
        $task = Task::find($this->taskId);
        if ($task) {
            $matrix->ensureTaskRoom($task);
        }
    }
}
