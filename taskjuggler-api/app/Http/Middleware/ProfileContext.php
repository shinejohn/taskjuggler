<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\ProfileContextService;
use Symfony\Component\HttpFoundation\Response;

class ProfileContext
{
    public function __construct(
        private ProfileContextService $profileContext
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Set profile context from header or query parameter
        if ($request->user()) {
            $profileId = $request->header('X-Profile-Id') ?? $request->query('profile_id');
            
            if ($profileId) {
                $profile = $request->user()->profiles()->find($profileId);
                if ($profile) {
                    $this->profileContext->setCurrentProfile($request->user(), $profile);
                }
            }
        }

        return $next($request);
    }
}

