<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaSocialAccount;
use App\Modules\Urpa\Models\UrpaSocialPost;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Publishes a UrpaSocialPost to its provider's native API.
 */
final class SocialPublisherService
{
    public function publish(UrpaSocialPost $post): UrpaSocialPost
    {
        $account = $post->account;
        if (! $account || ! $account->is_active) {
            return $this->fail($post, 'Social account missing or inactive');
        }

        $post->update(['status' => 'publishing']);

        try {
            $providerPostId = match ($account->provider) {
                'facebook' => $this->publishFacebook($account, $post),
                'instagram' => $this->publishInstagram($account, $post),
                'twitter' => $this->publishTwitter($account, $post),
                'linkedin' => $this->publishLinkedin($account, $post),
                default => throw new RuntimeException("Unsupported provider: {$account->provider}"),
            };

            $post->update([
                'status' => 'published',
                'published_at' => now(),
                'provider_post_id' => $providerPostId,
                'error' => null,
            ]);

            return $post;
        } catch (\Throwable $e) {
            Log::error('Social publish failed', [
                'post_id' => $post->id,
                'provider' => $account->provider,
                'error' => $e->getMessage(),
            ]);

            return $this->fail($post, $e->getMessage());
        }
    }

    private function graph(): string
    {
        return 'https://graph.facebook.com/'.config('social.graph_version');
    }

    private function publishFacebook(UrpaSocialAccount $account, UrpaSocialPost $post): string
    {
        $pageId = $account->provider_account_id;
        $token = $account->credentials['page_access_token'] ?? $account->token();
        if (! $token) {
            throw new RuntimeException('facebook: missing page access token');
        }

        $image = $post->media[0] ?? null;
        $endpoint = $image ? "{$pageId}/photos" : "{$pageId}/feed";
        $body = $image
            ? ['url' => $image, 'caption' => $post->content, 'access_token' => $token]
            : ['message' => $post->content, 'access_token' => $token];

        $response = Http::asForm()->post("{$this->graph()}/{$endpoint}", $body);
        $this->assertOk($response, 'facebook');

        return (string) ($response->json('post_id') ?? $response->json('id'));
    }

    private function publishInstagram(UrpaSocialAccount $account, UrpaSocialPost $post): string
    {
        $igUserId = $account->provider_account_id;
        $token = $account->credentials['page_access_token'] ?? $account->token();
        $image = $post->media[0] ?? null;
        if (! $token || ! $image) {
            throw new RuntimeException('instagram: an image URL and page token are required');
        }

        // 1. Create the media container.
        $container = Http::asForm()->post("{$this->graph()}/{$igUserId}/media", [
            'image_url' => $image,
            'caption' => $post->content,
            'access_token' => $token,
        ]);
        $this->assertOk($container, 'instagram');
        $creationId = $container->json('id');

        // 2. Publish it.
        $publish = Http::asForm()->post("{$this->graph()}/{$igUserId}/media_publish", [
            'creation_id' => $creationId,
            'access_token' => $token,
        ]);
        $this->assertOk($publish, 'instagram');

        return (string) $publish->json('id');
    }

    private function publishTwitter(UrpaSocialAccount $account, UrpaSocialPost $post): string
    {
        $token = $account->token();
        if (! $token) {
            throw new RuntimeException('twitter: missing access token');
        }

        $response = Http::withToken($token)
            ->post('https://api.twitter.com/2/tweets', ['text' => $post->content]);
        $this->assertOk($response, 'twitter');

        return (string) $response->json('data.id');
    }

    private function publishLinkedin(UrpaSocialAccount $account, UrpaSocialPost $post): string
    {
        $token = $account->token();
        $authorUrn = $account->credentials['author_urn'] ?? null;
        if (! $token || ! $authorUrn) {
            throw new RuntimeException('linkedin: missing access token or author urn');
        }

        $response = Http::withToken($token)
            ->withHeaders(['X-Restli-Protocol-Version' => '2.0.0'])
            ->post('https://api.linkedin.com/v2/ugcPosts', [
                'author' => $authorUrn,
                'lifecycleState' => 'PUBLISHED',
                'specificContent' => [
                    'com.linkedin.ugc.ShareContent' => [
                        'shareCommentary' => ['text' => $post->content],
                        'shareMediaCategory' => 'NONE',
                    ],
                ],
                'visibility' => ['com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC'],
            ]);
        $this->assertOk($response, 'linkedin');

        return (string) ($response->json('id') ?? $response->header('x-restli-id'));
    }

    private function assertOk(\Illuminate\Http\Client\Response $response, string $provider): void
    {
        if ($response->failed()) {
            throw new RuntimeException("{$provider} API error ({$response->status()}): ".$response->body());
        }
    }

    private function fail(UrpaSocialPost $post, string $error): UrpaSocialPost
    {
        $post->update(['status' => 'failed', 'error' => $error]);

        return $post;
    }
}
