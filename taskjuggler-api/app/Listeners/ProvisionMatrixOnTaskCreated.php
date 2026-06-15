<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\TaskCreated;
use App\Jobs\CreateMatrixRoomForTask;
use App\Jobs\RegisterMatrixUser;
use App\Modules\Communications\Services\MatrixService;

final class ProvisionMatrixOnTaskCreated
{
    public function __construct(
        private MatrixService $matrix
    ) {}

    public function handle(TaskCreated $event): void
    {
        if (! $this->matrix->isEnabled()) {
            return;
        }

        $task = $event->task;

        if ($task->requestor_id) {
            RegisterMatrixUser::dispatch($task->requestor_id);
        }

        if ($task->owner_id && $task->owner_id !== $task->requestor_id) {
            RegisterMatrixUser::dispatch($task->owner_id);
        }

        CreateMatrixRoomForTask::dispatch($task->id);
    }
}
