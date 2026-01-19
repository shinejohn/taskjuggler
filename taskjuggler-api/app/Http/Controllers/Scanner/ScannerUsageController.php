<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ScannerUsageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $team = app('current_team');
        
        $usage = [
            'scans_this_month' => DB::table('scanner_scans')
                ->where('team_id', $team->id)
                ->where('created_at', '>=', now()->startOfMonth())
                ->count(),
            'ai_fixes_this_month' => DB::table('scanner_issues')
                ->where('team_id', $team->id)
                ->whereNotNull('fix_code')
                ->where('created_at', '>=', now()->startOfMonth())
                ->count(),
            'sites_count' => DB::table('scanner_sites')
                ->where('team_id', $team->id)
                ->count(),
        ];
        
        return response()->json([
            'data' => $usage,
        ]);
    }
}



