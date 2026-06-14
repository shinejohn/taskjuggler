<?php

namespace App\WorkflowEngine;

class ActionRegistry
{
    protected array $actions = [];

    /**
     * Modules call this at boot to declare their available actions.
     */
    public function register(
        string $module,
        string $actionKey,
        array $definition,
        callable $handler
    ): void {
        $this->actions[$actionKey] = [
            'module' => $module,
            'action_key' => $actionKey,
            'description' => $definition['description'] ?? '',
            'input_schema' => $definition['input_schema'] ?? [],
            'output_schema' => $definition['output_schema'] ?? [],
            'category' => $definition['category'] ?? $module,
            'is_async' => $definition['is_async'] ?? false,
            'handler' => $handler,
        ];
    }

    public function exists(string $actionKey): bool
    {
        return isset($this->actions[$actionKey]);
    }

    public function get(string $actionKey): ?array
    {
        return $this->actions[$actionKey] ?? null;
    }

    public function execute(string $actionKey, array $input): array
    {
        if (!$this->exists($actionKey)) {
            throw new \RuntimeException("Unknown action: {$actionKey}");
        }

        $handler = $this->actions[$actionKey]['handler'];
        return $handler($input);
    }

    public function all(): array
    {
        // Return without the handler closures (for serialization/API)
        return collect($this->actions)->map(function ($action) {
            return collect($action)->except('handler')->toArray();
        })->toArray();
    }

    public function grouped(): array
    {
        $grouped = [];
        foreach ($this->actions as $action) {
            $grouped[$action['module']][] = collect($action)->except('handler')->toArray();
        }
        return $grouped;
    }
}
