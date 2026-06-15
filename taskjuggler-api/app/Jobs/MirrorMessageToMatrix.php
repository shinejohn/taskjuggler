<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Modules\Communications\Services\MatrixService;
use App\Modules\Tasks\Models\TaskMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class MirrorMessageToMatrix implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $messageId
    ) {}

    public function handle(MatrixService $matrix): void
    {
        $message = TaskMessage::find($this->messageId);
        if ($message) {
            $matrix->mirrorTaskMessage($message);
        }
    }
}
