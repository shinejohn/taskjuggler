<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ScannerDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $team = app('current_team');
        
        $stats = [
            'total_sites' => DB::table('scanner_sites')
                ->where('team_id', $team->id)
                ->count(),
            'total_scans' => DB::table('scanner_scans')
                ->where('team_id', $team->id)
                ->count(),
            'total_issues' => DB::table('scanner_issues')
                ->where('team_id', $team->id)
                ->count(),
            'open_issues' => DB::table('scanner_issues')
                ->where('team_id', $team->id)
                ->where('status', 'open')
                ->count(),
            'average_health_score' => DB::table('scanner_sites')
                ->where('team_id', $team->id)
                ->avg('health_score') ?? 0,
            'sites_needing_attention' => DB::table('scanner_sites')
                ->where('team_id', $team->id)
                ->where('health_score', '<', 70)
                ->count(),
        ];
        
        return response()->json([
            'data' => $stats,
        ]);
    }
}



