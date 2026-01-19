<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TeamContext
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $teamId = $request->header('X-Team-ID');
        
        if (!$teamId) {
            // Use default team if not specified
            $user = $request->user();
            $teamId = $user->current_team_id 
                   ?? $user->teams()->first()?->id;
        }
        
        if (!$teamId) {
            return response()->json(['error' => 'No team context'], 400);
        }
        
        // Verify user has access to this team
        $team = \App\Modules\Core\Models\Team::find($teamId);
        
        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }
        
        // Check if user is a member of this team
        if (!$team->hasMember($request->user())) {
            return response()->json(['error' => 'Access denied to team'], 403);
        }
        
        // Set team context for this request
        $request->merge(['team_id' => $teamId]);
        app()->instance('current_team', $team);
        
        return $next($request);
    }
}



