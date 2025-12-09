<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;

class OpenRouterService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->baseUrl = config('services.openrouter.base_url', 'https://openrouter.ai/api/v1');
    }

    public function chat(
        array $messages,
        string $model = null,
        float $temperature = 0.7,
        bool $jsonMode = false,
        int $maxTokens = 4000
    ): array {
        $model = $model ?? config('services.openrouter.default_model', 'openai/gpt-4o');

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
        ];

        if ($jsonMode) {
            $payload['response_format'] = ['type' => 'json_object'];
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'HTTP-Referer' => config('app.url'),
            'X-Title' => config('app.name'),
        ])->post($this->baseUrl . '/chat/completions', $payload);

        if (!$response->successful()) {
            throw new \Exception('OpenRouter API error: ' . $response->body());
        }

        return $response->json();
    }

    public function extractJson(array $messages, string $model = null): array
    {
        $response = $this->chat($messages, $model, 0.1, true);
        $content = $response['choices'][0]['message']['content'];
        return json_decode($content, true);
    }
}
