<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        // User can view if they are requestor (use string comparison for UUIDs)
        if ($task->requestor_id && (string)$task->requestor_id === (string)$user->id) {
            return true;
        }
        
        // User can view if they are owner
        if ($task->owner_id && (string)$task->owner_id === (string)$user->id) {
            return true;
        }
        
        // Check if user is in the task's team (load relationship if needed)
        if ($task->team_id) {
            if (!$task->relationLoaded('team')) {
                $task->load('team');
            }
            $team = $task->team;
            if ($team && $team->hasMember($user)) {
                return true;
            }
        }
        
        return false;
    }

    public function update(User $user, Task $task): bool
    {
        // User can update if they are requestor
        if ($task->requestor_id && (string)$task->requestor_id === (string)$user->id) {
            return true;
        }
        
        // User can update if they are owner
        if ($task->owner_id && (string)$task->owner_id === (string)$user->id) {
            return true;
        }
        
        // Check if user is admin of the task's team
        if ($task->team_id) {
            if (!$task->relationLoaded('team')) {
                $task->load('team');
            }
            $team = $task->team;
            if ($team && $team->hasAdmin($user)) {
                return true;
            }
        }
        
        return false;
    }

    public function delete(User $user, Task $task): bool
    {
        return $task->requestor_id && (string)$task->requestor_id === (string)$user->id;
    }
}
