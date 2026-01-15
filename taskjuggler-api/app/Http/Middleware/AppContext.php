<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppContext
{
    /**
     * Valid app contexts
     */
    private const VALID_CONTEXTS = [
        'urpa',
        'scanner',
        'ideacircuit',
        'taskjuggler',
        'projects',
        'process',
        'coordinator',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $appContext = $request->header('X-App-Context');

        // For auth endpoints (login/register), app context is required
        if ($request->is('api/auth/login') || $request->is('api/auth/register')) {
            if (!$appContext) {
                return response()->json([
                    'error' => 'X-App-Context header is required',
                    'message' => 'Please specify which application you are logging into.',
                ], 400);
            }

            if (!in_array($appContext, self::VALID_CONTEXTS, true)) {
                return response()->json([
                    'error' => 'Invalid app context',
                    'message' => 'The specified app context is not valid.',
                    'valid_contexts' => self::VALID_CONTEXTS,
                ], 400);
            }

            // Store app context in request for later use
            $request->merge(['app_context' => $appContext]);
        }

        // For authenticated endpoints, validate token's app context matches header
        if ($request->user() && $appContext) {
            $token = $request->user()->currentAccessToken();
            
            if ($token) {
                // Extract app context from token name (format: "auth-token-{app_context}")
                $tokenName = $token->name ?? '';
                $tokenAppContext = null;
                
                if (preg_match('/^auth-token-(.+)$/', $tokenName, $matches)) {
                    $tokenAppContext = $matches[1];
                } else {
                    // Legacy tokens without app context - allow but warn
                    // For backward compatibility, allow if no app context in token name
                    return $next($request);
                }
                
                if ($tokenAppContext && $tokenAppContext !== $appContext) {
                    return response()->json([
                        'error' => 'App context mismatch',
                        'message' => 'This token is for a different application. Please log in again.',
                        'token_app' => $tokenAppContext,
                        'request_app' => $appContext,
                    ], 403);
                }
            }
        }

        return $next($request);
    }
}

