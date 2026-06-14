<?php

namespace App\WorkflowEngine;

class ConditionEvaluator
{
    /**
     * Evaluate trigger-level conditions against the event payload.
     */
    public function evaluate(array $conditions, array $payload): bool
    {
        if (empty($conditions)) {
            return true;
        }

        foreach ($conditions as $condition) {
            if (!$this->evaluateOne($condition, $payload)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Evaluate step-level conditions.
     */
    public function evaluateStepConditions(array $conditions, array $fullContext): bool
    {
        if (empty($conditions)) {
            return true;
        }

        foreach ($conditions as $condition) {
            $field = $condition['field'] ?? '';

            // Resolve the value from the right source
            if (str_starts_with($field, 'trigger.')) {
                $path = substr($field, 8);
                $data = $fullContext['trigger'] ?? [];
            } elseif (str_starts_with($field, 'context.')) {
                $path = substr($field, 8);
                $data = $fullContext['context'] ?? [];
            } else {
                $path = $field;
                $data = $fullContext['trigger'] ?? [];
            }

            $conditionToEval = array_merge($condition, ['field' => $path]);
            if (!$this->evaluateOne($conditionToEval, $data)) {
                return false;
            }
        }

        return true;
    }

    protected function evaluateOne(array $condition, array $data): bool
    {
        $field = $condition['field'] ?? '';
        $operator = $condition['operator'] ?? 'equals';
        $expected = $condition['value'] ?? null;

        $actual = data_get($data, $field);

        return match ($operator) {
            'equals'           => $actual == $expected,
            'not_equals'       => $actual != $expected,
            'contains'         => is_string($actual) && str_contains($actual, $expected),
            'starts_with'      => is_string($actual) && str_starts_with($actual, $expected),
            'ends_with'        => is_string($actual) && str_ends_with($actual, $expected),
            'greater_than'     => is_numeric($actual) && $actual > $expected,
            'less_than'        => is_numeric($actual) && $actual < $expected,
            'greater_or_equal' => is_numeric($actual) && $actual >= $expected,
            'less_or_equal'    => is_numeric($actual) && $actual <= $expected,
            'in'               => is_array($expected) && in_array($actual, $expected),
            'not_in'           => is_array($expected) && !in_array($actual, $expected),
            'is_empty'         => empty($actual),
            'not_empty'        => !empty($actual),
            'is_true'          => $actual === true || $actual === 1 || $actual === '1',
            'is_false'         => $actual === false || $actual === 0 || $actual === '0',
            default            => false,
        };
    }
}
