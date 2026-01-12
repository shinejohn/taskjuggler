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

class SyncActivityJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public array $integrationIds
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ActivitySyncService $syncService): void
    {
        $integrations = UrpaIntegration::whereIn('id', $this->integrationIds)
            ->where('status', 'connected')
            ->get();

        foreach ($integrations as $integration) {
            try {
                Log::info("Syncing activities for integration: {$integration->id}");

                $result = $syncService->syncIntegration($integration);

                Log::info("Activity sync completed for integration: {$integration->id}", [
                    'synced' => $result['synced'],
                    'errors' => $result['errors'],
                ]);
            } catch (\Exception $e) {
                Log::error("Activity sync failed for integration: {$integration->id}", [
                    'error' => $e->getMessage(),
                ]);

                $integration->markAsError($e->getMessage());
            }
        }
    }
}

