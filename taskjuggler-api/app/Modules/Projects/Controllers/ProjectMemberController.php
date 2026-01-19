<?php

namespace App\Modules\Projects\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Models\ProjectMember;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectMemberController extends Controller
{
    use ApiResponses;

    /**
     * List all members of a project
     */
    public function index(Request $request, Project $project): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        $members = $project->projectMembers()
            ->with('user:id,name,email')
            ->get();

        return response()->json([
            'data' => $members->map(function ($member) {
                return [
                    'id' => $member->id,
                    'user_id' => $member->user_id,
                    'user' => [
                        'id' => $member->user->id,
                        'name' => $member->user->name ?? $member->user->email,
                        'email' => $member->user->email,
                    ],
                    'role' => $member->role,
                    'allocation_percentage' => $member->allocation_percentage,
                    'created_at' => $member->created_at?->toIso8601String(),
                ];
            }),
        ]);
    }

    /**
     * Add a member to a project
     */
    public function store(Request $request, Project $project): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        // Check if user has permission to add members
        $currentMember = $project->projectMembers()
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$currentMember || !$currentMember->canManage()) {
            abort(403, 'You do not have permission to add members');
        }

        $validated = $request->validate([
            'user_id' => ['required', 'uuid', 'exists:users,id'],
            'role' => ['required', 'string', 'in:owner,admin,member,viewer'],
            'allocation_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        // Check if user is already a member
        $existingMember = $project->projectMembers()
            ->where('user_id', $validated['user_id'])
            ->first();

        if ($existingMember) {
            return response()->json([
                'message' => 'User is already a member of this project',
            ], 422);
        }

        // Verify user belongs to the same team
        $user = User::findOrFail($validated['user_id']);
        if (!$project->team->hasMember($user)) {
            return response()->json([
                'message' => 'User must be a member of the project team',
            ], 422);
        }

        $member = $project->projectMembers()->create([
            'user_id' => $validated['user_id'],
            'role' => $validated['role'],
            'allocation_percentage' => $validated['allocation_percentage'] ?? 100,
        ]);

        return response()->json([
            'data' => [
                'id' => $member->id,
                'user_id' => $member->user_id,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name ?? $user->email,
                    'email' => $user->email,
                ],
                'role' => $member->role,
                'allocation_percentage' => $member->allocation_percentage,
            ],
        ], 201);
    }

    /**
     * Update a project member
     */
    public function update(Request $request, Project $project, ProjectMember $member): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        // Verify member belongs to project
        if ($member->project_id !== $project->id) {
            abort(404, 'Member not found');
        }

        // Check if user has permission to update members
        $currentMember = $project->projectMembers()
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$currentMember || !$currentMember->canManage()) {
            abort(403, 'You do not have permission to update members');
        }

        // Prevent changing owner role unless current user is owner
        if ($member->role === 'owner' && $currentMember->role !== 'owner') {
            abort(403, 'Only the owner can modify the owner role');
        }

        $validated = $request->validate([
            'role' => ['sometimes', 'string', 'in:owner,admin,member,viewer'],
            'allocation_percentage' => ['sometimes', 'integer', 'min:0', 'max:100'],
        ]);

        $member->update($validated);

        return response()->json([
            'data' => [
                'id' => $member->id,
                'user_id' => $member->user_id,
                'role' => $member->role,
                'allocation_percentage' => $member->allocation_percentage,
            ],
        ]);
    }

    /**
     * Remove a member from a project
     */
    public function destroy(Request $request, Project $project, ProjectMember $member): JsonResponse
    {
        // Check team access
        $teamId = $request->get('team_id') ?? app('current_team')?->id;
        if ($project->team_id !== $teamId) {
            abort(403, 'Unauthorized');
        }

        // Verify member belongs to project
        if ($member->project_id !== $project->id) {
            abort(404, 'Member not found');
        }

        // Check if user has permission to remove members
        $currentMember = $project->projectMembers()
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$currentMember || !$currentMember->canManage()) {
            abort(403, 'You do not have permission to remove members');
        }

        // Prevent removing owner unless current user is owner
        if ($member->role === 'owner' && $currentMember->role !== 'owner') {
            abort(403, 'Only the owner can remove the owner');
        }

        // Prevent removing yourself if you're the only owner
        if ($member->role === 'owner' && $member->user_id === $request->user()->id) {
            $ownerCount = $project->projectMembers()
                ->where('role', 'owner')
                ->count();

            if ($ownerCount === 1) {
                abort(422, 'Cannot remove the only owner of the project');
            }
        }

        $member->delete();

        return response()->json(null, 204);
    }
}

