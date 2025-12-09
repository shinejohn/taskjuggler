<?php

namespace App\Policies;

use App\Models\RoutingRule;
use App\Models\User;

class RoutingRulePolicy
{
    public function view(User $user, RoutingRule $routingRule): bool
    {
        return $routingRule->user_id === $user->id;
    }

    public function update(User $user, RoutingRule $routingRule): bool
    {
        return $routingRule->user_id === $user->id;
    }

    public function delete(User $user, RoutingRule $routingRule): bool
    {
        return $routingRule->user_id === $user->id;
    }
}
