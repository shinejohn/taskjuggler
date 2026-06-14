<?php

namespace App\Services\Workflow\Executors;

use App\Modules\Workflows\Models\WorkflowExecution;
use App\Modules\Workflows\Models\WorkflowNode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseNodeExecutor implements NodeExecutorInterface
{
    public function execute(WorkflowExecution $execution, WorkflowNode $node): array
    {
        $config = $node->config;
        $context = $execution->context_data;
        
        $operation = $config['operation'] ?? 'create'; // create, update, delete, select
        $table = $config['table'];
        $data = $this->substituteVariablesInArray($config['data'] ?? [], $context);
        
        switch ($operation) {
            case 'create':
                // Auto-generate UUID if not provided
                if (!isset($data['id'])) {
                    $data['id'] = Str::uuid()->toString();
                }
                
                // Add timestamps
                if (!isset($data['created_at'])) {
                    $data['created_at'] = now();
                }
                if (!isset($data['updated_at'])) {
                    $data['updated_at'] = now();
                }
                
                DB::table($table)->insert($data);
                return ['id' => $data['id'], 'operation' => 'create'];
                
            case 'update':
                $id = $this->substituteVariables($config['id'], $context);
                if (!$id) {
                    throw new \Exception("Database Update requires an ID");
                }
                
                $data['updated_at'] = now();
                
                DB::table($table)->where('id', $id)->update($data);
                return ['id' => $id, 'operation' => 'update', 'affected_rows' => 1];
                
            case 'select':
                $query = DB::table($table);
                
                foreach ($config['where'] ?? [] as $condition) {
                    $column = $condition['column'];
                    $operator = $condition['operator'] ?? '=';
                    $value = $this->substituteVariables($condition['value'], $context);
                    
                    $query->where($column, $operator, $value);
                }
                
                if ($config['single'] ?? false) {
                    $result = $query->first();
                    return (array) $result;
                } else {
                    return $query->get()->toArray();
                }
                
            default:
                throw new \Exception("Unknown Database Operation: {$operation}");
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
