<?php

namespace App\Services\Marketplace;

use App\Models\Task;
use App\Models\MarketplaceVendor;
use App\Models\AiToolExecution;
use App\Services\AI\OpenRouterService;
use Illuminate\Support\Facades\Http;

class AiToolExecutor
{
    private OpenRouterService $openRouter;

    public function __construct(OpenRouterService $openRouter)
    {
        $this->openRouter = $openRouter;
    }

    public function execute(Task $task, MarketplaceVendor $vendor): AiToolExecution
    {
        $config = $vendor->aiToolConfig;
        
        if (!$config) {
            throw new \Exception("AI tool configuration not found for vendor {$vendor->id}");
        }

        // Create execution record
        $execution = AiToolExecution::create([
            'task_id' => $task->id,
            'vendor_id' => $vendor->id,
            'config_id' => $config->id,
            'input_data' => $task->extracted_data,
            'status' => AiToolExecution::STATUS_RUNNING,
            'started_at' => now(),
        ]);

        try {
            $result = match ($config->provider) {
                'internal' => $this->executeInternal($task, $config),
                'botjob' => $this->executeBotJob($task, $config),
                'alphasite' => $this->executeAlphaSite($task, $config),
                'fourprojects' => $this->executeFourProjects($task, $config),
                'external' => $this->executeExternal($task, $config),
                default => throw new \Exception("Unknown AI provider: {$config->provider}"),
            };

            $execution->markCompleted(
                $result['data'],
                $result['deliverables'] ?? [],
                $result['tokens'] ?? null,
                $result['cost'] ?? null
            );

            // Attach deliverables to task
            foreach ($result['deliverables'] ?? [] as $deliverable) {
                $task->addDeliverable(
                    $deliverable['url'],
                    $deliverable['type'],
                    $deliverable['metadata'] ?? []
                );
            }

            // Mark task complete if auto-execute
            if ($config->auto_execute) {
                $task->markCompleted();
            }

        } catch (\Exception $e) {
            $execution->markFailed($e->getMessage());
            throw $e;
        }

        return $execution;
    }

    private function executeInternal(Task $task, $config): array
    {
        $prompt = $this->buildPrompt($config->prompt_template, $task);

        $response = $this->openRouter->chat(
            messages: [
                ['role' => 'system', 'content' => 'You are an AI assistant that completes tasks.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            model: $config->model,
            maxTokens: $config->max_tokens,
        );

        $content = $response['choices'][0]['message']['content'];
        $usage = $response['usage'] ?? [];
        $promptTokens = $usage['prompt_tokens'] ?? 0;
        $completionTokens = $usage['completion_tokens'] ?? 0;
        $totalTokens = $usage['total_tokens'] ?? ($promptTokens + $completionTokens);

        return [
            'data' => ['response' => $content],
            'deliverables' => [],
            'tokens' => $totalTokens,
            'cost' => $this->calculateCost($promptTokens, $completionTokens, $config->model),
        ];
    }

    private function executeBotJob(Task $task, $config): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $config->api_key,
        ])->timeout($config->max_execution_time)->post($config->api_endpoint, [
            'task_title' => $task->title,
            'task_description' => $task->description,
            'category' => $task->extracted_data['category'] ?? 'general',
            'metadata' => [
                'contact' => $task->extracted_data['contact'] ?? [],
                'location' => $task->extracted_data['location'] ?? [],
            ],
            'webhook_url' => route('webhooks.ai-tool', ['vendor' => $task->marketplace_vendor_id]),
        ]);

        if (!$response->successful()) {
            throw new \Exception('BotJob API error: ' . $response->body());
        }

        return [
            'data' => $response->json(),
            'deliverables' => $response->json('deliverables', []),
            'cost' => $response->json('cost'),
        ];
    }

    private function executeAlphaSite(Task $task, $config): array
    {
        // Similar implementation for AlphaSite.ai
        // Would call their API to generate websites
        throw new \Exception('AlphaSite integration not yet implemented');
    }

    private function executeFourProjects(Task $task, $config): array
    {
        // Similar implementation for 4Projects.ai
        throw new \Exception('4Projects integration not yet implemented');
    }

    private function executeExternal(Task $task, $config): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $config->api_key,
        ])->timeout($config->max_execution_time)->post($config->api_endpoint, [
            'task' => $task->toArray(),
            'webhook_url' => route('webhooks.ai-tool', ['vendor' => $task->marketplace_vendor_id]),
        ]);

        if (!$response->successful()) {
            throw new \Exception('External AI API error: ' . $response->body());
        }

        return [
            'data' => $response->json(),
            'deliverables' => $response->json('deliverables', []),
            'cost' => $response->json('cost'),
        ];
    }

    private function buildPrompt(string $template, Task $task): string
    {
        $replacements = [
            '{{title}}' => $task->title,
            '{{description}}' => $task->description ?? '',
            '{{category}}' => $task->extracted_data['category'] ?? 'general',
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    /**
     * Calculate cost based on model pricing (per 1M tokens)
     * Prices are from OpenRouter as of December 2024
     * 
     * @param int $promptTokens Input tokens
     * @param int $completionTokens Output tokens
     * @param string $model Model identifier (e.g., 'openai/gpt-4o')
     * @return float Total cost in USD
     */
    private function calculateCost(int $promptTokens, int $completionTokens, string $model): float
    {
        // OpenRouter pricing per 1M tokens (input, output)
        // Format: [input_price_per_1M, output_price_per_1M]
        $pricing = [
            // OpenAI models
            'openai/gpt-5.1' => [1.25, 10.00],
            'openai/gpt-5.1-chat' => [1.25, 10.00],
            'openai/gpt-5.1-codex' => [1.25, 10.00],
            'openai/gpt-4o' => [5.00, 15.00],
            'openai/gpt-4o-mini' => [0.15, 0.60],
            'openai/gpt-4-turbo' => [10.00, 30.00],
            'openai/gpt-4' => [30.00, 60.00],
            'openai/gpt-3.5-turbo' => [0.50, 1.50],
            
            // Anthropic models
            'anthropic/claude-3-opus' => [15.00, 75.00],
            'anthropic/claude-3.5-sonnet' => [3.00, 15.00],
            'anthropic/claude-3-sonnet' => [3.00, 15.00],
            'anthropic/claude-3-haiku' => [0.25, 1.25],
            'anthropic/claude-3-5-haiku' => [0.80, 4.00],
            
            // Google models
            'google/gemini-2.5-flash' => [0.15, 0.60],
            'google/gemini-pro' => [0.50, 1.50],
            'google/gemini-ultra' => [1.25, 5.00],
            
            // Mistral models
            'mistralai/mistral-large-2' => [2.00, 6.00],
            'mistralai/mistral-medium' => [2.70, 8.10],
            'mistralai/mistral-small' => [0.20, 0.60],
            
            // DeepSeek models
            'deepseek/deepseek-coder-v2' => [0.27, 1.10],
            'deepseek/deepseek-chat' => [0.14, 0.28],
        ];

        // Get pricing for model, default to gpt-4o-mini if not found
        $modelPricing = $pricing[$model] ?? $pricing['openai/gpt-4o-mini'];
        [$inputPricePer1M, $outputPricePer1M] = $modelPricing;

        // Calculate cost: (tokens / 1,000,000) * price_per_1M
        $inputCost = ($promptTokens / 1_000_000) * $inputPricePer1M;
        $outputCost = ($completionTokens / 1_000_000) * $outputPricePer1M;
        
        $totalCost = $inputCost + $outputCost;

        // Round to 6 decimal places for precision
        return round($totalCost, 6);
    }
}
