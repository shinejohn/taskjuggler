<?php

namespace App\TaskExchange;

use App\Models\Task;
use App\Models\User;
use App\Models\Actor;
use App\Models\Conversation;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class TaskExchangeFormat
{
    // TEF Versions
    const VERSION_1_0 = '1.0';
    const VERSION_2_0 = '2.0.0';
    const VERSION = self::VERSION_2_0; // Default to 2.0.0
    
    // MIME type
    const MIME_TYPE = 'application/vnd.taskjuggler.tef+json';
    
    // File extension
    const EXTENSION = 'tef';

    /**
     * Convert a Task model to TEF format (backward compatible - defaults to 2.0.0)
     */
    public static function fromTask(Task $task, ?User $sender = null, string $version = self::VERSION_2_0): array
    {
        if ($version === self::VERSION_1_0) {
            return self::fromTaskV1($task, $sender);
        }
        
        return self::fromTaskV2($task, $sender);
    }

    /**
     * Convert a Task model to TEF 1.0 format (backward compatibility)
     */
    public static function fromTaskV1(Task $task, ?User $sender = null): array
    {
        return [
            'tef_version' => self::VERSION_1_0,
            'id' => $task->id,
            'uid' => 'task-' . $task->id . '@taskjuggler.com',
            'sequence' => $task->actions()->count(),
            'created' => $task->created_at->toIso8601String(),
            'modified' => $task->updated_at->toIso8601String(),
            
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status,
            'priority' => $task->priority ?? 'normal',
            'color_state' => $task->color_state ?? 'blue',
            
            'dtstart' => $task->start_date?->toIso8601String(),
            'dtdue' => $task->due_date?->toIso8601String(),
            'expected_completion' => $task->due_date?->toIso8601String(),
            
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
            
            'location' => $task->location_address ? [
                'address' => $task->location_address,
                'unit' => $task->location_unit,
                'city' => $task->location_city,
                'state' => $task->location_state,
                'zip' => $task->location_zip,
                'geo' => $task->location_coords,
            ] : null,
            
            'contact' => [
                'name' => $task->contact_name,
                'phone' => $task->contact_phone,
                'email' => $task->contact_email,
            ],
            
            'tags' => $task->tags ?? [],
            'metadata' => $task->metadata ?? [],
            
            'actions' => [
                'accept' => config('app.url') . '/api/tasks/' . $task->id . '/accept',
                'decline' => config('app.url') . '/api/tasks/' . $task->id . '/decline',
                'view' => config('app.url') . '/api/tasks/' . $task->id,
            ],
            
            'source' => [
                'channel' => $task->source_channel,
                'ref' => $task->source_channel_ref,
            ],
        ];
    }

    /**
     * Convert a Task model to TEF 2.0.0 format
     */
    public static function fromTaskV2(Task $task, ?User $sender = null): array
    {
        // Get or create actors for requestor and owner
        $requestorActor = self::getOrCreateActorForUser($task->requestor);
        $ownerActor = $task->owner ? self::getOrCreateActorForUser($task->owner) : null;
        
        // Get conversation ID if exists
        $conversation = Conversation::where('task_id', $task->id)->first();
        $conversationId = $conversation?->id ?? Str::uuid()->toString();
        
        // Build provenance chain
        $provenance = [
            'original_source' => self::actorToRef($requestorActor),
            'transformation_chain' => [],
            'current_handler' => $ownerActor ? self::actorToRef($ownerActor) : self::actorToRef($requestorActor),
        ];
        
        // Add transformation records from task actions
        if (method_exists($task, 'actions')) {
            foreach ($task->actions()->orderBy('created_at')->get() as $action) {
                $provenance['transformation_chain'][] = [
                    'actor' => self::actorToRef($requestorActor), // Simplified - should get actual actor
                    'action' => $action->action_type ?? 'unknown',
                    'timestamp' => $action->created_at->toIso8601String(),
                    'details' => $action->metadata ?? [],
                ];
            }
        }
        
        // Map status to TEF 2.0.0 status
        $tefStatus = self::mapStatusToTef2($task->status);
        
        // Map priority to TEF 2.0.0 priority
        $tefPriority = self::mapPriorityToTef2($task->priority ?? 'normal');
        
        // Determine task type
        $taskType = self::determineTaskType($task);
        
        return [
            'tef_version' => self::VERSION_2_0,
            'task_id' => $task->id,
            'task_type' => $taskType,
            'title' => $task->title,
            'description' => $task->description,
            'structured_instructions' => self::extractStructuredInstructions($task),
            'priority' => $tefPriority,
            'status' => $tefStatus,
            'requestor' => self::actorToRef($requestorActor),
            'owner' => $ownerActor ? self::actorToRef($ownerActor) : null,
            'watchers' => self::getWatchersForTask($task),
            'timeline' => [
                'requested_by' => $task->due_date?->toIso8601String(),
                'hard_deadline' => $task->due_date?->toIso8601String(),
                'owner_start_date' => $task->start_date?->toIso8601String(),
                'owner_expected_completion' => $task->due_date?->toIso8601String(),
                'timezone' => $task->requestor->timezone ?? config('app.timezone', 'UTC'),
            ],
            'context' => [
                'location' => $task->location_address ? [
                    'address' => $task->location_address,
                    'unit' => $task->location_unit,
                    'city' => $task->location_city,
                    'state' => $task->location_state,
                    'zip' => $task->location_zip,
                    'geo' => $task->location_coords,
                ] : null,
                'contact' => [
                    'name' => $task->contact_name,
                    'phone' => $task->contact_phone,
                    'email' => $task->contact_email,
                ],
                'tags' => $task->tags ?? [],
                'metadata' => $task->metadata ?? [],
            ],
            'provenance' => $provenance,
            'conversation_id' => $conversationId,
            'extensions' => [
                'color_state' => $task->color_state ?? 'blue',
                'source_channel' => $task->source_channel,
                'source_channel_ref' => $task->source_channel_ref,
            ],
        ];
    }

    /**
     * Get or create actor for a user
     */
    private static function getOrCreateActorForUser(?User $user): ?Actor
    {
        if (!$user) {
            return null;
        }
        
        // Check if actor already exists for this user
        $actor = Actor::where('user_id', $user->id)->where('actor_type', Actor::TYPE_HUMAN)->first();
        
        if (!$actor) {
            // Create actor for user
            $actor = Actor::create([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'actor_type' => Actor::TYPE_HUMAN,
                'display_name' => $user->name,
                'user_id' => $user->id,
                'capabilities' => [],
                'contact_methods' => [
                    ['protocol' => 'email', 'endpoint' => $user->email],
                    ...($user->phone ? [['protocol' => 'sms', 'endpoint' => $user->phone]] : []),
                ],
                'status' => Actor::STATUS_ACTIVE,
            ]);
        }
        
        return $actor;
    }

    /**
     * Convert Actor model to ActorRef format
     */
    private static function actorToRef(Actor $actor): array
    {
        return [
            'actor_id' => $actor->id,
            'actor_type' => $actor->actor_type,
            'display_name' => $actor->display_name,
            'capabilities' => $actor->capabilities ?? [],
            'contact_methods' => $actor->contact_methods ?? [],
            'organization_id' => $actor->organization_id,
            'metadata' => $actor->metadata ?? [],
        ];
    }

    /**
     * Map internal status to TEF 2.0.0 status
     */
    public static function mapStatusToTef2(string $status): string
    {
        $mapping = [
            'pending' => 'PENDING',
            'accepted' => 'ACCEPTED',
            'in_progress' => 'IN_PROGRESS',
            'completed' => 'COMPLETED',
            'cancelled' => 'CANCELLED',
            'declined' => 'CANCELLED',
            'watching' => 'PENDING',
            'overdue' => 'IN_PROGRESS',
        ];
        
        return $mapping[strtolower($status)] ?? 'PENDING';
    }

    /**
     * Map internal priority to TEF 2.0.0 priority
     */
    private static function mapPriorityToTef2(string $priority): string
    {
        $mapping = [
            'low' => 'LOW',
            'normal' => 'NORMAL',
            'high' => 'HIGH',
            'urgent' => 'CRITICAL',
        ];
        
        return strtoupper($priority) ?: 'NORMAL';
    }

    /**
     * Determine task type from task data
     */
    private static function determineTaskType(Task $task): string
    {
        // Default to ACTION, but could be enhanced with logic
        // based on task metadata, tags, or other indicators
        $metadata = $task->metadata ?? [];
        
        if (isset($metadata['task_type'])) {
            return strtoupper($metadata['task_type']);
        }
        
        // Check tags for hints
        $tags = $task->tags ?? [];
        if (in_array('meeting', $tags)) {
            return 'MEETING';
        }
        if (in_array('approval', $tags)) {
            return 'APPROVAL';
        }
        if (in_array('payment', $tags)) {
            return 'PAYMENT';
        }
        
        return 'ACTION';
    }

    /**
     * Extract structured instructions from task
     */
    private static function extractStructuredInstructions(Task $task): ?array
    {
        $metadata = $task->metadata ?? [];
        
        if (isset($metadata['structured_instructions'])) {
            return $metadata['structured_instructions'];
        }
        
        // Try to extract from description if it contains structured format
        // This is a simplified version - could be enhanced with AI parsing
        return null;
    }

    /**
     * Get watchers for task
     */
    private static function getWatchersForTask(Task $task): array
    {
        $watchers = [];
        
        // Get users watching this task (via invitations or explicit watch)
        $invitations = $task->invitations()
            ->where('status', 'accepted')
            ->get();
        
        foreach ($invitations as $invitation) {
            if ($invitation->accepted_by_user_id) {
                $user = \App\Models\User::find($invitation->accepted_by_user_id);
                if ($user) {
                    $actor = Actor::where('user_id', $user->id)
                        ->where('actor_type', Actor::TYPE_HUMAN)
                        ->first();
                    if ($actor) {
                        $watchers[] = self::actorToRef($actor);
                    }
                }
            }
        }
        
        return $watchers;
    }

    /**
     * Parse TEF format into task data (supports both 1.0 and 2.0.0)
     */
    public static function toTaskData(array $tef): array
    {
        $version = $tef['tef_version'] ?? self::VERSION_1_0;
        
        if ($version === self::VERSION_2_0) {
            return self::toTaskDataFromV2($tef);
        }
        
        return self::toTaskDataFromV1($tef);
    }

    /**
     * Parse TEF 1.0 format into task data
     */
    private static function toTaskDataFromV1(array $tef): array
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
     * Parse TEF 2.0.0 format into task data
     */
    private static function toTaskDataFromV2(array $tef): array
    {
        $timeline = $tef['timeline'] ?? [];
        $context = $tef['context'] ?? [];
        $location = $context['location'] ?? null;
        $contact = $context['contact'] ?? [];
        
        // Map TEF 2.0.0 status back to internal status
        $status = self::mapTef2StatusToInternal($tef['status'] ?? 'PENDING');
        
        // Map TEF 2.0.0 priority back to internal priority
        $priority = self::mapTef2PriorityToInternal($tef['priority'] ?? 'NORMAL');
        
        return [
            'title' => $tef['title'] ?? 'Untitled Task',
            'description' => $tef['description'] ?? null,
            'status' => $status,
            'priority' => $priority,
            'color_state' => $tef['extensions']['color_state'] ?? 'blue',
            'start_date' => isset($timeline['owner_start_date']) ? Carbon::parse($timeline['owner_start_date']) : null,
            'due_date' => isset($timeline['owner_expected_completion']) 
                ? Carbon::parse($timeline['owner_expected_completion']) 
                : (isset($timeline['hard_deadline']) ? Carbon::parse($timeline['hard_deadline']) : null),
            'location_address' => $location['address'] ?? null,
            'location_unit' => $location['unit'] ?? null,
            'location_city' => $location['city'] ?? null,
            'location_state' => $location['state'] ?? null,
            'location_zip' => $location['zip'] ?? null,
            'location_coords' => $location['geo'] ?? null,
            'contact_name' => $contact['name'] ?? null,
            'contact_phone' => $contact['phone'] ?? null,
            'contact_email' => $contact['email'] ?? null,
            'tags' => $context['tags'] ?? [],
            'metadata' => array_merge($context['metadata'] ?? [], [
                'tef_task_id' => $tef['task_id'] ?? null,
                'tef_version' => $tef['tef_version'] ?? null,
                'tef_task_type' => $tef['task_type'] ?? null,
                'tef_conversation_id' => $tef['conversation_id'] ?? null,
                'structured_instructions' => $tef['structured_instructions'] ?? null,
            ]),
        ];
    }

    /**
     * Map TEF 2.0.0 status to internal status
     */
    private static function mapTef2StatusToInternal(string $status): string
    {
        $mapping = [
            'DRAFT' => 'pending',
            'PENDING' => 'pending',
            'ACCEPTED' => 'accepted',
            'IN_PROGRESS' => 'in_progress',
            'BLOCKED' => 'in_progress',
            'COMPLETED' => 'completed',
            'CANCELLED' => 'cancelled',
        ];
        
        return $mapping[strtoupper($status)] ?? 'pending';
    }

    /**
     * Map TEF 2.0.0 priority to internal priority
     */
    private static function mapTef2PriorityToInternal(string $priority): string
    {
        $mapping = [
            'BACKGROUND' => 'low',
            'LOW' => 'low',
            'NORMAL' => 'normal',
            'HIGH' => 'high',
            'CRITICAL' => 'urgent',
        ];
        
        return $mapping[strtoupper($priority)] ?? 'normal';
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
     * Validate TEF data (supports both 1.0 and 2.0.0)
     */
    public static function validate(array $tef): array
    {
        $version = $tef['tef_version'] ?? self::VERSION_1_0;
        
        if ($version === self::VERSION_2_0) {
            return self::validateV2($tef);
        }
        
        return self::validateV1($tef);
    }

    /**
     * Validate TEF 1.0 data
     */
    private static function validateV1(array $tef): array
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

    /**
     * Validate TEF 2.0.0 data
     */
    private static function validateV2(array $tef): array
    {
        $errors = [];
        
        // Required fields
        if (empty($tef['task_id'])) {
            $errors[] = 'task_id is required';
        }
        
        if (empty($tef['title'])) {
            $errors[] = 'Title is required';
        }
        
        if (empty($tef['requestor'])) {
            $errors[] = 'Requestor actor reference is required';
        }
        
        if (empty($tef['timeline'])) {
            $errors[] = 'Timeline is required';
        }
        
        // Validate timeline
        if (isset($tef['timeline'])) {
            $timeline = $tef['timeline'];
            
            if (isset($timeline['owner_start_date']) && isset($timeline['owner_expected_completion'])) {
                $start = Carbon::parse($timeline['owner_start_date']);
                $due = Carbon::parse($timeline['owner_expected_completion']);
                if ($due->lt($start)) {
                    $errors[] = 'Expected completion cannot be before start date';
                }
            }
            
            if (empty($timeline['timezone'])) {
                $errors[] = 'Timezone is required in timeline';
            }
        }
        
        // Validate actor references
        if (isset($tef['requestor']) && !isset($tef['requestor']['actor_id'])) {
            $errors[] = 'Requestor actor_id is required';
        }
        
        if (isset($tef['owner']) && !isset($tef['owner']['actor_id'])) {
            $errors[] = 'Owner actor_id is required if owner is specified';
        }
        
        return $errors;
    }

    /**
     * Create TEF 2.0.0 envelope for a message
     */
    public static function createEnvelope(
        string $messageType,
        array $sourceActorRef,
        array $targetActorRef,
        string $taskId,
        ?string $correlationId = null,
        ?string $replyToMessageId = null
    ): array {
        return [
            'tef_version' => self::VERSION_2_0,
            'message_id' => Str::uuid()->toString(),
            'message_type' => $messageType,
            'timestamp' => now()->toIso8601String(),
            'correlation_id' => $correlationId ?? Str::uuid()->toString(),
            'task_id' => $taskId,
            'source_actor' => $sourceActorRef,
            'target_actor' => $targetActorRef,
            'reply_to_message_id' => $replyToMessageId,
        ];
    }

    /**
     * Create TASK_CREATE message envelope
     */
    public static function createTaskCreateEnvelope(
        array $task,
        array $sourceActorRef,
        array $targetActorRef
    ): array {
        $envelope = self::createEnvelope(
            'TASK_CREATE',
            $sourceActorRef,
            $targetActorRef,
            $task['task_id'] ?? $task['id'] ?? Str::uuid()->toString()
        );
        
        return array_merge($envelope, ['task' => $task]);
    }
}
