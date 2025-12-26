<?php

namespace App\Services\TEF;

use App\TaskExchange\TaskExchangeFormat;
use App\Models\Task;
use App\Models\Actor;
use Illuminate\Support\Str;

class TEFMessageFactory
{
    private const TEF_VERSION = TaskExchangeFormat::VERSION_2_0;

    /**
     * Create TEF envelope
     */
    public function createEnvelope(
        string $messageType,
        Actor $sourceActor,
        Actor $targetActor,
        string $taskId,
        ?string $correlationId = null,
        ?string $replyToMessageId = null
    ): array {
        return TaskExchangeFormat::createEnvelope(
            $messageType,
            $this->actorToRef($sourceActor),
            $this->actorToRef($targetActor),
            $taskId,
            $correlationId,
            $replyToMessageId
        );
    }

    /**
     * Create TASK_CREATE message
     */
    public function createTaskCreate(
        Task $task,
        Actor $sourceActor,
        Actor $targetActor
    ): array {
        $taskData = TaskExchangeFormat::fromTaskV2($task);
        
        $envelope = $this->createEnvelope(
            'TASK_CREATE',
            $sourceActor,
            $targetActor,
            $task->id
        );
        
        return array_merge($envelope, ['task' => $taskData]);
    }

    /**
     * Create TASK_ACCEPT message
     */
    public function createTaskAccept(
        string $taskId,
        string $correlationId,
        Actor $sourceActor,
        Actor $targetActor,
        ?array $timeline = null
    ): array {
        $envelope = $this->createEnvelope(
            'TASK_ACCEPT',
            $sourceActor,
            $targetActor,
            $taskId,
            $correlationId
        );
        
        $message = $envelope;
        
        if ($timeline) {
            $message['timeline'] = $timeline;
        }
        
        return $message;
    }

    /**
     * Create TASK_COMPLETE message
     */
    public function createTaskComplete(
        string $taskId,
        string $correlationId,
        Actor $sourceActor,
        Actor $targetActor,
        array $results
    ): array {
        $envelope = $this->createEnvelope(
            'TASK_COMPLETE',
            $sourceActor,
            $targetActor,
            $taskId,
            $correlationId
        );
        
        return array_merge($envelope, ['results' => $results]);
    }

    /**
     * Create TASK_REJECT message
     */
    public function createTaskReject(
        string $taskId,
        string $correlationId,
        Actor $sourceActor,
        Actor $targetActor,
        ?string $reason = null
    ): array {
        $envelope = $this->createEnvelope(
            'TASK_REJECT',
            $sourceActor,
            $targetActor,
            $taskId,
            $correlationId
        );
        
        $message = $envelope;
        
        if ($reason) {
            $message['reason'] = $reason;
        }
        
        return $message;
    }

    /**
     * Create TASK_CLARIFICATION_REQUEST message
     */
    public function createClarificationRequest(
        string $taskId,
        string $correlationId,
        Actor $sourceActor,
        Actor $targetActor,
        string $question,
        ?array $context = null
    ): array {
        $envelope = $this->createEnvelope(
            'TASK_CLARIFICATION_REQUEST',
            $sourceActor,
            $targetActor,
            $taskId,
            $correlationId
        );
        
        $message = array_merge($envelope, ['question' => $question]);
        
        if ($context) {
            $message['context'] = $context;
        }
        
        return $message;
    }

    /**
     * Create TASK_CLARIFICATION_RESPONSE message
     */
    public function createClarificationResponse(
        string $taskId,
        string $correlationId,
        Actor $sourceActor,
        Actor $targetActor,
        string $replyToMessageId,
        string $response,
        ?array $additionalInstructions = null
    ): array {
        $envelope = $this->createEnvelope(
            'TASK_CLARIFICATION_RESPONSE',
            $sourceActor,
            $targetActor,
            $taskId,
            $correlationId,
            $replyToMessageId
        );
        
        $message = array_merge($envelope, ['response' => $response]);
        
        if ($additionalInstructions) {
            $message['additional_instructions'] = $additionalInstructions;
        }
        
        return $message;
    }

    /**
     * Create TASK_STATUS_UPDATE message
     */
    public function createTaskStatusUpdate(
        string $taskId,
        string $correlationId,
        Actor $sourceActor,
        Actor $targetActor,
        string $status,
        ?string $reason = null
    ): array {
        $envelope = $this->createEnvelope(
            'TASK_STATUS_UPDATE',
            $sourceActor,
            $targetActor,
            $taskId,
            $correlationId
        );
        
        $message = array_merge($envelope, ['status' => $status]);
        
        if ($reason) {
            $message['reason'] = $reason;
        }
        
        return $message;
    }

    /**
     * Convert Actor to ActorRef
     */
    private function actorToRef(Actor $actor): array
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
}

