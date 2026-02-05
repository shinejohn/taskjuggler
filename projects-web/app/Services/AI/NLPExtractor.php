<?php

namespace App\Services\AI;

use Carbon\Carbon;

class NLPExtractor
{
    public function __construct(
        protected OpenRouterService $openRouter
    ) {}

    /**
     * Extract task details from raw text
     */
    public function extract(string $text): array
    {
        $prompt = <<<PROMPT
Extract task information from the following text and return a JSON object with these fields:
- title: A concise task title (max 100 characters, action-oriented)
- description: The full task description with context
- priority: One of "low", "medium", "high", or "critical" based on urgency words like ASAP, urgent, immediately
- due_date: ISO 8601 date string if a deadline is mentioned (e.g., "by Friday" = this Friday), otherwise null
- owner_mention: Name or email of person mentioned as responsible (after @ or words like "assigned to"), null if none
- tags: Array of relevant category tags (max 5)
- extracted_entities: Object with named entities like {people: [], companies: [], dates: []}

Current date for reference: {$this->getCurrentDate()}

Text to analyze:
---
{$text}
---

Respond with valid JSON only, no markdown formatting.
PROMPT;

        $result = $this->openRouter->extractJson($prompt);

        if (!$result) {
            // Fallback: basic extraction
            return $this->basicExtraction($text);
        }

        return [
            'title' => $this->sanitizeTitle($result['title'] ?? $this->extractTitleFallback($text)),
            'description' => $result['description'] ?? $text,
            'priority' => $this->validatePriority($result['priority'] ?? 'medium'),
            'due_date' => $this->parseDueDate($result['due_date'] ?? null),
            'owner_mention' => $result['owner_mention'] ?? null,
            'tags' => array_slice($result['tags'] ?? [], 0, 5),
            'extracted_entities' => $result['extracted_entities'] ?? [],
        ];
    }

    /**
     * Basic extraction without AI (fallback)
     */
    protected function basicExtraction(string $text): array
    {
        return [
            'title' => $this->extractTitleFallback($text),
            'description' => $text,
            'priority' => $this->detectPriorityFromKeywords($text),
            'due_date' => $this->extractDateFromText($text),
            'owner_mention' => $this->extractMention($text),
            'tags' => [],
            'extracted_entities' => [],
        ];
    }

    /**
     * Extract title from first sentence
     */
    protected function extractTitleFallback(string $text): string
    {
        $firstLine = strtok($text, "\n");
        $firstSentence = preg_split('/[.!?]/', $firstLine)[0] ?? $firstLine;
        return $this->sanitizeTitle($firstSentence);
    }

    /**
     * Clean and truncate title
     */
    protected function sanitizeTitle(string $title): string
    {
        $title = trim(preg_replace('/\s+/', ' ', $title));
        return mb_substr($title, 0, 100);
    }

    /**
     * Validate priority value
     */
    protected function validatePriority(string $priority): string
    {
        $valid = ['low', 'medium', 'high', 'critical'];
        return in_array(strtolower($priority), $valid) ? strtolower($priority) : 'medium';
    }

    /**
     * Detect priority from keywords
     */
    protected function detectPriorityFromKeywords(string $text): string
    {
        $text = strtolower($text);
        
        if (preg_match('/\b(asap|urgent|immediately|critical|emergency)\b/', $text)) {
            return 'critical';
        }
        if (preg_match('/\b(important|high priority|soon)\b/', $text)) {
            return 'high';
        }
        if (preg_match('/\b(when you can|low priority|whenever)\b/', $text)) {
            return 'low';
        }
        
        return 'medium';
    }

    /**
     * Parse due date from various formats
     */
    protected function parseDueDate(?string $date): ?Carbon
    {
        if (!$date) return null;
        
        try {
            return Carbon::parse($date);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Extract date from text using patterns
     */
    protected function extractDateFromText(string $text): ?Carbon
    {
        // Match common patterns
        $patterns = [
            '/by (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i',
            '/by (\d{1,2}\/\d{1,2}\/\d{2,4})/',
            '/due (\d{1,2}\/\d{1,2}\/\d{2,4})/',
            '/by end of (week|month|day)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                try {
                    return Carbon::parse($matches[1]);
                } catch (\Exception $e) {
                    continue;
                }
            }
        }

        return null;
    }

    /**
     * Extract @mention from text
     */
    protected function extractMention(string $text): ?string
    {
        if (preg_match('/@(\w+)/', $text, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Get current date for AI context
     */
    protected function getCurrentDate(): string
    {
        return now()->format('Y-m-d (l)');
    }
}


