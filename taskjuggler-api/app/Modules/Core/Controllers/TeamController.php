<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    /**
     * List user's teams
     */
    public function index()
    {
        $user = Auth::user();
        return response()->json([
            'success' => true,
            'data' => $user->teams
        ]);
    }

    /**
     * Create a new team
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = Auth::user();

        $team = Team::create([
            'name' => $request->input('name'),
            'owner_id' => $user->id,
            'created_by' => $user->id,
            'slug' => \Illuminate\Support\Str::slug($request->input('name')) . '-' . uniqid(),
        ]);

        // Add creator as admin
        $team->addMember($user, true);

        return response()->json([
            'success' => true,
            'data' => $team
        ], 201);
    }

    /**
     * Show team details and members
     */
    public function show($id)
    {
        $team = Team::with('members')->findOrFail($id);
        
        // Authorization check (simple)
        if (!$team->hasMember(Auth::user())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $team
        ]);
    }

    /**
     * Invite/Add member
     */
    public function addMember(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'is_admin' => 'boolean'
        ]);

        $team = Team::findOrFail($id);
        
        if (!$team->hasAdmin(Auth::user())) {
             return response()->json(['error' => 'Only admins can add members'], 403);
        }

        $userToAdd = User::where('email', $request->input('email'))->first();

        $team->addMember($userToAdd, $request->input('is_admin', false));

        return response()->json([
            'success' => true,
            'message' => 'Member added'
        ]);
    }

    /**
     * Remove member
     */
    public function removeMember(Request $request, $id, $userId)
    {
        $team = Team::findOrFail($id);
        
        if (!$team->hasAdmin(Auth::user())) {
             return response()->json(['error' => 'Only admins can remove members'], 403);
        }
        
        if ($userId == $team->owner_id) {
            return response()->json(['error' => 'Cannot remove owner'], 400);
        }

        $userToRemove = User::findOrFail($userId);
        $team->removeMember($userToRemove);

        return response()->json([
            'success' => true,
            'message' => 'Member removed'
        ]);
    }
}
