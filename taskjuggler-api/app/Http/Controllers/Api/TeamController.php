<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeamController extends Controller
{
    use AuthorizesRequests;
    public function __construct(
        private NotificationService $notifications
    ) {}

    /**
     * List user's teams
     */
    public function index(Request $request)
    {
        $teams = $request->user()->teams()
            ->withCount('members')
            ->withCount('tasks')
            ->get();

        return response()->json(['teams' => $teams]);
    }

    /**
     * Create a team
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $team = DB::transaction(function () use ($validated, $request) {
            $team = Team::create([
                ...$validated,
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
    public function show(Team $team)
    {
        $this->authorize('view', $team);

        $team->load(['members', 'creator']);
        $team->loadCount(['tasks', 'members']);

        return response()->json(['team' => $team]);
    }

    /**
     * Update team
     */
    public function update(Request $request, Team $team)
    {
        $this->authorize('update', $team);

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
    public function destroy(Team $team)
    {
        $this->authorize('delete', $team);

        $team->delete();

        return response()->json(['message' => 'Team deleted']);
    }

    /**
     * List team members
     */
    public function members(Team $team)
    {
        $this->authorize('view', $team);

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
    public function invite(Request $request, Team $team)
    {
        $this->authorize('update', $team);

        $validated = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'name' => 'nullable|string|max:255',
        ]);

        if (empty($validated['email']) && empty($validated['phone'])) {
            return response()->json(['error' => 'Email or phone required'], 422);
        }

        // Check if already a member
        if ($validated['email']) {
            $existingUser = User::where('email', $validated['email'])->first();
            if ($existingUser && $team->hasMember($existingUser)) {
                return response()->json(['error' => 'Already a team member'], 422);
            }
        }

        $invitation = TeamInvitation::create([
            'team_id' => $team->id,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'invited_by' => $request->user()->id,
        ]);

        // Send invitation
        $this->sendInvitation($invitation);

        return response()->json([
            'invitation' => $invitation,
            'invite_url' => $invitation->getInviteUrl(),
        ], 201);
    }

    /**
     * Get invitation by code (public)
     */
    public function getInvitation(string $inviteCode)
    {
        $invitation = TeamInvitation::where('invite_code', $inviteCode)
            ->with(['team:id,name,description', 'inviter:id,name'])
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
    public function acceptInvitation(Request $request, string $inviteCode)
    {
        $invitation = TeamInvitation::where('invite_code', $inviteCode)->first();

        if (!$invitation || !$invitation->isPending()) {
            return response()->json(['error' => 'Invalid invitation'], 404);
        }

        $invitation->accept($request->user());

        // Notify inviter
        $this->notifications->notifyTeamInvitationAccepted($invitation, $request->user());

        return response()->json([
            'message' => 'Joined team',
            'team' => $invitation->team,
        ]);
    }

    /**
     * Remove member from team
     */
    public function removeMember(Request $request, Team $team, User $user)
    {
        $this->authorize('update', $team);

        // Can't remove yourself if you're the only admin
        if ($user->id === $request->user()->id && $team->admins()->count() === 1) {
            return response()->json(['error' => 'Cannot remove the only admin'], 422);
        }

        $team->removeMember($user);

        return response()->json(['message' => 'Member removed']);
    }

    /**
     * Leave team
     */
    public function leave(Request $request, Team $team)
    {
        if (!$team->hasMember($request->user())) {
            return response()->json(['error' => 'Not a member'], 422);
        }

        // Can't leave if you're the only admin
        if ($team->hasAdmin($request->user()) && $team->admins()->count() === 1) {
            return response()->json(['error' => 'Transfer admin role before leaving'], 422);
        }

        $team->removeMember($request->user());

        return response()->json(['message' => 'Left team']);
    }

    /**
     * Get team tasks
     */
    public function tasks(Request $request, Team $team)
    {
        $this->authorize('view', $team);

        $tasks = $team->tasks()
            ->with(['requestor:id,name', 'owner:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($tasks);
    }

    /**
     * Send invitation notification
     */
    private function sendInvitation(TeamInvitation $invitation): void
    {
        $message = sprintf(
            "You've been invited to join \"%s\" on Task Juggler.\n\nJoin here: %s",
            $invitation->team->name,
            $invitation->getInviteUrl()
        );

        // For now, just log - full email/SMS integration pending
        Log::info('Team invitation created', [
            'invitation_id' => $invitation->id,
            'team_id' => $invitation->team_id,
            'invited_email' => $invitation->email,
            'invited_phone' => $invitation->phone,
            'invite_url' => $invitation->getInviteUrl(),
        ]);

        // TODO: When email/SMS services are fully integrated:
        // if ($invitation->email) {
        //     $this->notifications->sendEmail(...);
        // }
        // if ($invitation->phone) {
        //     $this->notifications->sendSms(...);
        // }
    }
}
