<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaSocialAccount;
use App\Modules\Urpa\Models\UrpaSocialPost;
use App\Services\AI\OpenRouterService;
use Illuminate\Support\Facades\Log;

/**
 * Generates social post drafts for a business, grounded in its Fibonacco CRM
 * profile (name, category, rating, reviews, community) so SMB owners don't have
 * to write posts from scratch.
 */
final class SocialContentService
{
    public function __construct(
        private OpenRouterService $openRouter,
        private FibonaccoCrmService $crm
    ) {}

    /**
     * Draft a post and persist it as a draft (or scheduled) UrpaSocialPost.
     *
     * @param  array<string, mixed>  $options  brief, tone, scheduled_at, auto_publish
     */
    public function generate(UrpaSocialAccount $account, array $options = []): UrpaSocialPost
    {
        $brief = $options['brief'] ?? 'Write an engaging post to promote the business to the local community.';
        $tone = $options['tone'] ?? 'friendly and professional';

        $business = $account->fibonacco_business_id
            ? $this->crm->getBusinessProfile($account->fibonacco_business_id)
            : [];

        $content = $this->draft($account->provider, $brief, $tone, $business);

        $scheduledAt = $options['scheduled_at'] ?? null;

        return UrpaSocialPost::create([
            'user_id' => $account->user_id,
            'social_account_id' => $account->id,
            'fibonacco_business_id' => $account->fibonacco_business_id,
            'content' => $content,
            'status' => $scheduledAt ? 'scheduled' : 'draft',
            'source' => 'ai_generated',
            'scheduled_at' => $scheduledAt,
            'metadata' => ['brief' => $brief, 'tone' => $tone],
        ]);
    }

    /**
     * @param  array<string, mixed>  $business
     */
    private function draft(string $provider, string $brief, string $tone, array $business): string
    {
        $limits = [
            'twitter' => 280,
            'instagram' => 2200,
            'facebook' => 2000,
            'linkedin' => 3000,
        ];
        $limit = $limits[$provider] ?? 1000;

        $context = $this->businessContext($business);

        $system = 'You are a social media manager for a local small business. '
            ."Write a single {$provider} post in a {$tone} tone. "
            ."Keep it under {$limit} characters. Use the business details provided. "
            .'Include relevant hashtags where appropriate. Return only the post text, no preamble.';

        $user = "Business details:\n{$context}\n\nPost brief: {$brief}";

        try {
            $response = $this->openRouter->chat(
                messages: [
                    ['role' => 'system', 'content' => $system],
                    ['role' => 'user', 'content' => $user],
                ],
                model: config('services.openrouter.default_model', 'openai/gpt-4o'),
                temperature: 0.8,
                maxTokens: 800,
            );

            $text = trim($response['choices'][0]['message']['content'] ?? '');

            return $text !== '' ? mb_substr($text, 0, $limit) : $brief;
        } catch (\Throwable $e) {
            Log::error('Social content generation failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
            ]);

            return $brief;
        }
    }

    /**
     * @param  array<string, mixed>  $business
     */
    private function businessContext(array $business): string
    {
        if (empty($business)) {
            return 'No CRM profile linked; rely on the brief.';
        }

        $lines = array_filter([
            'Name: '.($business['name'] ?? ''),
            'Category: '.($business['category'] ?? $business['industry'] ?? ''),
            'City: '.($business['city'] ?? ''),
            'Rating: '.($business['rating'] ?? ''),
            'Description: '.($business['description'] ?? ''),
            'Website: '.($business['website'] ?? ''),
        ], fn ($line) => ! str_ends_with($line, ': '));

        return implode("\n", $lines);
    }
}
