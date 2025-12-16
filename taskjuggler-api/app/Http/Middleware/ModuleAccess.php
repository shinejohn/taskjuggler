<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ModuleAccess
{
    public function handle(Request $request, Closure $next, string $module): Response
    {
        if (!config("modules.enabled.{$module}", false)) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is not available.',
            ], 404);
        }

        if ($user = $request->user()) {
            $team = $user->currentTeam ?? null;
            if ($team) {
                $plan = $team->subscription?->plan ?? 'free';
                $allowed = config("modules.subscriptions.{$plan}", []);
                
                if (!in_array($module, $allowed)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Upgrade required to access this feature.',
                    ], 403);
                }
            }
        }

        return $next($request);
    }
}

