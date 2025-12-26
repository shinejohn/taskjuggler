<?php

namespace App\Services\TEF;

use App\Models\Actor;
use App\Models\Relationship;
use App\Models\Task;
use App\TaskExchange\TaskExchangeFormat;

class TEFValidator
{
    // Valid state transitions
    private const STATE_MACHINE = [
        'DRAFT' => ['PENDING', 'CANCELLED'],
        'PENDING' => ['ACCEPTED', 'CANCELLED'],
        'ACCEPTED' => ['IN_PROGRESS', 'CANCELLED'],
        'IN_PROGRESS' => ['COMPLETED', 'BLOCKED', 'CANCELLED'],
        'BLOCKED' => ['IN_PROGRESS', 'CANCELLED'],
        'COMPLETED' => [], // Terminal state (can REOPEN)
        'CANCELLED' => [], // Terminal state
    ];

    /**
     * Validate a TEF message
     */
    public function validateMessage(array $message): array
    {
        $errors = [];
        
        // 1. Schema validation
        $schemaErrors = $this->validateSchema($message);
        $errors = array_merge($errors, $schemaErrors);
        
        // 2. Actor validation
        $actorErrors = $this->validateActors($message);
        $errors = array_merge($errors, $actorErrors);
        
        // 3. Relationship validation
        $relationshipErrors = $this->validateRelationship($message);
        $errors = array_merge($errors, $relationshipErrors);
        
        // 4. State transition validation (for status updates)
        if (isset($message['message_type']) && $message['message_type'] === 'TASK_STATUS_UPDATE') {
            $transitionErrors = $this->validateStateTransition($message);
            $errors = array_merge($errors, $transitionErrors);
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Validate schema
     */
    private function validateSchema(array $message): array
    {
        $errors = [];
        
        // Check required envelope fields
        $requiredFields = ['tef_version', 'message_id', 'message_type', 'timestamp', 'correlation_id', 'task_id', 'source_actor', 'target_actor'];
        
        foreach ($requiredFields as $field) {
            if (!isset($message[$field])) {
                $errors[] = "Missing required field: {$field}";
            }
        }
        
        // Validate TEF version
        if (isset($message['tef_version']) && !in_array($message['tef_version'], [TaskExchangeFormat::VERSION_1_0, TaskExchangeFormat::VERSION_2_0])) {
            $errors[] = "Invalid TEF version: {$message['tef_version']}";
        }
        
        // Validate message type
        $validMessageTypes = [
            'TASK_CREATE', 'TASK_ACCEPT', 'TASK_REJECT', 'TASK_DELEGATE',
            'TASK_STATUS_UPDATE', 'TASK_COMPLETE', 'TASK_CANCEL', 'TASK_REOPEN',
            'TASK_MESSAGE', 'TASK_CLARIFICATION_REQUEST', 'TASK_CLARIFICATION_RESPONSE',
            'TASK_ATTACHMENT_ADD', 'TASK_PROGRESS_REPORT', 'TASK_TIMELINE_UPDATE',
            'TASK_DISPUTE', 'TASK_RESOLUTION',
        ];
        
        if (isset($message['message_type']) && !in_array($message['message_type'], $validMessageTypes)) {
            $errors[] = "Invalid message type: {$message['message_type']}";
        }
        
        // Validate task data if present
        if (isset($message['task'])) {
            $taskErrors = TaskExchangeFormat::validate($message['task']);
            $errors = array_merge($errors, $taskErrors);
        }
        
        return $errors;
    }

    /**
     * Validate actors
     */
    private function validateActors(array $message): array
    {
        $errors = [];
        
        // Validate source actor
        if (isset($message['source_actor'])) {
            $sourceErrors = $this->validateActorRef($message['source_actor'], 'source_actor');
            $errors = array_merge($errors, $sourceErrors);
            
            // Check if actor exists
            if (isset($message['source_actor']['actor_id'])) {
                $actor = Actor::find($message['source_actor']['actor_id']);
                if (!$actor) {
                    $errors[] = 'Source actor not found';
                } elseif (!$actor->isActive()) {
                    $errors[] = 'Source actor is not active';
                }
            }
        }
        
        // Validate target actor
        if (isset($message['target_actor'])) {
            $targetErrors = $this->validateActorRef($message['target_actor'], 'target_actor');
            $errors = array_merge($errors, $targetErrors);
            
            // Check if actor exists
            if (isset($message['target_actor']['actor_id'])) {
                $actor = Actor::find($message['target_actor']['actor_id']);
                if (!$actor) {
                    $errors[] = 'Target actor not found';
                } elseif (!$actor->isActive()) {
                    $errors[] = 'Target actor is not active';
                }
            }
        }
        
        return $errors;
    }

    /**
     * Validate actor reference
     */
    private function validateActorRef(array $actorRef, string $prefix = ''): array
    {
        $errors = [];
        
        $requiredFields = ['actor_id', 'actor_type', 'display_name'];
        
        foreach ($requiredFields as $field) {
            if (!isset($actorRef[$field])) {
                $errors[] = "Missing required field in {$prefix}: {$field}";
            }
        }
        
        // Validate actor type
        if (isset($actorRef['actor_type'])) {
            $validTypes = [Actor::TYPE_HUMAN, Actor::TYPE_AI_AGENT, Actor::TYPE_TEAM, Actor::TYPE_IOT_DEVICE, Actor::TYPE_IOT_GATEWAY];
            if (!in_array($actorRef['actor_type'], $validTypes)) {
                $errors[] = "Invalid actor type in {$prefix}: {$actorRef['actor_type']}";
            }
        }
        
        return $errors;
    }

    /**
     * Validate relationship
     */
    private function validateRelationship(array $message): array
    {
        $errors = [];
        
        if (!isset($message['source_actor']['actor_id']) || !isset($message['target_actor']['actor_id'])) {
            return $errors; // Can't validate without actor IDs
        }
        
        $sourceActorId = $message['source_actor']['actor_id'];
        $targetActorId = $message['target_actor']['actor_id'];
        
        // Check if relationship exists
        $relationship = Relationship::where('actor_a_id', $sourceActorId)
            ->where('actor_b_id', $targetActorId)
            ->first();
        
        if (!$relationship) {
            // For TASK_CREATE, relationship might not exist yet (will be created)
            if ($message['message_type'] !== 'TASK_CREATE') {
                $errors[] = 'No relationship exists between source and target actors';
            }
        } elseif ($relationship->isExpired()) {
            $errors[] = 'Relationship has expired';
        }
        
        return $errors;
    }

    /**
     * Validate state transition
     */
    private function validateStateTransition(array $message): array
    {
        $errors = [];
        
        if (!isset($message['status']) || !isset($message['task_id'])) {
            return $errors;
        }
        
        $task = Task::find($message['task_id']);
        
        if (!$task) {
            $errors[] = 'Task not found';
            return $errors;
        }
        
        // Map internal status to TEF 2.0.0 status
        $currentStatus = TaskExchangeFormat::mapStatusToTef2($task->status);
        $newStatus = $message['status'];
        
        if (!$this->isValidTransition($currentStatus, $newStatus)) {
            $errors[] = "Invalid state transition from {$currentStatus} to {$newStatus}";
        }
        
        return $errors;
    }

    /**
     * Check if state transition is valid
     */
    public function isValidTransition(string $from, string $to): bool
    {
        return in_array($to, self::STATE_MACHINE[$from] ?? []);
    }
}

