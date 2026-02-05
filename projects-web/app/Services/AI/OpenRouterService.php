<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class OpenRouterService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $defaultModel;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->baseUrl = config('services.openrouter.base_url', 'https://openrouter.ai/api/v1');
        $this->defaultModel = config('services.openrouter.default_model', 'anthropic/claude-3.5-sonnet');
    }

    /**
     * Send a chat completion request
     */
    public function chat(array $messages, ?string $model = null, array $options = []): array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'HTTP-Referer' => config('app.url'),
            'X-Title' => config('app.name'),
            'Content-Type' => 'application/json',
        ])->timeout(60)->post("{$this->baseUrl}/chat/completions", [
            'model' => $model ?? $this->defaultModel,
            'messages' => $messages,
            'temperature' => $options['temperature'] ?? 0.7,
            'max_tokens' => $options['max_tokens'] ?? 1000,
        ]);

        if ($response->failed()) {
            Log::error('OpenRouter API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new Exception('OpenRouter API error: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Simple completion with single prompt
     */
    public function complete(string $prompt, ?string $model = null, array $options = []): string
    {
        $response = $this->chat([
            ['role' => 'user', 'content' => $prompt]
        ], $model, $options);

        return $response['choices'][0]['message']['content'] ?? '';
    }

    /**
     * Extract JSON from AI response
     */
    public function extractJson(string $prompt, ?string $model = null): ?array
    {
        $systemPrompt = "You are a helpful assistant that always responds with valid JSON. Do not include markdown code blocks, just raw JSON.";
        
        $response = $this->chat([
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $prompt]
        ], $model, [
            'temperature' => 0.3,
        ]);

        $content = $response['choices'][0]['message']['content'] ?? '';

        // Try to extract JSON from response
        $content = preg_replace('/```json\s*|\s*```/', '', $content);
        
        if (preg_match('/\{[\s\S]*\}/', $content, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }

        Log::warning('Failed to extract JSON from AI response', [
            'content' => $content,
        ]);

        return null;
    }

    /**
     * Get available models
     */
    public function getModels(): array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
        ])->get("{$this->baseUrl}/models");

        return $response->json()['data'] ?? [];
    }
}


