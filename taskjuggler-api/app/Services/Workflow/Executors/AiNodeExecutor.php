<?php

namespace App\Services\Workflow\Executors;

use App\Modules\Workflows\Models\WorkflowExecution;
use App\Modules\Workflows\Models\WorkflowNode;
use App\Services\AI\OpenRouterService;
use Illuminate\Support\Facades\Log;

class AiNodeExecutor implements NodeExecutorInterface
{
    public function __construct(
        protected OpenRouterService $openRouter
    ) {}

    public function execute(WorkflowExecution $execution, WorkflowNode $node): array
    {
        $config = $node->config;
        $context = $execution->context_data;
        
        $model = $config['model'] ?? 'openai/gpt-4o-mini';
        $maxTokens = $config['max_tokens'] ?? 1000;
        $temperature = $config['temperature'] ?? 0.7;
        
        // Build prompt with context substitution
        $prompt = $this->substituteVariables($config['prompt_template'], $context);
        
        try {
            $response = $this->openRouter->chat(
                messages: [
                    ['role' => 'system', 'content' => $config['system_prompt'] ?? 'You are a helpful AI assistant executing a workflow step.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                model: $model,
                maxTokens: $maxTokens,
                temperature: $temperature
            );
            
            $content = $response['choices'][0]['message']['content'];
            $usage = $response['usage'] ?? [];
            
            // Try to parse JSON if requested
            if ($config['response_format'] ?? null === 'json') {
                $content = $this->extractJson($content);
            }
            
            return [
                'output' => $content,
                'raw_response' => $response,
                'usage' => $usage
            ];
            
        } catch (\Exception $e) {
            Log::error("AI Node Execution Failed: {$e->getMessage()}", [
                'node_id' => $node->id,
                'model' => $model
            ]);
            throw $e;
        }
    }

    private function substituteVariables(string $text, array $context): string
    {
        return preg_replace_callback('/\{\{\s*([\w\.]+)\s*\}\}/', function ($matches) use ($context) {
            $key = $matches[1];
            return $this->formatValue(data_get($context, $key, $matches[0]));
        }, $text);
    }
    
    private function formatValue($value): string
    {
        if (is_array($value) || is_object($value)) {
            return json_encode($value, JSON_PRETTY_PRINT);
        }
        return (string) $value;
    }
    
    private function extractJson(string $content): mixed
    {
        // Remove markdown code blocks if present
        $clean = preg_replace('/^```json\s*|\s*```$/', '', trim($content));
        $clean = preg_replace('/^```\s*|\s*```$/', '', $clean);
        
        $decoded = json_decode($clean, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }
        
        // Return raw content if parsing fails, let the workflow handle the error or use it as string
        return $content;
    }
}
