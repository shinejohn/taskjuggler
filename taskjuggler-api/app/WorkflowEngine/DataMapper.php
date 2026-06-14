<?php

namespace App\WorkflowEngine;

use Illuminate\Support\Arr;

class DataMapper
{
    public function resolve(
        array $inputMap,
        array $triggerPayload,
        array $context,
        array $stepOutputs,
        ?int $organizationId = null,
    ): array {
        $resolved = [];

        foreach ($inputMap as $key => $mapping) {
            $resolved[$key] = $this->resolveValue($mapping, $triggerPayload, $context, $stepOutputs, $organizationId);
        }

        return $resolved;
    }

    protected function resolveValue(
        mixed $mapping,
        array $triggerPayload,
        array $context,
        array $stepOutputs,
        ?int $organizationId,
    ): mixed {
        if (!is_array($mapping) || !isset($mapping['source'])) {
            return $mapping;
        }

        $source = $mapping['source'];
        $path = $mapping['path'] ?? null;
        $default = $mapping['default'] ?? null;

        return match ($source) {
            'trigger' => data_get($triggerPayload, $path, $default),
            'context' => data_get($context, $path, $default),
            'step' => $this->resolveStepRef($mapping, $stepOutputs, $default),
            'static' => $this->resolveStatic($mapping['value'] ?? $default),
            'template' => $this->resolveTemplate(
                $mapping['template'] ?? '',
                $triggerPayload,
                $context,
                $stepOutputs,
            ),
            default => $default,
        };
    }

    protected function resolveStepRef(array $mapping, array $stepOutputs, mixed $default): mixed
    {
        $stepNum = $mapping['step'] ?? 0;
        $output = $stepOutputs[$stepNum] ?? [];
        $path = $mapping['path'] ?? null;

        return $path ? data_get($output, $path, $default) : $output;
    }

    protected function resolveStatic(mixed $value): mixed
    {
        if (!is_string($value)) return $value;

        if (preg_match('/^\+(\d+)\s+(days?|hours?|minutes?|weeks?|months?)$/', $value, $matches)) {
            return now()->add($matches[1], $matches[2])->toDateTimeString();
        }

        if ($value === 'now') return now()->toDateTimeString();
        if ($value === 'today') return now()->toDateString();

        return $value;
    }

    protected function resolveTemplate(
        string $template,
        array $triggerPayload,
        array $context,
        array $stepOutputs,
    ): string {
        return preg_replace_callback('/\{\{(.*?)\}\}/', function ($matches) use ($triggerPayload, $context, $stepOutputs) {
            $ref = trim($matches[1]);

            if (str_starts_with($ref, 'trigger.')) {
                return (string) data_get($triggerPayload, substr($ref, 8), '');
            }

            if (str_starts_with($ref, 'context.')) {
                return (string) data_get($context, substr($ref, 8), '');
            }

            if (str_starts_with($ref, 'step.')) {
                // step.1.field
                $parts = explode('.', substr($ref, 5), 2);
                $stepNum = (int) $parts[0];
                $path = $parts[1] ?? '';
                return (string) data_get($stepOutputs[$stepNum] ?? [], $path, '');
            }

            return $matches[0];
        }, $template);
    }
}
