<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaSocialAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Reads recent engagement (comments, mentions, reviews) from a social account
 * and records it in the URPA activity feed so the assistant can react to it.
 */
final class SocialReaderService
{
    /**
     * @return array<string, int>
     */
    public function fetchEngagement(UrpaSocialAccount $account): array
    {
        if (! $account->is_active) {
            return ['imported' => 0];
        }

        try {
            $items = match ($account->provider) {
                'facebook' => $this->readFacebook($account),
                'instagram' => $this->readInstagram($account),
                'twitter' => $this->readTwitter($account),
                default => [],
            };
        } catch (\Throwable $e) {
            Log::warning('Social engagement read failed', [
                'account_id' => $account->id,
                'provider' => $account->provider,
                'error' => $e->getMessage(),
            ]);

            return ['imported' => 0];
        }

        $imported = 0;
        foreach ($items as $item) {
            $created = UrpaActivity::firstOrCreate(
                [
                    'user_id' => $account->user_id,
                    'source' => $account->provider,
                    'external_id' => $item['external_id'],
                ],
                [
                    'activity_type' => 'social',
                    'title' => $item['title'],
                    'description' => $item['text'],
                    'raw_content' => $item['raw'],
                    'status' => 'new',
                    'is_read' => false,
                    'activity_timestamp' => $item['timestamp'] ?? now(),
                ]
            );

            if ($created->wasRecentlyCreated) {
                $imported++;
            }
        }

        $account->forceFill(['last_read_at' => now()])->save();

        return ['imported' => $imported];
    }

    private function graph(): string
    {
        return 'https://graph.facebook.com/'.config('social.graph_version');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function readFacebook(UrpaSocialAccount $account): array
    {
        $token = $account->credentials['page_access_token'] ?? $account->token();
        $response = Http::get("{$this->graph()}/{$account->provider_account_id}/feed", [
            'fields' => 'id,message,created_time,comments{id,message,from,created_time}',
            'limit' => 25,
            'access_token' => $token,
        ]);

        if ($response->failed()) {
            return [];
        }

        $items = [];
        foreach ($response->json('data') ?? [] as $post) {
            foreach ($post['comments']['data'] ?? [] as $comment) {
                $items[] = [
                    'external_id' => $comment['id'],
                    'title' => 'Facebook comment',
                    'text' => $comment['message'] ?? '',
                    'timestamp' => $comment['created_time'] ?? null,
                    'raw' => ['post_id' => $post['id'], 'comment' => $comment],
                ];
            }
        }

        return $items;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function readInstagram(UrpaSocialAccount $account): array
    {
        $token = $account->credentials['page_access_token'] ?? $account->token();
        $media = Http::get("{$this->graph()}/{$account->provider_account_id}/media", [
            'fields' => 'id,caption,comments{id,text,username,timestamp}',
            'limit' => 25,
            'access_token' => $token,
        ]);

        if ($media->failed()) {
            return [];
        }

        $items = [];
        foreach ($media->json('data') ?? [] as $post) {
            foreach ($post['comments']['data'] ?? [] as $comment) {
                $items[] = [
                    'external_id' => $comment['id'],
                    'title' => 'Instagram comment',
                    'text' => $comment['text'] ?? '',
                    'timestamp' => $comment['timestamp'] ?? null,
                    'raw' => ['media_id' => $post['id'], 'comment' => $comment],
                ];
            }
        }

        return $items;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function readTwitter(UrpaSocialAccount $account): array
    {
        $token = $account->token();
        $response = Http::withToken($token)
            ->get("https://api.twitter.com/2/users/{$account->provider_account_id}/mentions", [
                'max_results' => 25,
                'tweet.fields' => 'created_at,author_id',
            ]);

        if ($response->failed()) {
            return [];
        }

        $items = [];
        foreach ($response->json('data') ?? [] as $tweet) {
            $items[] = [
                'external_id' => $tweet['id'],
                'title' => 'X mention',
                'text' => $tweet['text'] ?? '',
                'timestamp' => $tweet['created_at'] ?? null,
                'raw' => $tweet,
            ];
        }

        return $items;
    }
}
