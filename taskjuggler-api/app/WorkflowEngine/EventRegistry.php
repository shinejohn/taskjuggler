<?php

namespace App\WorkflowEngine;

class EventRegistry
{
    protected array $events = [];

    /**
     * Modules call this at boot to declare their events.
     */
    public function register(string $module, string $eventKey, array $definition): void
    {
        $this->events[$eventKey] = [
            'module' => $module,
            'event_key' => $eventKey,
            'description' => $definition['description'] ?? '',
            'payload_schema' => $definition['payload'] ?? [],
            'category' => $definition['category'] ?? $module,
        ];
    }

    public function exists(string $eventKey): bool
    {
        return isset($this->events[$eventKey]);
    }

    public function get(string $eventKey): ?array
    {
        return $this->events[$eventKey] ?? null;
    }

    public function all(): array
    {
        return $this->events;
    }

    /**
     * Grouped by module — used by the Workflow Builder UI
     */
    public function grouped(): array
    {
        $grouped = [];
        foreach ($this->events as $event) {
            $grouped[$event['module']][] = $event;
        }
        return $grouped;
    }
}
