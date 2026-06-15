<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\TaskUpdated;
use App\Modules\Urpa\Services\TaskJugglerSyncService;

final class SyncTaskToUrpaOnUpdate
{
    public function __construct(
        private TaskJugglerSyncService $syncService
    ) {}

    public function handle(TaskUpdated $event): void
    {
        $this->syncService->syncTaskUpdateToUrpa($event->task);
    }
}
