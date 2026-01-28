<?php

namespace App\Modules\OfficialNotice\Services;

use App\Services\AI\OpenRouterService;

class DateExtractionService
{
    private OpenRouterService $openRouter;

    private const SYSTEM_PROMPT = <<<'PROMPT'
You are a precise date extraction AI for legal documents.

Your task is to identify and extract ALL dates, deadlines, and timeframes mentioned in the text.
For each date, identify its context and significance (e.g., "Effective Date", "Payment Due Date", "Termination Notice Deadline").

Respond ONLY with valid JSON in the following format:
{
    "dates": [
        {
            "original_text": "text snippet containing date",
            "iso_date": "YYYY-MM-DD" or null if ambiguous,
            "description": "Short label for this date",
            "is_critical": boolean (true if it implies an action or expiration)
        }
    ]
}
PROMPT;

    public function __construct(OpenRouterService $openRouter)
    {
        $this->openRouter = $openRouter;
    }

    public function extract(string $text): array
    {
        // Limit context for MVP
        $content = substr($text, 0, 10000);

        $messages = [
            ['role' => 'system', 'content' => self::SYSTEM_PROMPT],
            ['role' => 'user', 'content' => "Extract dates from this text:\n\n{$content}"],
        ];

        $model = config('services.openrouter.extraction_model', 'openai/gpt-4o');

        $result = $this->openRouter->extractJson($messages, $model);

        return $result['dates'] ?? [];
    }
}
