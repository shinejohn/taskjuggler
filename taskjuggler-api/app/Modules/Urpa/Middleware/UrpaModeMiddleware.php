<?php

namespace App\Modules\Urpa\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Modules\Urpa\Models\UrpaModeSettings;
use App\Modules\Urpa\Models\UrpaHipaaAuditLog;
use Illuminate\Support\Facades\Auth;

class UrpaModeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|null  $requiredMode
     */
    public function handle(Request $request, Closure $next, ?string $requiredMode = null): Response
    {
        $user = Auth::user();

        // 1. Get Current Mode from User Settings (or Session/Header)
        $settings = UrpaModeSettings::firstOrCreate(
            ['user_id' => $user->id],
            ['current_mode' => 'practice']
        );
        $currentMode = $settings->current_mode;

        // 2. Check Access
        if ($requiredMode && $requiredMode !== $currentMode && $currentMode !== 'all') {
            return response()->json([
                'error' => 'MODE_MISMATCH',
                'message' => "This resource requires {$requiredMode} mode. Current mode is {$currentMode}.",
                'required_mode' => $requiredMode,
                'current_mode' => $currentMode,
                'suggest_switch' => true
            ], 403);
        }

        // 3. HIPAA Audit Logging for Practice Mode
        if ($currentMode === 'practice') {
            UrpaHipaaAuditLog::logPHIAccess(
                $user->id,
                $request->path(),
                0, // Resource ID if available
                [
                    'method' => $request->method(),
                    'query' => $request->query(),
                ],
                $request->ip(),
                $request->userAgent()
            );
        }

        return $next($request);
    }
}
