<?php

namespace App\Modules\OfficialNotice\Services;

use App\Services\AI\OpenRouterService;

class ContractAnalysisService
{
    private OpenRouterService $openRouter;

    private const SYSTEM_PROMPT = <<<'PROMPT'
You are an expert legal AI assistant specializing in contract analysis and risk assessment.

Your task is to analyze the provided contract text and extract valid JSON containing:
1. summary: A 2-sentence summary of the document's purpose.
2. parties: Array of identified parties (names, roles).
3. sections: Array of objects, each representing a clause or section.
   - type: e.g., 'termination', 'indemnification', 'payment', 'confidentiality', 'general'
   - content: The exact text of the clause (short excerpt or full text if short).
   - risk_score: Integer 0-100 (0=safe, 100=high risk/unusual).
   - analysis: Brief explanation of why it is high risk or standard.
4. critical_dates: Array of extraction objects:
   - title: e.g. "Lease Expiration", "Renewal Notification Deadline"
   - due_date: ISO 8601 date (YYYY-MM-DD) or "relative" description if specific date unknown.
   - context: nearby text supporting this date.
   - reminder_days_before: Suggest a default integer (e.g. 30, 60, 90).

Respond ONLY with valid JSON.
PROMPT;

    public function __construct(OpenRouterService $openRouter)
    {
        $this->openRouter = $openRouter;
    }

    public function analyze(string $text): array
    {
        // Simple chunking check - in production we'd chunk larger docs
        $content = substr($text, 0, 50000); // Limit context for MVP

        $messages = [
            ['role' => 'system', 'content' => self::SYSTEM_PROMPT],
            ['role' => 'user', 'content' => "Analyze this contract:\n\n{$content}"],
        ];

        $model = config('services.openrouter.analysis_model', 'openai/gpt-4o');

        return $this->openRouter->extractJson($messages, $model);
    }
}
