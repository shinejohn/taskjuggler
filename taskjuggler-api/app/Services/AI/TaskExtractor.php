<?php

namespace App\Services\AI;

class TaskExtractor
{
    private OpenRouterService $openRouter;

    private const SYSTEM_PROMPT = <<<'PROMPT'
You are a data extraction assistant for a task management system.

Your job is to extract structured information from incoming messages (phone calls, emails, SMS).
You ONLY extract and classify. You do NOT decide what to do with the message.

For every message, extract:
1. summary: Brief 10-word summary suitable for a task title
2. category: One of: maintenance, scheduling, billing, sales, support, legal, research, general
3. subcategory: More specific classification
4. keywords: Array of relevant terms from the message
5. urgency_indicators: Phrases suggesting time sensitivity
6. sentiment: positive, neutral, negative, frustrated, urgent
7. contact: {name, phone, email} if mentioned
8. location: {address, unit, city, state, zip} if mentioned
9. dates_mentioned: Array of any dates referenced
10. times_mentioned: Array of any times referenced

Respond ONLY with valid JSON. No other text.
PROMPT;

    public function __construct(OpenRouterService $openRouter)
    {
        $this->openRouter = $openRouter;
    }

    public function extract(string $content, string $source): array
    {
        $messages = [
            ['role' => 'system', 'content' => self::SYSTEM_PROMPT],
            ['role' => 'user', 'content' => "Source: {$source}\n\nContent:\n{$content}"],
        ];

        $model = config('services.openrouter.extraction_model', 'openai/gpt-4o');
        
        $result = $this->openRouter->extractJson($messages, $model);

        return $this->normalizeResult($result);
    }

    private function normalizeResult(array $result): array
    {
        return [
            'summary' => $result['summary'] ?? 'New request',
            'category' => $result['category'] ?? 'general',
            'subcategory' => $result['subcategory'] ?? null,
            'keywords' => $result['keywords'] ?? [],
            'urgency_indicators' => $result['urgency_indicators'] ?? [],
            'sentiment' => $result['sentiment'] ?? 'neutral',
            'contact' => [
                'name' => $result['contact']['name'] ?? null,
                'phone' => $result['contact']['phone'] ?? null,
                'email' => $result['contact']['email'] ?? null,
            ],
            'location' => [
                'address' => $result['location']['address'] ?? null,
                'unit' => $result['location']['unit'] ?? null,
                'city' => $result['location']['city'] ?? null,
                'state' => $result['location']['state'] ?? null,
                'zip' => $result['location']['zip'] ?? null,
            ],
            'dates_mentioned' => $result['dates_mentioned'] ?? [],
            'times_mentioned' => $result['times_mentioned'] ?? [],
        ];
    }
}
