<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaIntegration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IntegrationController extends Controller
{
    /**
     * Get integrations for user
     * GET /api/urpa/integrations
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $integrations = UrpaIntegration::where('user_id', $user->id)
            ->orderBy('connected_at', 'desc')
            ->get();

        // Don't expose encrypted tokens
        $integrations->transform(function ($integration) {
            unset($integration->access_token_encrypted);
            unset($integration->refresh_token_encrypted);
            return $integration;
        });

        return response()->json(['data' => $integrations]);
    }

    /**
     * Get integration by ID
     * GET /api/urpa/integrations/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $integration = UrpaIntegration::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Don't expose encrypted tokens
        unset($integration->access_token_encrypted);
        unset($integration->refresh_token_encrypted);

        return response()->json($integration);
    }

    /**
     * Create/Update integration
     * POST /api/urpa/integrations
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'integration_type' => 'required|string|in:email,messaging,calendar,social,voicemail,tasks,storage',
            'provider' => 'required|string|max:50',
            'access_token' => 'nullable|string',
            'refresh_token' => 'nullable|string',
            'token_expires_at' => 'nullable|date',
            'config' => 'nullable|array',
        ]);

        $user = $request->user();

        // Encrypt tokens if provided
        $accessTokenEncrypted = null;
        $refreshTokenEncrypted = null;
        
        if (!empty($validated['access_token'])) {
            $accessTokenEncrypted = Crypt::encryptString($validated['access_token']);
        }
        
        if (!empty($validated['refresh_token'])) {
            $refreshTokenEncrypted = Crypt::encryptString($validated['refresh_token']);
        }

        $integration = UrpaIntegration::updateOrCreate(
            [
                'user_id' => $user->id,
                'integration_type' => $validated['integration_type'],
                'provider' => $validated['provider'],
            ],
            [
                'status' => 'connected',
                'access_token_encrypted' => $accessTokenEncrypted,
                'refresh_token_encrypted' => $refreshTokenEncrypted,
                'token_expires_at' => $validated['token_expires_at'] ?? null,
                'config' => $validated['config'] ?? [],
                'connected_at' => now(),
            ]
        );

        $integration->markAsConnected();

        // Don't expose encrypted tokens
        unset($integration->access_token_encrypted);
        unset($integration->refresh_token_encrypted);

        return response()->json($integration, 201);
    }

    /**
     * Update integration
     * PUT /api/urpa/integrations/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $integration = UrpaIntegration::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'config' => 'sometimes|array',
            'status' => 'sometimes|string|in:pending,connected,error,disconnected',
        ]);

        $integration->update($validated);

        // Don't expose encrypted tokens
        unset($integration->access_token_encrypted);
        unset($integration->refresh_token_encrypted);

        return response()->json($integration);
    }

    /**
     * Delete integration
     * DELETE /api/urpa/integrations/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $integration = UrpaIntegration::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $integration->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Sync integration
     * POST /api/urpa/integrations/{id}/sync
     */
    public function sync(Request $request, string $id): JsonResponse
    {
        $integration = UrpaIntegration::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!$integration->isConnected()) {
            return response()->json([
                'error' => 'Integration is not connected',
            ], 400);
        }

        \App\Modules\Urpa\Jobs\SyncIntegrationJob::dispatch($integration);

        return response()->json([
            'message' => 'Sync started',
            'integration_id' => $integration->id,
        ]);
    }

    /**
     * Get sync status
     * GET /api/urpa/integrations/{id}/sync-status
     */
    public function syncStatus(Request $request, string $id): JsonResponse
    {
        $integration = UrpaIntegration::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json([
            'last_sync_at' => $integration->last_sync_at,
            'sync_error' => $integration->sync_error,
            'status' => $integration->status,
        ]);
    }

    /**
     * Initiate OAuth redirect
     * GET /api/urpa/integrations/oauth/{provider}/redirect
     */
    public function oauthRedirect(Request $request, string $provider): JsonResponse
    {
        $user = $request->user();
        $validProviders = ['google', 'microsoft', 'slack', 'dropbox'];

        if (!in_array($provider, $validProviders)) {
            return response()->json(['error' => 'Invalid provider'], 400);
        }

        // Store state for CSRF protection
        $state = bin2hex(random_bytes(16));
        session(['oauth_state' => $state, 'oauth_provider' => $provider, 'oauth_user_id' => $user->id]);

        $redirectUrl = match ($provider) {
            'google' => $this->getGoogleOAuthUrl($state),
            'microsoft' => $this->getMicrosoftOAuthUrl($state),
            'slack' => $this->getSlackOAuthUrl($state),
            'dropbox' => $this->getDropboxOAuthUrl($state),
            default => null,
        };

        if (!$redirectUrl) {
            return response()->json(['error' => 'Provider not configured'], 500);
        }

        return response()->json(['redirect_url' => $redirectUrl]);
    }

    /**
     * Handle OAuth callback
     * GET /api/urpa/integrations/oauth/{provider}/callback
     */
    public function oauthCallback(Request $request, string $provider): JsonResponse
    {
        $state = session('oauth_state');
        $userId = session('oauth_user_id');
        $sessionProvider = session('oauth_provider');

        if (!$state || $provider !== $sessionProvider || !$userId) {
            return response()->json(['error' => 'Invalid OAuth state'], 400);
        }

        if ($request->query('state') !== $state) {
            return response()->json(['error' => 'State mismatch'], 400);
        }

        $code = $request->query('code');
        if (!$code) {
            return response()->json(['error' => 'Authorization code missing'], 400);
        }

        // Exchange code for tokens
        $tokens = match ($provider) {
            'google' => $this->exchangeGoogleCode($code),
            'microsoft' => $this->exchangeMicrosoftCode($code),
            'slack' => $this->exchangeSlackCode($code),
            'dropbox' => $this->exchangeDropboxCode($code),
            default => null,
        };

        if (!$tokens) {
            return response()->json(['error' => 'Failed to exchange tokens'], 500);
        }

        // Determine integration type from provider
        $integrationType = match ($provider) {
            'google', 'microsoft' => 'calendar',
            'slack' => 'messaging',
            'dropbox' => 'storage',
            default => 'email',
        };

        // Create/update integration
        $integration = UrpaIntegration::updateOrCreate(
            [
                'user_id' => $userId,
                'integration_type' => $integrationType,
                'provider' => $provider,
            ],
            [
                'status' => 'connected',
                'access_token_encrypted' => Crypt::encryptString($tokens['access_token']),
                'refresh_token_encrypted' => isset($tokens['refresh_token']) ? Crypt::encryptString($tokens['refresh_token']) : null,
                'token_expires_at' => isset($tokens['expires_in']) ? now()->addSeconds($tokens['expires_in']) : null,
                'connected_at' => now(),
            ]
        );

        // Clear session
        session()->forget(['oauth_state', 'oauth_provider', 'oauth_user_id']);

        return response()->json([
            'success' => true,
            'integration' => $integration,
        ]);
    }

    private function getGoogleOAuthUrl(string $state): ?string
    {
        $clientId = config('services.google.client_id');
        $redirectUri = config('services.google.redirect');
        
        if (!$clientId || !$redirectUri) {
            return null;
        }

        $scopes = implode(' ', [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/gmail.readonly',
        ]);

        return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => $scopes,
            'state' => $state,
            'access_type' => 'offline',
            'prompt' => 'consent',
        ]);
    }

    private function getMicrosoftOAuthUrl(string $state): ?string
    {
        // TODO: Implement Microsoft OAuth
        return null;
    }

    private function getSlackOAuthUrl(string $state): ?string
    {
        // TODO: Implement Slack OAuth
        return null;
    }

    private function getDropboxOAuthUrl(string $state): ?string
    {
        // TODO: Implement Dropbox OAuth
        return null;
    }

    private function exchangeGoogleCode(string $code): ?array
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri = config('services.google.redirect');

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirectUri,
            'grant_type' => 'authorization_code',
        ]);

        if ($response->failed()) {
            Log::error('Google OAuth token exchange failed', ['response' => $response->body()]);
            return null;
        }

        return $response->json();
    }

    private function exchangeMicrosoftCode(string $code): ?array
    {
        // TODO: Implement Microsoft token exchange
        return null;
    }

    private function exchangeSlackCode(string $code): ?array
    {
        // TODO: Implement Slack token exchange
        return null;
    }

    private function exchangeDropboxCode(string $code): ?array
    {
        // TODO: Implement Dropbox token exchange
        return null;
    }
}

