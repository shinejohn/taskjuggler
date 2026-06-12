<?php

declare(strict_types=1);

namespace App\Modules\Processes\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Processes\Jobs\HandleProcessWebhook;
use App\Modules\Processes\Models\Process;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ProcessWebhookController extends Controller
{
    /**
     * Inbound webhook trigger for processes.
     * POST /api/webhooks/processes/{webhookId}
     *
     * Public endpoint: the webhook_id acts as the shared secret and is
     * only matched against active processes with a webhook trigger.
     */
    public function __invoke(Request $request, string $webhookId): JsonResponse
    {
        $exists = Process::where('status', 'active')
            ->where('trigger_type', 'webhook')
            ->whereJsonContains('trigger_config->webhook_id', $webhookId)
            ->exists();

        if (! $exists) {
            return response()->json(['message' => 'Unknown webhook'], 404);
        }

        HandleProcessWebhook::dispatch($webhookId, $request->all());

        return response()->json(['accepted' => true], 202);
    }
}
