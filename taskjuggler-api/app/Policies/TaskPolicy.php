<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        return $task->requestor_id === $user->id 
            || $task->owner_id === $user->id
            || ($task->teamMember && $task->teamMember->owner_id === $user->id);
    }

    public function update(User $user, Task $task): bool
    {
        return $task->requestor_id === $user->id 
            || $task->owner_id === $user->id
            || ($task->teamMember && $task->teamMember->owner_id === $user->id);
    }

    public function delete(User $user, Task $task): bool
    {
        return $task->requestor_id === $user->id;
    }
}
