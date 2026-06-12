<?php

declare(strict_types=1);

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AnalyticsController extends Controller
{
    public function __construct(
        private readonly AnalyticsService $analyticsService
    ) {
    }

    /**
     * Get analytics for organization
     * GET /api/coordinator/organizations/{orgId}/analytics
     */
    public function index(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        return response()->json(
            $this->analyticsService->getAnalytics($organization, $validated)
        );
    }
}
