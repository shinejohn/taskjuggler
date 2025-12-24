<?php

namespace App\Services\MessageRouter\Adapters;

use App\TaskExchange\TaskExchangeFormat;

/**
 * Trait for adapters to handle both TEF 1.0 and TEF 2.0.0 formats
 */
trait HandlesTefFormats
{
    /**
     * Extract task data from TEF format (handles both 1.0 and 2.0.0)
     * Returns normalized task data array
     */
    protected function extractTaskData(array $tef): array
    {
        // Check if this is a TEF 2.0.0 envelope
        if (isset($tef['message_type']) && isset($tef['task'])) {
            // TEF 2.0.0 envelope format - extract task from envelope
            $taskData = $tef['task'];
            $version = $taskData['tef_version'] ?? TaskExchangeFormat::VERSION_2_0;
        } else {
            // Could be TEF 1.0 or TEF 2.0.0 task format directly
            $taskData = $tef;
            // Default to 2.0.0 if no version specified (new default)
            $version = $taskData['tef_version'] ?? TaskExchangeFormat::VERSION_2_0;
            
            // Detect TEF 1.0 by presence of specific fields
            if (!isset($taskData['tef_version']) && isset($taskData['uid']) && isset($taskData['organizer'])) {
                // Likely TEF 1.0 format (has uid and organizer fields)
                $version = TaskExchangeFormat::VERSION_1_0;
            }
        }

        // Normalize to a common format for adapters
        if ($version === TaskExchangeFormat::VERSION_2_0) {
            return $this->normalizeTef2ToAdapterFormat($taskData);
        }

        // TEF 1.0 format - return as-is (already in adapter format)
        return $taskData;
    }

    /**
     * Normalize TEF 2.0.0 format to adapter-compatible format (similar to TEF 1.0 structure)
     */
    protected function normalizeTef2ToAdapterFormat(array $tef2): array
    {
        $timeline = $tef2['timeline'] ?? [];
        $context = $tef2['context'] ?? [];
        $location = $context['location'] ?? null;
        $contact = $context['contact'] ?? [];

        // Map TEF 2.0.0 to TEF 1.0-like structure for adapters
        $normalized = [
            'id' => $tef2['task_id'] ?? $tef2['id'] ?? null,
            'uid' => 'task-' . ($tef2['task_id'] ?? $tef2['id'] ?? 'unknown') . '@taskjuggler.com',
            'title' => $tef2['title'] ?? 'Untitled Task',
            'description' => $tef2['description'] ?? null,
            'status' => $tef2['status'] ?? 'pending',
            'priority' => $tef2['priority'] ?? 'NORMAL',
            'dtdue' => $timeline['owner_expected_completion'] ?? $timeline['hard_deadline'] ?? null,
            'dtstart' => $timeline['owner_start_date'] ?? null,
            'expected_completion' => $timeline['owner_expected_completion'] ?? null,
            'organizer' => $this->extractActorInfo($tef2['requestor'] ?? null),
            'assignee' => $this->extractActorInfo($tef2['owner'] ?? null),
            'location' => $location ? [
                'address' => $location['address'] ?? null,
                'unit' => $location['unit'] ?? null,
                'city' => $location['city'] ?? null,
                'state' => $location['state'] ?? null,
                'zip' => $location['zip'] ?? null,
                'geo' => $location['geo'] ?? null,
            ] : null,
            'contact' => [
                'name' => $contact['name'] ?? null,
                'phone' => $contact['phone'] ?? null,
                'email' => $contact['email'] ?? null,
            ],
            'tags' => $context['tags'] ?? [],
            'metadata' => $context['metadata'] ?? [],
            'color_state' => $tef2['extensions']['color_state'] ?? 'blue',
            'actions' => [
                'accept' => config('app.url') . '/api/tasks/' . ($tef2['task_id'] ?? $tef2['id'] ?? '') . '/accept',
                'decline' => config('app.url') . '/api/tasks/' . ($tef2['task_id'] ?? $tef2['id'] ?? '') . '/decline',
                'view' => config('app.url') . '/api/tasks/' . ($tef2['task_id'] ?? $tef2['id'] ?? ''),
            ],
            'source' => [
                'channel' => $tef2['extensions']['source_channel'] ?? null,
                'ref' => $tef2['extensions']['source_channel_ref'] ?? null,
            ],
            'tef_version' => TaskExchangeFormat::VERSION_2_0,
        ];

        return $normalized;
    }

    /**
     * Extract actor info from TEF 2.0.0 actor reference
     */
    protected function extractActorInfo(?array $actorRef): ?array
    {
        if (!$actorRef) {
            return null;
        }

        // Extract contact methods
        $email = null;
        $phone = null;
        $name = $actorRef['display_name'] ?? null;

        if (isset($actorRef['contact_methods']) && is_array($actorRef['contact_methods'])) {
            foreach ($actorRef['contact_methods'] as $method) {
                if (($method['protocol'] ?? null) === 'email') {
                    $email = $method['endpoint'] ?? null;
                }
                if (($method['protocol'] ?? null) === 'sms' || ($method['protocol'] ?? null) === 'phone') {
                    $phone = $method['endpoint'] ?? null;
                }
            }
        }

        return [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
        ];
    }
}
