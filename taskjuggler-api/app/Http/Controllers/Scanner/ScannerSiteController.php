<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use App\Models\Scanner\Site;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScannerSiteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $team = app('current_team');
        
        $sites = Site::where('team_id', $team->id)
            ->with(['latestScan'])
            ->get();
        
        return response()->json([
            'data' => $sites,
        ]);
    }
    
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'auth_type' => 'nullable|in:none,basic,cookie,header',
            'auth_config' => 'nullable|array',
            'max_pages' => 'nullable|integer|min:1|max:1000',
        ]);
        
        $team = app('current_team');
        
        $site = Site::create([
            'team_id' => $team->id,
            'name' => $validated['name'],
            'url' => $validated['url'],
            'auth_type' => $validated['auth_type'] ?? 'none',
            'auth_config' => $validated['auth_config'] ?? [],
            'max_pages' => $validated['max_pages'] ?? 25,
        ]);
        
        return response()->json([
            'data' => $site->load('team'),
        ], 201);
    }
    
    public function show(Site $site): JsonResponse
    {
        $team = app('current_team');
        
        // Verify site belongs to team
        if ($site->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        return response()->json([
            'data' => $site->load(['scans', 'issues']),
        ]);
    }
    
    public function update(Request $request, Site $site): JsonResponse
    {
        $team = app('current_team');
        
        if ($site->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'url' => 'sometimes|url',
            'auth_type' => 'sometimes|in:none,basic,cookie,header',
            'auth_config' => 'sometimes|array',
            'max_pages' => 'sometimes|integer|min:1|max:1000',
        ]);
        
        $site->update($validated);
        
        return response()->json([
            'data' => $site->fresh(),
        ]);
    }
    
    public function destroy(Site $site): JsonResponse
    {
        $team = app('current_team');
        
        if ($site->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        $site->delete();
        
        return response()->json(null, 204);
    }
}

