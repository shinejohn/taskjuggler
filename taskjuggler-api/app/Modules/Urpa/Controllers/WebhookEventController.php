<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaWebhookEvent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WebhookEventController extends Controller
{
    /**
     * Get webhook events for user
     * GET /api/urpa/webhooks/events
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = UrpaWebhookEvent::where('user_id', $user->id)
            ->with('integration');

        // Filters
        if ($request->has('integration_id')) {
            $query->where('integration_id', $request->query('integration_id'));
        }

        if ($request->has('event')) {
            $query->where('event', $request->query('event'));
        }

        if ($request->has('status')) {
            if ($request->query('status') === 'delivered') {
                $query->whereNotNull('delivered_at');
            } elseif ($request->query('status') === 'failed') {
                $query->whereNull('delivered_at');
            }
        }

        // Date range
        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->query('date_from'));
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->query('date_to'));
        }

        // Pagination
        $perPage = $request->query('per_page', 50);
        $events = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $events->items(),
            'total' => $events->total(),
            'page' => $events->currentPage(),
            'per_page' => $events->perPage(),
        ]);
    }

    /**
     * Get webhook event by ID
     * GET /api/urpa/webhooks/events/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $event = UrpaWebhookEvent::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('integration')
            ->firstOrFail();

        return response()->json($event);
    }

    /**
     * Retry failed webhook event
     * POST /api/urpa/webhooks/events/{id}/retry
     */
    public function retry(Request $request, string $id): JsonResponse
    {
        $event = UrpaWebhookEvent::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($event->isDelivered()) {
            return response()->json([
                'error' => 'Webhook event already delivered',
            ], 400);
        }

        if (!$event->shouldRetry()) {
            return response()->json([
                'error' => 'Webhook event exceeded max retries',
            ], 400);
        }

        // Dispatch retry job
        dispatch(new \App\Modules\Urpa\Jobs\RetryWebhookJob($event->id));

        return response()->json([
            'message' => 'Webhook retry queued',
            'event' => $event->fresh(),
        ]);
    }
}

