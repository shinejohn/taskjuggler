<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $teamMembers = $request->user()
            ->teamMembers()
            ->with('user')
            ->get();

        return response()->json($teamMembers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|string|max:100',
            'can_receive_tasks' => 'nullable|boolean',
            'user_id' => 'nullable|uuid|exists:users,id',
        ]);

        $teamMember = TeamMember::create([
            ...$validated,
            'owner_id' => $request->user()->id,
            'can_receive_tasks' => $validated['can_receive_tasks'] ?? true,
        ]);

        return response()->json($teamMember, 201);
    }

    public function show(TeamMember $teamMember)
    {
        $this->authorize('view', $teamMember);
        
        $teamMember->load('user');

        return response()->json($teamMember);
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $this->authorize('update', $teamMember);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|string|max:100',
            'can_receive_tasks' => 'sometimes|boolean',
            'user_id' => 'nullable|uuid|exists:users,id',
        ]);

        $teamMember->update($validated);

        return response()->json($teamMember);
    }

    public function destroy(TeamMember $teamMember)
    {
        $this->authorize('delete', $teamMember);
        
        $teamMember->delete();

        return response()->json(null, 204);
    }
}
