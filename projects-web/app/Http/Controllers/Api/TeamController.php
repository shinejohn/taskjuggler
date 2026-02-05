<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TeamController extends Controller
{
    /**
     * List user's teams
     */
    public function index(Request $request): JsonResponse
    {
        $teams = Team::where('organization_id', $request->user()->organization_id)
            ->whereHas('members', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            })
            ->withCount('members')
            ->withCount('tasks')
            ->get();

        return response()->json(['teams' => $teams]);
    }

    /**
     * Create a team
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $team = DB::transaction(function () use ($validated, $request) {
            $team = Team::create([
                ...$validated,
                'organization_id' => $request->user()->organization_id,
                'created_by' => $request->user()->id,
            ]);

            // Add creator as admin
            $team->addMember($request->user(), true);

            return $team;
        });

        return response()->json(['team' => $team], 201);
    }

    /**
     * Get team details
     */
    public function show(Team $team): JsonResponse
    {
        // Check organization access
        if ($team->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $team->load(['members', 'creator']);
        $team->loadCount(['tasks', 'members']);

        return response()->json(['team' => $team]);
    }

    /**
     * Update team
     */
    public function update(Request $request, Team $team): JsonResponse
    {
        // Check organization access
        if ($team->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'avatar_url' => 'nullable|url',
        ]);

        $team->update($validated);

        return response()->json(['team' => $team]);
    }

    /**
     * Delete team
     */
    public function destroy(Team $team): JsonResponse
    {
        // Check organization access
        if ($team->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $team->delete();

        return response()->json(['message' => 'Team deleted']);
    }

    /**
     * List team members
     */
    public function members(Team $team): JsonResponse
    {
        // Check organization access
        if ($team->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $members = $team->members()
            ->select('users.id', 'users.name', 'users.email', 'users.avatar_url')
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'avatar_url' => $member->avatar_url,
                    'is_admin' => $member->pivot->is_admin,
                    'joined_at' => $member->pivot->joined_at,
                ];
            });

        return response()->json(['members' => $members]);
    }

    /**
     * Invite someone to team
     */
    public function invite(Request $request, Team $team): JsonResponse
    {
        // Check organization access
        if ($team->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        if (empty($validated['email']) && empty($validated['phone'])) {
            return response()->json(['error' => 'Email or phone required'], 422);
        }

        // Check if already a member
        if ($validated['email']) {
            $existingUser = User::where('email', $validated['email'])
                ->where('organization_id', $team->organization_id)
                ->first();
            if ($existingUser && $team->hasMember($existingUser)) {
                return response()->json(['error' => 'Already a team member'], 422);
            }
        }

        $invitation = TeamInvitation::create([
            'team_id' => $team->id,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'invited_by' => $request->user()->id,
            'expires_at' => now()->addDays(7),
        ]);

        return response()->json([
            'invitation' => $invitation,
            'invite_code' => $invitation->invite_code,
        ], 201);
    }

    /**
     * Get invitation by code (public)
     */
    public function getInvitation(string $inviteCode): JsonResponse
    {
        $invitation = TeamInvitation::where('invite_code', $inviteCode)
            ->with(['team:id,name,description,organization_id', 'inviter:id,name'])
            ->first();

        if (!$invitation) {
            return response()->json(['error' => 'Invitation not found'], 404);
        }

        if ($invitation->isExpired()) {
            return response()->json(['error' => 'Invitation expired'], 410);
        }

        if ($invitation->status !== 'pending') {
            return response()->json(['error' => 'Invitation already used'], 410);
        }

        return response()->json([
            'invitation' => $invitation,
            'team' => $invitation->team,
            'invited_by' => $invitation->inviter,
        ]);
    }

    /**
     * Accept invitation (authenticated)
     */
    public function acceptInvitation(Request $request, string $inviteCode): JsonResponse
    {
        $invitation = TeamInvitation::where('invite_code', $inviteCode)->first();

        if (!$invitation) {
            return response()->json(['error' => 'Invitation not found'], 404);
        }

        if ($invitation->isExpired()) {
            return response()->json(['error' => 'Invitation expired'], 410);
        }

        if ($invitation->status !== 'pending') {
            return response()->json(['error' => 'Invitation already used'], 410);
        }

        // Check if user matches invitation
        $user = $request->user();
        if ($invitation->email && $user->email !== $invitation->email) {
            return response()->json(['error' => 'Invitation not for this user'], 403);
        }

        DB::transaction(function () use ($invitation, $user) {
            $invitation->team->addMember($user);
            $invitation->accept();
        });

        return response()->json(['message' => 'Invitation accepted', 'team' => $invitation->team]);
    }

    /**
     * Remove member from team
     */
    public function removeMember(Request $request, Team $team, User $user): JsonResponse
    {
        // Check organization access
        if ($team->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        // Check if requester is admin
        if (!$team->hasAdmin($request->user())) {
            abort(403, 'Only team admins can remove members');
        }

        $team->removeMember($user);

        return response()->json(['message' => 'Member removed']);
    }

    /**
     * Leave team
     */
    public function leave(Request $request, Team $team): JsonResponse
    {
        // Check organization access
        if ($team->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $team->removeMember($request->user());

        return response()->json(['message' => 'Left team']);
    }

    /**
     * Get team tasks
     */
    public function tasks(Request $request, Team $team): JsonResponse
    {
        // Check organization access
        if ($team->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $tasks = $team->tasks()
            ->with(['requestor', 'owner'])
            ->paginate($request->get('per_page', 20));

        return response()->json($tasks);
    }
}
