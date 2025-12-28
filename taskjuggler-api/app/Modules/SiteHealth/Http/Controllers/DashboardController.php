<?php

namespace App\Modules\SiteHealth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\SiteHealth\Models\Site;
use App\Modules\SiteHealth\Models\Scan;
use App\Modules\SiteHealth\Models\Issue;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $userId = auth()->id();

        $totalSites = Site::where('user_id', $userId)->count();
        $totalScans = Scan::whereHas('site', fn($q) => $q->where('user_id', $userId))->count();
        $totalIssues = Issue::whereHas('site', fn($q) => $q->where('user_id', $userId))->count();

        $sites = Site::where('user_id', $userId)
            ->with(['latestScan'])
            ->get();

        $averageHealthScore = $sites->avg(fn($site) => $site->latestScan?->health_score ?? 0);
        $sitesNeedingAttention = $sites->filter(fn($site) => ($site->latestScan?->health_score ?? 0) < 70)->count();

        $recentScans = Scan::whereHas('site', fn($q) => $q->where('user_id', $userId))
            ->orderBy('started_at', 'desc')
            ->limit(10)
            ->with(['site'])
            ->get();

        return response()->json([
            'data' => [
                'total_sites' => $totalSites,
                'total_scans' => $totalScans,
                'total_issues' => $totalIssues,
                'average_health_score' => round($averageHealthScore, 2),
                'sites_needing_attention' => $sitesNeedingAttention,
                'recent_scans' => $recentScans,
                'sites' => $sites,
            ],
        ]);
    }
}
