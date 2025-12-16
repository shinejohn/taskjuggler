<?php

namespace App\Modules\Core\Traits;

use App\Services\ProfileContextService;
use Illuminate\Http\Request;

trait ScopesToProfile
{
    /**
     * Scope a query to the current profile
     */
    protected function scopeToProfile($query, Request $request): void
    {
        $profileContext = app(ProfileContextService::class);
        $profileId = $profileContext->getCurrentProfileId($request->user());
        
        if ($profileId) {
            $query->where('profile_id', $profileId);
        }
    }

    /**
     * Get current profile ID for use in create operations
     */
    protected function getCurrentProfileId(Request $request): ?string
    {
        $profileContext = app(ProfileContextService::class);
        return $profileContext->getCurrentProfileId($request->user());
    }
}

