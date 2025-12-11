<?php

namespace App\TaskExchange;

use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;

class TaskExchangeFormat
{
    // TEF Version
    const VERSION = '1.0';
    
    // MIME type
    const MIME_TYPE = 'application/vnd.taskjuggler.tef+json';
    
    // File extension
    const EXTENSION = 'tef';

    /**
     * Convert a Task model to TEF format
     */
    public static function fromTask(Task $task, ?User $sender = null): array
    {
        return [
            'tef_version' => self::VERSION,
            'id' => $task->id,
            'uid' => 'task-' . $task->id . '@taskjuggler.com',
            'sequence' => $task->actions()->count(), // Version number
            'created' => $task->created_at->toIso8601String(),
            'modified' => $task->updated_at->toIso8601String(),
            
            // Task content
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status,
            'priority' => $task->priority ?? 'normal',
            'color_state' => $task->color_state ?? 'blue',
            
            // Timeline
            'dtstart' => $task->start_date?->toIso8601String(),
            'dtdue' => $task->due_date?->toIso8601String(),
            'expected_completion' => $task->due_date?->toIso8601String(),
            
            // Participants
            'organizer' => $task->requestor ? [
                'name' => $task->requestor->name,
                'email' => $task->requestor->email,
                'phone' => $task->requestor->phone,
            ] : null,
            'assignee' => $task->owner ? [
                'name' => $task->owner->name,
                'email' => $task->owner->email,
                'phone' => $task->owner->phone,
            ] : null,
            
            // Location
            'location' => $task->location_address ? [
                'address' => $task->location_address,
                'unit' => $task->location_unit,
                'city' => $task->location_city,
                'state' => $task->location_state,
                'zip' => $task->location_zip,
                'geo' => $task->location_coords,
            ] : null,
            
            // Contact
            'contact' => [
                'name' => $task->contact_name,
                'phone' => $task->contact_phone,
                'email' => $task->contact_email,
            ],
            
            // Metadata
            'tags' => $task->tags ?? [],
            'metadata' => $task->metadata ?? [],
            
            // Action URLs (for responding)
            'actions' => [
                'accept' => config('app.url') . '/api/tasks/' . $task->id . '/accept',
                'decline' => config('app.url') . '/api/tasks/' . $task->id . '/decline',
                'view' => config('app.url') . '/api/tasks/' . $task->id,
            ],
            
            // Source tracking
            'source' => [
                'channel' => $task->source_channel,
                'ref' => $task->source_channel_ref,
            ],
        ];
    }

    /**
     * Parse TEF format into task data
     */
    public static function toTaskData(array $tef): array
    {
        return [
            'title' => $tef['title'] ?? 'Untitled Task',
            'description' => $tef['description'] ?? null,
            'status' => $tef['status'] ?? Task::STATUS_PENDING,
            'priority' => $tef['priority'] ?? 'normal',
            'color_state' => $tef['color_state'] ?? 'blue',
            'start_date' => isset($tef['dtstart']) ? Carbon::parse($tef['dtstart']) : null,
            'due_date' => isset($tef['dtdue']) || isset($tef['expected_completion']) 
                ? Carbon::parse($tef['dtdue'] ?? $tef['expected_completion']) 
                : null,
            'location_address' => $tef['location']['address'] ?? null,
            'location_unit' => $tef['location']['unit'] ?? null,
            'location_city' => $tef['location']['city'] ?? null,
            'location_state' => $tef['location']['state'] ?? null,
            'location_zip' => $tef['location']['zip'] ?? null,
            'location_coords' => $tef['location']['geo'] ?? null,
            'contact_name' => $tef['contact']['name'] ?? null,
            'contact_phone' => $tef['contact']['phone'] ?? null,
            'contact_email' => $tef['contact']['email'] ?? null,
            'tags' => $tef['tags'] ?? [],
            'metadata' => array_merge($tef['metadata'] ?? [], [
                'tef_uid' => $tef['uid'] ?? null,
                'tef_version' => $tef['tef_version'] ?? null,
            ]),
        ];
    }

    /**
     * Generate TEF as JSON string
     */
    public static function toJson(Task $task): string
    {
        return json_encode(self::fromTask($task), JSON_PRETTY_PRINT);
    }

    /**
     * Generate TEF as downloadable file content
     */
    public static function toFile(Task $task): array
    {
        return [
            'content' => self::toJson($task),
            'filename' => Str::slug($task->title) . '.' . self::EXTENSION,
            'mime_type' => self::MIME_TYPE,
        ];
    }

    /**
     * Parse TEF from JSON string
     */
    public static function fromJson(string $json): array
    {
        $data = json_decode($json, true);
        
        if (!$data || !isset($data['tef_version'])) {
            throw new \InvalidArgumentException('Invalid TEF format');
        }
        
        return self::toTaskData($data);
    }

    /**
     * Validate TEF data
     */
    public static function validate(array $tef): array
    {
        $errors = [];
        
        if (empty($tef['title'])) {
            $errors[] = 'Title is required';
        }
        
        if (!empty($tef['dtdue']) && !empty($tef['dtstart'])) {
            $start = Carbon::parse($tef['dtstart']);
            $due = Carbon::parse($tef['dtdue']);
            if ($due->lt($start)) {
                $errors[] = 'Due date cannot be before start date';
            }
        }
        
        return $errors;
    }
}
