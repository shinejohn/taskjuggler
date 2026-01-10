<?php

namespace App\Modules\Urpa\Jobs;

use App\Modules\Urpa\Models\UrpaIntegration;
use App\Modules\Urpa\Services\ActivitySyncService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncIntegrationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public UrpaIntegration $integration
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ActivitySyncService $syncService): void
    {
        try {
            Log::info("Starting sync for integration: {$this->integration->id}");

            $result = $syncService->syncIntegration($this->integration);

            Log::info("Sync completed for integration: {$this->integration->id}", [
                'synced' => $result['synced'],
                'errors' => $result['errors'],
            ]);
        } catch (\Exception $e) {
            Log::error("Sync job failed for integration: {$this->integration->id}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $this->integration->markAsError($e->getMessage());
            
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Sync job permanently failed for integration: {$this->integration->id}", [
            'error' => $exception->getMessage(),
        ]);

        $this->integration->markAsError('Sync job failed: ' . $exception->getMessage());
    }
}

