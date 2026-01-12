<?php

namespace App\Http\Controllers\IdeaCircuit;

use App\Http\Controllers\Controller;
use App\Models\IdeaCircuit\Meeting;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load('profile');

        return response()->json(['data' => $user]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'timezone' => 'sometimes|string|max:50',
        ]);

        $user->update($validated);

        return response()->json(['data' => $user]);
    }

    /**
     * Get user activity
     */
    public function activity(Request $request)
    {
        $user = $request->user();

        $meetings = Meeting::where('user_id', $user->id)
            ->with(['participants'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        $activity = [
            'total_meetings' => Meeting::where('user_id', $user->id)->count(),
            'active_meetings' => Meeting::where('user_id', $user->id)
                ->whereIn('status', ['scheduled', 'waiting', 'active'])
                ->count(),
            'recent_meetings' => $meetings,
        ];

        return response()->json(['data' => $activity]);
    }
}
