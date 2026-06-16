<?php

declare(strict_types=1);

namespace App\Modules\Communications\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communications\Services\MatrixService;
use App\Modules\Communications\Support\MatrixWebhookAuth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MatrixWebhookController extends Controller
{
    public function __construct(
        private MatrixService $matrix
    ) {}

    /**
     * PUT /api/matrix/webhook/transactions/{txnId}
     * Matrix Application Service protocol (Dendrite → Laravel).
     */
    public function handleTransaction(Request $request, string $txnId): JsonResponse
    {
        if (MatrixWebhookAuth::missingProductionSecrets()) {
            return response()->json(['error' => 'Matrix webhook secrets not configured'], 503);
        }

        if (! MatrixWebhookAuth::appserviceAuthorized($request)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $events = $request->input('events', []);
        if (! is_array($events)) {
            return response()->json([]);
        }

        foreach ($events as $event) {
            if (is_array($event)) {
                $this->matrix->handleInboundMessage($event);
            }
        }

        // AS API expects empty JSON object on success
        return response()->json([]);
    }

    /**
     * POST /api/matrix/webhook — legacy custom webhook format
     */
    public function handle(Request $request): JsonResponse
    {
        if (MatrixWebhookAuth::missingProductionSecrets()) {
            return response()->json(['error' => 'Matrix webhook secrets not configured'], 503);
        }

        if (! MatrixWebhookAuth::legacyWebhookAuthorized($request)
            && ! MatrixWebhookAuth::appserviceAuthorized($request)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $events = $request->input('events', []);
        if (! is_array($events)) {
            return response()->json(['processed' => 0]);
        }

        $processed = 0;
        foreach ($events as $event) {
            if (! is_array($event)) {
                continue;
            }
            $this->matrix->handleInboundMessage($event);
            $processed++;
        }

        return response()->json(['processed' => $processed]);
    }
}
