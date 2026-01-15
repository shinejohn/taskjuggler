<?php

namespace App\Modules\Core\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Modules\Core\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
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
        } catch (ValidationException $e) {
            // Re-throw validation exceptions so Laravel handles them properly
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->error('Registration failed: ' . $e->getMessage(), 500);
        }

        try {

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'timezone' => $validated['timezone'] ?? 'America/New_York',
            ]);

            // Create default profile for new user if profiles table exists
            if (Schema::hasTable('profiles')) {
                try {
                    $profile = Profile::create([
                        'user_id' => $user->id,
                        'name' => 'Default',
                        'slug' => 'default',
                        'is_default' => true,
                    ]);

                    // Set current_profile_id on user
                    $user->update(['current_profile_id' => $profile->id]);
                } catch (\Exception $e) {
                    Log::warning('Could not create profile for new user: ' . $e->getMessage());
                }
            }

            // Get app context from request header
            $appContext = $request->header('X-App-Context', 'taskjuggler'); // Default to taskjuggler for backward compatibility
            
            // Create token with app context in abilities
            $token = $user->createToken('auth-token', ['app_context' => $appContext])->plainTextToken;

            // Load profiles with user if table exists
            try {
                if (Schema::hasTable('profiles')) {
                    $user->load('profiles');
                }
            } catch (\Exception $e) {
                Log::warning('Could not load profiles for user: ' . $e->getMessage());
            }

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
        try {
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

            // Get app context from request header
            $appContext = $request->header('X-App-Context', 'taskjuggler'); // Default to taskjuggler for backward compatibility
            
            // Create token with app context in token name for reference
            $token = $user->createToken("auth-token-{$appContext}")->plainTextToken;
            
            // Load profiles if table exists, otherwise skip
            try {
                if (Schema::hasTable('profiles')) {
                    $user->load('profiles');
                }
            } catch (\Exception $e) {
                // Profiles table doesn't exist or relationship fails - continue without it
                Log::warning('Could not load profiles for user: ' . $e->getMessage());
            }

            return $this->success([
                'user' => $user,
                'token' => $token,
            ], 'Logged in successfully');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->error('Login failed: ' . $e->getMessage(), 500);
        }
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

    /**
     * Get Google OAuth URL for SSO login
     */
    public function googleOAuthUrl(Request $request)
    {
        $clientId = config('services.google.client_id');
        
        if (!$clientId) {
            return $this->error('Google OAuth is not configured', 503);
        }

        $redirectUri = config('services.google.redirect') ?? $request->get('redirect_uri', url('/api/auth/google/callback'));
        $state = bin2hex(random_bytes(16));
        
        // Store state in session for CSRF protection
        $request->session()->put('oauth_state', $state);
        
        $params = http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'state' => $state,
            'access_type' => 'offline',
            'prompt' => 'consent',
        ]);

        $url = 'https://accounts.google.com/o/oauth2/v2/auth?' . $params;

        return $this->success(['url' => $url], 'Google OAuth URL generated');
    }

    /**
     * Handle Google OAuth callback
     */
    public function googleCallback(Request $request)
    {
        $code = $request->get('code');
        $state = $request->get('state');

        // Verify state
        if (!$state || $state !== $request->session()->get('oauth_state')) {
            return $this->error('Invalid state parameter', 400);
        }

        $request->session()->forget('oauth_state');

        if (!$code) {
            return $this->error('Authorization code not provided', 400);
        }

        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri = config('services.google.redirect') ?? url('/api/auth/google/callback');

        // Exchange code for access token
        $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirectUri,
            'grant_type' => 'authorization_code',
        ]);

        if (!$tokenResponse->successful()) {
            Log::error('Google OAuth token exchange failed', ['response' => $tokenResponse->body()]);
            return $this->error('Failed to exchange authorization code', 500);
        }

        $tokenData = $tokenResponse->json();
        $accessToken = $tokenData['access_token'];

        // Get user info from Google
        $userResponse = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v2/userinfo');

        if (!$userResponse->successful()) {
            Log::error('Google user info fetch failed', ['response' => $userResponse->body()]);
            return $this->error('Failed to fetch user information', 500);
        }

        $googleUser = $userResponse->json();

        // Find or create user
        $user = User::where('email', $googleUser['email'])->first();

        if (!$user) {
            // Create new user
            $user = User::create([
                'name' => $googleUser['name'] ?? $googleUser['email'],
                'email' => $googleUser['email'],
                'password' => Hash::make(Str::random(32)), // Random password since OAuth
                'avatar_url' => $googleUser['picture'] ?? null,
            ]);

            // Create default profile
            $profile = Profile::create([
                'user_id' => $user->id,
                'name' => 'Default',
                'slug' => 'default',
                'is_default' => true,
            ]);
            $user->update(['current_profile_id' => $profile->id]);
        } else {
            // Update avatar if changed
            if ($googleUser['picture'] && $googleUser['picture'] !== $user->avatar_url) {
                $user->update(['avatar_url' => $googleUser['picture']]);
            }
        }

        // Get app context from request header (default to taskjuggler)
        $appContext = $request->header('X-App-Context', 'taskjuggler');
        
        $token = $user->createToken("auth-token-{$appContext}")->plainTextToken;
        $user->load('profiles');

        return $this->success([
            'user' => $user,
            'token' => $token,
        ], 'Logged in successfully with Google');
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return $this->success(null, 'Password reset link has been sent to your email.');
        }

        return $this->error('Unable to send password reset link. Please try again later.', 400);
    }

    /**
     * Reset password with token
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password has been reset successfully.');
        }

        return $this->error('Unable to reset password. The token may be invalid or expired.', 400);
    }
}

