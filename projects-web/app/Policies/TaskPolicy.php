<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        // Must be in same organization
        if ($user->organization_id !== $task->organization_id) {
            return false;
        }

        // Owner, requestor, or project member can view
        if ($task->owner_id === $user->id || $task->requestor_id === $user->id) {
            return true;
        }

        // Check if user is a project member
        return $user->isMemberOf($task->project);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Can create tasks if they're in the project
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // Must be in same organization
        if ($user->organization_id !== $task->organization_id) {
            return false;
        }

        // Owner, requestor, or project admin can update
        if ($task->owner_id === $user->id || $task->requestor_id === $user->id) {
            return true;
        }

        // Project admin/owner can update
        $role = $user->roleIn($task->project);
        return in_array($role, ['owner', 'admin']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        // Must be in same organization
        if ($user->organization_id !== $task->organization_id) {
            return false;
        }

        // Requestor or project admin/owner can delete
        if ($task->requestor_id === $user->id) {
            return true;
        }

        $role = $user->roleIn($task->project);
        return in_array($role, ['owner', 'admin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        return $this->update($user, $task);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return $this->delete($user, $task);
    }
}
