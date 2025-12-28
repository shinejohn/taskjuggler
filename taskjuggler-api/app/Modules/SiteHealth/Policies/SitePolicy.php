<?php

namespace App\Modules\SiteHealth\Policies;

use App\Models\User;
use App\Modules\SiteHealth\Models\Site;

class SitePolicy
{
    public function view(User $user, Site $site): bool
    {
        return $user->id === $site->user_id;
    }

    public function update(User $user, Site $site): bool
    {
        return $user->id === $site->user_id;
    }

    public function delete(User $user, Site $site): bool
    {
        return $user->id === $site->user_id;
    }
}
