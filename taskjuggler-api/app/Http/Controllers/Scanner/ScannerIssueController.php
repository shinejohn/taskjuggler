<?php

namespace App\Http\Controllers\Scanner;

use App\Http\Controllers\Controller;
use App\Models\Scanner\Issue;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScannerIssueController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $team = app('current_team');
        
        $query = Issue::where('team_id', $team->id)
            ->with(['scan', 'site']);
        
        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }
        
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        if ($request->has('site_id')) {
            $query->where('site_id', $request->site_id);
        }
        
        $issues = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 50));
        
        return response()->json([
            'data' => $issues->items(),
            'meta' => [
                'current_page' => $issues->currentPage(),
                'last_page' => $issues->lastPage(),
                'per_page' => $issues->perPage(),
                'total' => $issues->total(),
            ],
        ]);
    }
    
    public function show(Issue $issue): JsonResponse
    {
        $team = app('current_team');
        
        // Verify issue belongs to team
        if ($issue->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        return response()->json([
            'data' => $issue->load(['scan', 'site', 'task']),
        ]);
    }
    
    public function update(Request $request, Issue $issue): JsonResponse
    {
        $team = app('current_team');
        
        if ($issue->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        $validated = $request->validate([
            'status' => 'sometimes|in:open,resolved,ignored',
            'task_id' => 'sometimes|nullable|exists:tasks,id',
        ]);
        
        $issue->update($validated);
        
        return response()->json([
            'data' => $issue->fresh()->load(['scan', 'site', 'task']),
        ]);
    }
    
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'issue_ids' => 'required|array',
            'issue_ids.*' => 'required|integer',
            'status' => 'required|in:open,resolved,ignored',
        ]);
        
        $team = app('current_team');
        
        $updated = Issue::where('team_id', $team->id)
            ->whereIn('id', $validated['issue_ids'])
            ->update(['status' => $validated['status']]);
        
        return response()->json([
            'message' => "Updated {$updated} issues",
            'updated_count' => $updated,
        ]);
    }
    
    public function generateFix(Issue $issue): JsonResponse
    {
        $team = app('current_team');
        
        if ($issue->team_id !== $team->id) {
            return response()->json(['error' => 'Not found'], 404);
        }
        
        // TODO: Call AI service to generate fix
        // For now, return a placeholder response
        
        return response()->json([
            'message' => 'Fix generation not yet implemented',
            'data' => $issue,
        ]);
    }
}



