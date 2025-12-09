<?php

namespace App\Policies;

use App\Models\TeamMember;
use App\Models\User;

class TeamMemberPolicy
{
    public function view(User $user, TeamMember $teamMember): bool
    {
        return $teamMember->owner_id === $user->id;
    }

    public function update(User $user, TeamMember $teamMember): bool
    {
        return $teamMember->owner_id === $user->id;
    }

    public function delete(User $user, TeamMember $teamMember): bool
    {
        return $teamMember->owner_id === $user->id;
    }
}
