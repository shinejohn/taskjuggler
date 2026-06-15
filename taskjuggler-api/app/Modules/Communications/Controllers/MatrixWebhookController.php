<?php

declare(strict_types=1);

namespace App\Modules\Communications\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communications\Services\MatrixService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MatrixWebhookController extends Controller
{
    public function __construct(
        private MatrixService $matrix
    ) {}

    /**
     * POST /api/matrix/webhook — inbound message events from appservice / bridge
     */
    public function handle(Request $request): JsonResponse
    {
        $secret = config('matrix.webhook_secret');
        if ($secret && $request->header('X-Matrix-Webhook-Secret') !== $secret) {
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
