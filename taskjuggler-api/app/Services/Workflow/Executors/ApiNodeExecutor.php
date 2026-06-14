<?php

namespace App\Services\Workflow\Executors;

use App\Modules\Workflows\Models\WorkflowExecution;
use App\Modules\Workflows\Models\WorkflowNode;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class ApiNodeExecutor implements NodeExecutorInterface
{
    public function __construct(
        protected Client $client
    ) {}

    public function execute(WorkflowExecution $execution, WorkflowNode $node): array
    {
        $config = $node->config;
        $context = $execution->context_data; // For variable substitution

        $method = strtoupper($config['method'] ?? 'GET');
        $url = $this->substituteVariables($config['url'], $context);
        $headers = $config['headers'] ?? [];
        $body = $config['body'] ?? null;

        if ($body && is_array($body)) {
            // Recursive substitution for body if JSON
            $body = $this->substituteVariablesInArray($body, $context);
        }

        $options = [
            'headers' => $headers,
             // Verify setting. In production this should be true, but often false for local dev/testing
            'verify' => config('app.env') === 'production',
        ];

        if ($body) {
            $options['json'] = $body;
        }

        try {
            $response = $this->client->request($method, $url, $options);
            
            return [
                'status_code' => $response->getStatusCode(),
                'body' => json_decode($response->getBody()->getContents(), true),
                'headers' => $response->getHeaders(),
            ];

        } catch (\Exception $e) {
            Log::error("API Node Execution Failed: {$e->getMessage()}", [
                'node_id' => $node->id,
                'url' => $url
            ]);
            throw $e;
        }
    }

    private function substituteVariables(string $text, array $context): string
    {
        // Simple {{ variable.path }} substitution
        return preg_replace_callback('/\{\{\s*([\w\.]+)\s*\}\}/', function ($matches) use ($context) {
            $key = $matches[1];
            return data_get($context, $key, $matches[0]);
        }, $text);
    }

    private function substituteVariablesInArray(array $data, array $context): array
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = $this->substituteVariables($value, $context);
            } elseif (is_array($value)) {
                $data[$key] = $this->substituteVariablesInArray($value, $context);
            }
        }
        return $data;
    }
}
