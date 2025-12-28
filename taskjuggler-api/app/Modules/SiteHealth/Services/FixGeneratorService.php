<?php

namespace App\Modules\SiteHealth\Services;

use App\Modules\SiteHealth\Models\Issue;
use Illuminate\Support\Facades\Http;

class FixGeneratorService
{
    private string $claudeApiKey;
    private string $claudeApiUrl = 'https://api.anthropic.com/v1/messages';

    public function __construct()
    {
        $this->claudeApiKey = config('services.claude.api_key', env('CLAUDE_API_KEY'));
    }

    public function generate(Issue $issue): array
    {
        $prompt = $this->buildPrompt($issue);

        $response = Http::withHeaders([
            'x-api-key' => $this->claudeApiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->post($this->claudeApiUrl, [
            'model' => 'claude-3-5-sonnet-20241022',
            'max_tokens' => 4096,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $prompt,
                ],
            ],
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to generate fix: ' . $response->body());
        }

        $content = $response->json()['content'][0]['text'] ?? '';
        
        return $this->parseResponse($content, $issue);
    }

    private function buildPrompt(Issue $issue): string
    {
        return <<<PROMPT
You are a web accessibility and code quality expert. Analyze this issue and provide a fix.

Issue: {$issue->title}
Description: {$issue->message}
Category: {$issue->category}
Severity: {$issue->severity}
Page URL: {$issue->page_url}
Selector: {$issue->selector}
HTML Context: {$issue->html_context}
WCAG Criteria: " . json_encode($issue->wcag_criteria) . "

Provide:
1. The exact code fix (before/after or just the fix)
2. A clear explanation of what was wrong and why the fix works
3. Your confidence level (0-100)

Format your response as JSON:
{
  "fix_code": "the exact code fix",
  "explanation": "clear explanation",
  "confidence": 85
}
PROMPT;
    }

    private function parseResponse(string $content, Issue $issue): array
    {
        // Try to extract JSON from response
        if (preg_match('/\{.*\}/s', $content, $matches)) {
            $data = json_decode($matches[0], true);
            if ($data) {
                return [
                    'fix_code' => $data['fix_code'] ?? '',
                    'explanation' => $data['explanation'] ?? '',
                    'confidence' => $data['confidence'] ?? 0,
                ];
            }
        }

        // Fallback parsing
        return [
            'fix_code' => $content,
            'explanation' => 'Generated fix code',
            'confidence' => 70,
        ];
    }
}
