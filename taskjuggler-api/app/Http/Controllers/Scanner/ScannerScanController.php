<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use App\Models\Scanner\Site;
use App\Models\Scanner\Scan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScannerScanController extends Controller
{
    public function index(Request $request, Site $site): JsonResponse
    {
        $team = app('current_team');
        
        // Verify site belongs to team
        if ($site->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        $scans = Scan::where('site_id', $site->id)
            ->where('team_id', $team->id)
            ->with(['issues'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'data' => $scans,
        ]);
    }
    
    public function store(Request $request, Site $site): JsonResponse
    {
        $team = app('current_team');
        
        // Verify site belongs to team
        if ($site->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        $validated = $request->validate([
            'max_pages' => 'nullable|integer|min:1|max:1000',
        ]);
        
        $scan = Scan::create([
            'site_id' => $site->id,
            'team_id' => $team->id,
            'status' => 'pending',
            'started_at' => now(),
            'created_by' => $request->user()->id,
            'max_pages' => $validated['max_pages'] ?? $site->max_pages ?? 25,
        ]);
        
        // TODO: Dispatch job to process scan
        
        return response()->json([
            'data' => $scan->load(['site', 'team']),
        ], 201);
    }
    
    public function show(Scan $scan): JsonResponse
    {
        $team = app('current_team');
        
        // Verify scan belongs to team
        if ($scan->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        return response()->json([
            'data' => $scan->load(['site', 'issues', 'team']),
        ]);
    }
    
    public function report(Scan $scan): JsonResponse
    {
        $team = app('current_team');
        
        // Verify scan belongs to team
        if ($scan->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        $report = [
            'scan' => $scan->load(['site', 'team']),
            'issues' => $scan->issues()->get(),
            'summary' => [
                'total_issues' => $scan->issue_count,
                'health_score' => $scan->health_score,
                'pages_scanned' => $scan->pages_scanned,
                'total_pages' => $scan->total_pages,
                'category_scores' => $scan->category_scores,
            ],
        ];
        
        return response()->json([
            'data' => $report,
        ]);
    }
}

