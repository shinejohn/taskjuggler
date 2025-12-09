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
        $tokens = $response['usage']['total_tokens'] ?? 0;

        return [
            'data' => ['response' => $content],
            'deliverables' => [],
            'tokens' => $tokens,
            'cost' => $this->calculateCost($tokens, $config->model),
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

    private function calculateCost(int $tokens, string $model): float
    {
        // TODO: Implement cost calculation based on model pricing
        return 0.0;
    }
}
