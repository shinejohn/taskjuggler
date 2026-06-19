<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaSocialAccount;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

/**
 * Per-user OAuth connect flow for social providers. State carries the user id
 * so the public callback can attribute the account without a session.
 */
final class SocialOAuthService
{
    /**
     * Build the provider authorize URL the user is redirected to.
     */
    public function authorizeUrl(string $provider, string $userId): string
    {
        $config = $this->providerConfig($provider);

        $params = [
            'client_id' => $config['client_id'],
            'redirect_uri' => $this->redirectUri($provider),
            'scope' => implode($provider === 'twitter' ? ' ' : ',', $config['scopes']),
            'response_type' => 'code',
            'state' => $this->encodeState($provider, $userId),
        ];

        // Twitter OAuth2 PKCE requires a challenge; use the plain method.
        if ($provider === 'twitter') {
            $params['code_challenge'] = 'challenge';
            $params['code_challenge_method'] = 'plain';
        }

        return $config['authorize_url'].'?'.http_build_query($params);
    }

    /**
     * Handle the provider callback: exchange the code, fetch account info,
     * and persist the connected account. Returns [userId, UrpaSocialAccount].
     *
     * @return array{0: string, 1: UrpaSocialAccount}
     */
    public function handleCallback(string $provider, string $code, string $state): array
    {
        [$stateProvider, $userId] = $this->decodeState($state);
        if ($stateProvider !== $provider) {
            throw new RuntimeException('OAuth state/provider mismatch');
        }

        $config = $this->providerConfig($provider);
        $token = $this->exchangeCode($provider, $config, $code);
        $account = $this->resolveAccount($provider, $token);

        $model = UrpaSocialAccount::updateOrCreate(
            [
                'user_id' => $userId,
                'provider' => $provider,
                'provider_account_id' => $account['id'],
            ],
            [
                'account_name' => $account['name'] ?? null,
                'credentials' => array_merge($token, $account['credentials'] ?? []),
                'scopes' => $config['scopes'],
                'token_expires_at' => isset($token['expires_in'])
                    ? now()->addSeconds((int) $token['expires_in'])
                    : null,
                'is_active' => true,
            ]
        );

        return [$userId, $model];
    }

    private function redirectUri(string $provider): string
    {
        $base = rtrim((string) config('social.redirect_base'), '/');

        return "{$base}/{$provider}/callback";
    }

    /**
     * @param  array<string, mixed>  $config
     * @return array<string, mixed>
     */
    private function exchangeCode(string $provider, array $config, string $code): array
    {
        $payload = [
            'client_id' => $config['client_id'],
            'client_secret' => $config['client_secret'],
            'code' => $code,
            'redirect_uri' => $this->redirectUri($provider),
            'grant_type' => 'authorization_code',
        ];

        if ($provider === 'twitter') {
            $payload['code_verifier'] = 'challenge';
            $response = Http::asForm()
                ->withBasicAuth($config['client_id'], $config['client_secret'])
                ->post($config['token_url'], $payload);
        } elseif ($provider === 'facebook' || $provider === 'instagram') {
            $response = Http::get($config['token_url'], $payload);
        } else {
            $response = Http::asForm()->post($config['token_url'], $payload);
        }

        if ($response->failed()) {
            throw new RuntimeException("{$provider} token exchange failed: ".$response->body());
        }

        return $response->json();
    }

    /**
     * Fetch the account identity (id/name + any page tokens) for the provider.
     *
     * @param  array<string, mixed>  $token
     * @return array<string, mixed>
     */
    private function resolveAccount(string $provider, array $token): array
    {
        $accessToken = $token['access_token'] ?? null;
        $graph = 'https://graph.facebook.com/'.config('social.graph_version');

        return match ($provider) {
            'facebook', 'instagram' => $this->resolveMetaPage($graph, $accessToken, $provider),
            'twitter' => $this->resolveTwitter($accessToken),
            'linkedin' => $this->resolveLinkedin($accessToken),
            default => throw new InvalidArgumentException("Unsupported provider: {$provider}"),
        };
    }

    /**
     * @return array<string, mixed>
     */
    private function resolveMetaPage(string $graph, ?string $accessToken, string $provider): array
    {
        $pages = Http::get("{$graph}/me/accounts", [
            'fields' => 'id,name,access_token,instagram_business_account',
            'access_token' => $accessToken,
        ]);

        $page = $pages->json('data.0');
        if (! $page) {
            throw new RuntimeException("{$provider}: no managed Page found for this account");
        }

        if ($provider === 'instagram') {
            $igId = $page['instagram_business_account']['id'] ?? null;
            if (! $igId) {
                throw new RuntimeException('instagram: the Page has no linked Instagram business account');
            }

            return [
                'id' => $igId,
                'name' => $page['name'] ?? null,
                'credentials' => ['page_access_token' => $page['access_token'] ?? null],
            ];
        }

        return [
            'id' => $page['id'],
            'name' => $page['name'] ?? null,
            'credentials' => ['page_access_token' => $page['access_token'] ?? null],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function resolveTwitter(?string $accessToken): array
    {
        $me = Http::withToken($accessToken)->get('https://api.twitter.com/2/users/me');
        $id = $me->json('data.id');
        if (! $id) {
            throw new RuntimeException('twitter: could not resolve account id');
        }

        return ['id' => $id, 'name' => $me->json('data.username')];
    }

    /**
     * @return array<string, mixed>
     */
    private function resolveLinkedin(?string $accessToken): array
    {
        $me = Http::withToken($accessToken)->get('https://api.linkedin.com/v2/me');
        $id = $me->json('id');
        if (! $id) {
            throw new RuntimeException('linkedin: could not resolve member id');
        }

        return [
            'id' => $id,
            'name' => trim(($me->json('localizedFirstName') ?? '').' '.($me->json('localizedLastName') ?? '')),
            'credentials' => ['author_urn' => "urn:li:person:{$id}"],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function providerConfig(string $provider): array
    {
        $config = config("social.providers.{$provider}");
        if (! $config) {
            throw new InvalidArgumentException("Unknown social provider: {$provider}");
        }
        if (empty($config['client_id']) || empty($config['client_secret'])) {
            throw new RuntimeException("Provider {$provider} is not configured (missing client credentials)");
        }

        return $config;
    }

    private function encodeState(string $provider, string $userId): string
    {
        return Crypt::encryptString(implode('|', [$provider, $userId, Str::random(8)]));
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function decodeState(string $state): array
    {
        $parts = explode('|', Crypt::decryptString($state));
        if (count($parts) < 2) {
            throw new RuntimeException('Invalid OAuth state');
        }

        return [$parts[0], $parts[1]];
    }
}
