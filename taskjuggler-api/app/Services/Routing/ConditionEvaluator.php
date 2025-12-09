<?php

namespace App\Services\Routing;

use Illuminate\Support\Collection;

class ConditionEvaluator
{
    public function evaluate(array $condition, array $data, Collection $contactLists): bool
    {
        $field = $condition['field'];
        $operator = $condition['operator'];
        $value = $condition['value'];

        $fieldValue = $this->getFieldValue($field, $data);

        return match ($operator) {
            'equals' => $fieldValue === $value,
            'not_equals' => $fieldValue !== $value,
            'in' => in_array($fieldValue, (array) $value, true),
            'not_in' => !in_array($fieldValue, (array) $value, true),
            'contains' => is_string($fieldValue) && str_contains(strtolower($fieldValue), strtolower($value)),
            'contains_any' => $this->containsAny($fieldValue, (array) $value),
            'contains_all' => $this->containsAll($fieldValue, (array) $value),
            'greater_than' => is_numeric($fieldValue) && $fieldValue > $value,
            'less_than' => is_numeric($fieldValue) && $fieldValue < $value,
            'time_between' => $this->timeBetween($value[0], $value[1]),
            'caller_in_list' => $this->callerInList($data, $value, $contactLists),
            'caller_not_in_list' => !$this->callerInList($data, $value, $contactLists),
            default => false,
        };
    }

    private function getFieldValue(string $field, array $data): mixed
    {
        return match ($field) {
            'category' => $data['category'] ?? null,
            'subcategory' => $data['subcategory'] ?? null,
            'keywords' => $data['keywords'] ?? [],
            'sentiment' => $data['sentiment'] ?? null,
            'summary' => $data['summary'] ?? '',
            'urgency_indicators' => $data['urgency_indicators'] ?? [],
            'source' => $data['source'] ?? null,
            default => $data[$field] ?? null,
        };
    }

    private function containsAny(mixed $fieldValue, array $searchValues): bool
    {
        if (is_array($fieldValue)) {
            $fieldLower = array_map('strtolower', $fieldValue);
            foreach ($searchValues as $search) {
                if (in_array(strtolower($search), $fieldLower, true)) {
                    return true;
                }
            }
            return false;
        }

        if (is_string($fieldValue)) {
            $fieldLower = strtolower($fieldValue);
            foreach ($searchValues as $search) {
                if (str_contains($fieldLower, strtolower($search))) {
                    return true;
                }
            }
        }

        return false;
    }

    private function containsAll(mixed $fieldValue, array $searchValues): bool
    {
        if (is_array($fieldValue)) {
            $fieldLower = array_map('strtolower', $fieldValue);
            foreach ($searchValues as $search) {
                if (!in_array(strtolower($search), $fieldLower, true)) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    private function timeBetween(string $start, string $end): bool
    {
        $now = now()->format('H:i');
        
        if ($start <= $end) {
            return $now >= $start && $now <= $end;
        }
        
        // Overnight range (e.g., 22:00 to 06:00)
        return $now >= $start || $now <= $end;
    }

    private function callerInList(array $data, string $listName, Collection $contactLists): bool
    {
        $list = $contactLists->firstWhere('name', $listName);
        
        if (!$list) {
            return false;
        }

        $callerPhone = $data['contact']['phone'] ?? null;
        $callerEmail = $data['contact']['email'] ?? null;

        foreach ($list->members as $member) {
            if ($callerPhone && $member->phone === $callerPhone) {
                return true;
            }
            if ($callerEmail && strtolower($member->email) === strtolower($callerEmail)) {
                return true;
            }
        }

        return false;
    }
}
