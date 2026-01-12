<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\CallLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class CallLogController extends Controller
{
    /**
     * Get call history for organization
     * GET /api/coordinator/organizations/{orgId}/calls
     */
    public function index(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $query = CallLog::where('organization_id', $organization->id)
            ->with(['contact', 'coordinator']);

        // Search
        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('from_number', 'like', "%{$search}%")
                  ->orWhere('to_number', 'like', "%{$search}%")
                  ->orWhereHas('contact', function ($contactQuery) use ($search) {
                      $contactQuery->where('first_name', 'like', "%{$search}%")
                                   ->orWhere('last_name', 'like', "%{$search}%")
                                   ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        // Filters
        if ($request->has('coordinator_id')) {
            $query->where('coordinator_id', $request->query('coordinator_id'));
        }

        if ($request->has('direction')) {
            $query->where('direction', $request->query('direction'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('outcome')) {
            $query->where('outcome', 'like', "%{$request->query('outcome')}%");
        }

        // Date range
        if ($request->has('date_from')) {
            $query->whereDate('started_at', '>=', $request->query('date_from'));
        }

        if ($request->has('date_to')) {
            $query->whereDate('started_at', '<=', $request->query('date_to'));
        }

        // Default to last 30 days if no date range specified
        if (!$request->has('date_from') && !$request->has('date_to')) {
            $query->where('started_at', '>=', Carbon::now()->subDays(30));
        }

        // Pagination
        $perPage = $request->query('per_page', 15);
        $calls = $query->orderBy('started_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $calls->items(),
            'total' => $calls->total(),
            'page' => $calls->currentPage(),
            'per_page' => $calls->perPage(),
        ]);
    }

    /**
     * Get call by ID
     * GET /api/coordinator/organizations/{orgId}/calls/{id}
     */
    public function show(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $call = CallLog::where('id', $id)
            ->where('organization_id', $organization->id)
            ->with(['contact', 'coordinator'])
            ->firstOrFail();

        return response()->json($call);
    }

    /**
     * Get call statistics
     * GET /api/coordinator/organizations/{orgId}/calls/stats
     */
    public function getStats(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $today = Carbon::today();
        $dateFrom = $request->query('date_from', $today->copy()->subDays(30)->toDateString());
        $dateTo = $request->query('date_to', $today->toDateString());

        $query = CallLog::where('organization_id', $organization->id)
            ->whereBetween('started_at', [$dateFrom, Carbon::parse($dateTo)->endOfDay()]);

        // Apply same filters as index
        if ($request->has('coordinator_id')) {
            $query->where('coordinator_id', $request->query('coordinator_id'));
        }

        if ($request->has('direction')) {
            $query->where('direction', $request->query('direction'));
        }

        // Calls today
        $callsToday = CallLog::where('organization_id', $organization->id)
            ->whereDate('started_at', $today)
            ->count();

        // Average duration
        $avgDuration = $query->where('status', 'completed')
            ->avg('duration_seconds') ?? 0;

        // Booking rate (calls that resulted in appointments)
        $completedCallsQuery = CallLog::where('organization_id', $organization->id)
            ->whereBetween('started_at', [$dateFrom, Carbon::parse($dateTo)->endOfDay()])
            ->where('status', 'completed');
            
        if ($request->has('coordinator_id')) {
            $completedCallsQuery->where('coordinator_id', $request->query('coordinator_id'));
        }
        
        if ($request->has('direction')) {
            $completedCallsQuery->where('direction', $request->query('direction'));
        }
        
        $totalCompletedCalls = $completedCallsQuery->count();
        $bookedCalls = $completedCallsQuery->where(function ($q) {
                $q->where('outcome', 'like', '%booked%')
                  ->orWhere('outcome', 'like', '%appointment%');
            })
            ->count();

        $bookingRate = $totalCompletedCalls > 0 ? round(($bookedCalls / $totalCompletedCalls) * 100) : 0;

        // Total calls
        $totalCallsAll = $query->count();

        return response()->json([
            'calls_today' => $callsToday,
            'avg_duration' => round($avgDuration),
            'booking_rate' => $bookingRate,
            'total_calls' => $totalCallsAll,
        ]);
    }
}

