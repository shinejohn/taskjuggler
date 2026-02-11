<?php

namespace App\Services;

use App\Models\Scanner\Issue;
use Illuminate\Support\Facades\Http;

class ScannerFixGeneratorService
{
    private string $apiKey;
    private string $apiUrl = 'https://api.anthropic.com/v1/messages';

    public function __construct()
    {
        $this->apiKey = config('services.claude.api_key', env('ANTHROPIC_API_KEY', ''));
    }

    public function generate(Issue $issue): array
    {
        if (empty($this->apiKey)) {
            return [
                'fix_code' => '<!-- Set ANTHROPIC_API_KEY to generate AI fixes -->',
                'explanation' => 'Fix generation requires ANTHROPIC_API_KEY.',
                'confidence' => 0,
            ];
        }

        $prompt = $this->buildPrompt($issue);

        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->post($this->apiUrl, [
            'model' => 'claude-sonnet-4-20250514',
            'max_tokens' => 4096,
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to generate fix: ' . $response->body());
        }

        $content = $response->json()['content'][0]['text'] ?? '';
        return $this->parseResponse($content);
    }

    private function buildPrompt(Issue $issue): string
    {
        $wcag = json_encode($issue->wcag_criteria ?? []);

        return <<<PROMPT
You are a web accessibility and code quality expert. Analyze this issue and provide a fix.

Issue: {$issue->title}
Description: {$issue->message}
Category: {$issue->category}
Severity: {$issue->severity}
Page URL: {$issue->page_url}
Selector: {$issue->selector}
HTML Context: {$issue->html_context}
WCAG Criteria: {$wcag}

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

    private function parseResponse(string $content): array
    {
        if (preg_match('/\{[^{}]*\}/s', $content, $matches)) {
            $data = json_decode($matches[0], true);
            if ($data) {
                return [
                    'fix_code' => $data['fix_code'] ?? '',
                    'explanation' => $data['explanation'] ?? '',
                    'confidence' => (int) ($data['confidence'] ?? 0),
                ];
            }
        }

        return [
            'fix_code' => $content,
            'explanation' => 'Generated fix code',
            'confidence' => 70,
        ];
    }
}
