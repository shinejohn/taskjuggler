<?php

namespace App\Policies;

use App\Models\AssistantChannel;
use App\Models\User;

class AssistantChannelPolicy
{
    public function view(User $user, AssistantChannel $channel): bool
    {
        return $channel->user_id === $user->id;
    }

    public function update(User $user, AssistantChannel $channel): bool
    {
        return $channel->user_id === $user->id;
    }

    public function delete(User $user, AssistantChannel $channel): bool
    {
        return $channel->user_id === $user->id;
    }
}
