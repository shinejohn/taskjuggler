<?php

declare(strict_types=1);

namespace App\Modules\Processes\Jobs;

use App\Modules\Processes\Services\ProcessTriggerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class HandleProcessWebhook implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly string $webhookId,
        public readonly array $data,
    ) {
    }

    public function handle(ProcessTriggerService $triggerService): void
    {
        $triggerService->handleWebhook($this->webhookId, $this->data);
    }
}
