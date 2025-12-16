<?php

namespace App\Services;

use App\Modules\Core\Models\Profile;
use App\Modules\Core\Models\User;
use Illuminate\Support\Facades\Cache;

class ProfileContextService
{
    /**
     * Get the current profile for a user from session/cache
     */
    public function getCurrentProfile(User $user): ?Profile
    {
        $cacheKey = "user_{$user->id}_current_profile";
        
        $profileId = Cache::get($cacheKey);
        
        if ($profileId) {
            return Profile::where('id', $profileId)
                ->where('user_id', $user->id)
                ->first();
        }

        // Fall back to default profile
        return $user->defaultProfile();
    }

    /**
     * Set the current profile for a user
     */
    public function setCurrentProfile(User $user, Profile $profile): void
    {
        // Verify profile belongs to user
        if ($profile->user_id !== $user->id) {
            throw new \InvalidArgumentException('Profile does not belong to user');
        }

        $cacheKey = "user_{$user->id}_current_profile";
        Cache::put($cacheKey, $profile->id, now()->addDays(30));
    }

    /**
     * Get profile ID for query scoping
     */
    public function getCurrentProfileId(User $user): ?string
    {
        $profile = $this->getCurrentProfile($user);
        return $profile?->id;
    }

    /**
     * Scope a query to the current profile
     */
    public function scopeToProfile($query, User $user, ?string $profileId = null): void
    {
        $profileId = $profileId ?? $this->getCurrentProfileId($user);
        
        if ($profileId) {
            $query->where('profile_id', $profileId);
        }
    }
}

