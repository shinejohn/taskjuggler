<?php

namespace App\Modules\Core\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Modules\Core\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends \App\Http\Controllers\Controller
{
    use ApiResponses;

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
                'timezone' => 'nullable|string|max:50',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'timezone' => $validated['timezone'] ?? 'America/New_York',
            ]);

            // Create default profile for new user
            $profile = Profile::create([
                'user_id' => $user->id,
                'name' => 'Default',
                'slug' => 'default',
                'is_default' => true,
            ]);

            // Set current_profile_id on user
            $user->update(['current_profile_id' => $profile->id]);

            $token = $user->createToken('auth-token')->plainTextToken;

            // Load profiles with user
            $user->load('profiles');

            return $this->created([
                'user' => $user,
                'token' => $token,
            ], 'User registered successfully');
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->error('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'Logged in successfully');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }

    public function user(Request $request)
    {
        $user = $request->user()->load('profiles');
        return $this->success($user, 'User retrieved successfully');
    }

    /**
     * Register push notification token
     */
    public function registerPushToken(Request $request)
    {
        $validated = $request->validate([
            'push_token' => 'required|string',
            'platform' => 'required|in:ios,android,web',
        ]);

        $request->user()->update([
            'push_token' => $validated['push_token'],
            'push_platform' => $validated['platform'],
        ]);

        return $this->success(null, 'Push token registered successfully');
    }
}

