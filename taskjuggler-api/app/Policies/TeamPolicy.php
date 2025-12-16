<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    /**
     * Can view team if member
     */
    public function view(User $user, Team $team): bool
    {
        return $team->hasMember($user);
    }

    /**
     * Can update team if admin
     */
    public function update(User $user, Team $team): bool
    {
        return $team->hasAdmin($user);
    }

    /**
     * Can delete team if admin
     */
    public function delete(User $user, Team $team): bool
    {
        return $team->hasAdmin($user);
    }
}
