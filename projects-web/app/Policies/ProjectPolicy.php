<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Enums\MemberRole;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Can view projects in their organization
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        // Must be in same organization
        if ($user->organization_id !== $project->organization_id) {
            return false;
        }

        // Owner can always view
        if ($project->owner_id === $user->id) {
            return true;
        }

        // Member can view
        return $user->isMemberOf($project);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Check organization limits
        if ($user->organization) {
            return $user->organization->canAddProject();
        }
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        // Must be in same organization
        if ($user->organization_id !== $project->organization_id) {
            return false;
        }

        // Owner can always update
        if ($project->owner_id === $user->id) {
            return true;
        }

        // Admin/owner members can update
        $role = $user->roleIn($project);
        return in_array($role, ['owner', 'admin']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        // Must be in same organization
        if ($user->organization_id !== $project->organization_id) {
            return false;
        }

        // Only owner can delete
        return $project->owner_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        return $this->delete($user, $project);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        return $this->delete($user, $project);
    }
}
