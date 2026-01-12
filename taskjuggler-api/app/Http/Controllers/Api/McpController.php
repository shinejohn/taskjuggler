<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class McpController extends Controller
{
    /**
     * Register a new MCP user account
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'plan' => 'free', // MCP users start with free plan
        ]);

        // Create API key for the user
        $apiKey = $this->generateApiKey($user->id);

        return response()->json([
            'message' => 'Account created successfully',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ],
            'api_key' => $apiKey,
            'mcp_server_url' => config('app.mcp_server_url', env('MCP_SERVER_URL', 'https://mcp.taskjuggler.com')),
        ], 201);
    }

    /**
     * Login and get API key
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Get or create API key
        $apiKey = $this->getOrCreateApiKey($user->id);

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ],
            'api_key' => $apiKey,
            'mcp_server_url' => config('app.mcp_server_url', env('MCP_SERVER_URL', 'https://mcp.taskjuggler.com')),
        ]);
    }

    /**
     * Get current user's API key
     */
    public function getApiKey(Request $request)
    {
        $user = $request->user();
        $apiKey = $this->getOrCreateApiKey($user->id);

        return response()->json([
            'api_key' => $apiKey,
            'mcp_server_url' => config('app.mcp_server_url', env('MCP_SERVER_URL', 'https://mcp.taskjuggler.com')),
        ]);
    }

    /**
     * Regenerate API key
     */
    public function regenerateApiKey(Request $request)
    {
        $user = $request->user();
        $apiKey = $this->generateApiKey($user->id, true);

        return response()->json([
            'message' => 'API key regenerated',
            'api_key' => $apiKey,
        ]);
    }

    /**
     * Generate a new API key for a user
     */
    private function generateApiKey(string $userId, bool $revokeOld = false): string
    {
        if ($revokeOld) {
            // Revoke old API keys (in production, mark as revoked in database)
            // For now, we'll just generate a new one
        }

        $apiKey = 'mcp_' . Str::random(32);
        
        // Store API key in database (create mcp_api_keys table)
        // For now, we'll use a simple approach with user settings
        $user = User::find($userId);
        $settings = $user->settings ?? [];
        $settings['mcp_api_key'] = $apiKey;
        $settings['mcp_api_key_created_at'] = now()->toIso8601String();
        $user->settings = $settings;
        $user->save();

        return $apiKey;
    }

    /**
     * Get or create API key for a user
     */
    private function getOrCreateApiKey(string $userId): string
    {
        $user = User::find($userId);
        $settings = $user->settings ?? [];
        
        if (isset($settings['mcp_api_key'])) {
            return $settings['mcp_api_key'];
        }

        return $this->generateApiKey($userId);
    }

    /**
     * Validate API key (for MCP server)
     */
    public function validateKey(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'api_key' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'API key required'], 400);
        }

        $apiKey = $request->api_key;
        $user = $this->validateApiKey($apiKey);

        if (!$user) {
            return response()->json(['error' => 'Invalid API key'], 401);
        }

        // Generate or get user token for API access
        $token = $user->createToken('mcp-access')->plainTextToken;

        return response()->json([
            'user_id' => $user->id,
            'user_token' => $token,
        ]);
    }

    /**
     * Get user token for API access
     */
    public function getToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|uuid',
            'api_key' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid request'], 400);
        }

        $user = $this->validateApiKey($request->api_key);
        
        if (!$user || $user->id !== $request->user_id) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('mcp-access')->plainTextToken;

        return response()->json([
            'token' => $token,
        ]);
    }

    /**
     * Validate API key and return user
     */
    public static function validateApiKey(string $apiKey): ?User
    {
        if (!str_starts_with($apiKey, 'mcp_')) {
            return null;
        }

        // Find user with this API key
        $users = User::whereJsonContains('settings->mcp_api_key', $apiKey)->get();
        
        if ($users->isEmpty()) {
            return null;
        }

        return $users->first();
    }
}





