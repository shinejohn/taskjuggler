<?php

namespace App\Http\Controllers\Api\TEF;

use App\Http\Controllers\Controller;
use App\Services\TEF\TEFValidator;
use App\Services\TEF\TEFMessageFactory;
use App\Services\TEF\RelationshipService;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\Task;
use App\Models\Actor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function __construct(
        private TEFValidator $validator,
        private TEFMessageFactory $messageFactory,
        private RelationshipService $relationshipService
    ) {}

    /**
     * Send a TEF message
     * POST /api/tef/v1/messages
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|array',
            'message.tef_version' => 'required|string',
            'message.message_type' => 'required|string',
            'message.task_id' => 'required|uuid|exists:tasks,id',
            'message.source_actor' => 'required|array',
            'message.target_actor' => 'required|array',
        ]);

        $message = $validated['message'];

        // Validate message
        $validation = $this->validator->validateMessage($message);
        if (!$validation['valid']) {
            return response()->json([
                'error' => 'Message validation failed',
                'errors' => $validation['errors'],
            ], 422);
        }

        try {
            // Get actors
            $sourceActor = Actor::findOrFail($message['source_actor']['actor_id']);
            $targetActor = Actor::findOrFail($message['target_actor']['actor_id']);
            $task = Task::findOrFail($message['task_id']);

            // Get or create conversation
            $conversation = Conversation::firstOrCreate(
                ['task_id' => $task->id],
                [
                    'participants' => [
                        $sourceActor->id,
                        $targetActor->id,
                    ],
                    'message_count' => 0,
                ]
            );

            // Add participants if not already in conversation
            $conversation->addParticipant($sourceActor->id);
            $conversation->addParticipant($targetActor->id);

            // Create message record
            $messageRecord = Message::create([
                'conversation_id' => $conversation->id,
                'task_id' => $task->id,
                'message_type' => $message['message_type'],
                'source_actor_id' => $sourceActor->id,
                'target_actor_id' => $targetActor->id,
                'reply_to_id' => $message['reply_to_message_id'] ?? null,
                'payload' => $message,
                'delivered_at' => now(),
            ]);

            $conversation->incrementMessageCount();

            // Record relationship history if applicable
            $relationship = \App\Models\Relationship::where('actor_a_id', $sourceActor->id)
                ->where('actor_b_id', $targetActor->id)
                ->first();

            if ($relationship) {
                $eventType = $this->mapMessageTypeToEventType($message['message_type']);
                if ($eventType) {
                    $this->relationshipService->recordHistory(
                        $relationship->id,
                        $sourceActor->id,
                        $targetActor->id,
                        $task->id,
                        $eventType
                    );
                }
            }

            return response()->json([
                'message_id' => $messageRecord->id,
                'conversation_id' => $conversation->id,
                'delivered_at' => $messageRecord->delivered_at->toIso8601String(),
            ], 201);
        } catch (\Exception $e) {
            Log::error('TEF Message: Failed to process', [
                'error' => $e->getMessage(),
                'message' => $message,
            ]);

            return response()->json([
                'error' => 'Failed to process message',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List messages for a conversation or task
     * GET /api/tef/v1/messages?conversation_id={id} or ?task_id={id}
     */
    public function index(Request $request): JsonResponse
    {
        $conversationId = $request->input('conversation_id');
        $taskId = $request->input('task_id');

        if ($conversationId) {
            $messages = Message::where('conversation_id', $conversationId)
                ->with(['sourceActor', 'targetActor', 'replyTo'])
                ->orderBy('created_at')
                ->get();
        } elseif ($taskId) {
            $messages = Message::where('task_id', $taskId)
                ->with(['sourceActor', 'targetActor', 'replyTo'])
                ->orderBy('created_at')
                ->get();
        } else {
            return response()->json(['error' => 'conversation_id or task_id parameter is required'], 400);
        }

        return response()->json([
            'messages' => $messages->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'message_type' => $msg->message_type,
                    'source_actor' => [
                        'id' => $msg->sourceActor->id,
                        'display_name' => $msg->sourceActor->display_name,
                    ],
                    'target_actor' => [
                        'id' => $msg->targetActor->id,
                        'display_name' => $msg->targetActor->display_name,
                    ],
                    'payload' => $msg->payload,
                    'reply_to_id' => $msg->reply_to_id,
                    'delivered_at' => $msg->delivered_at?->toIso8601String(),
                    'read_at' => $msg->read_at?->toIso8601String(),
                    'created_at' => $msg->created_at->toIso8601String(),
                ];
            }),
        ]);
    }

    /**
     * Get message details
     * GET /api/tef/v1/messages/{id}
     */
    public function show(string $id): JsonResponse
    {
        $message = Message::with(['sourceActor', 'targetActor', 'replyTo', 'task', 'conversation'])
            ->findOrFail($id);

        return response()->json([
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'task_id' => $message->task_id,
            'message_type' => $message->message_type,
            'source_actor' => [
                'id' => $message->sourceActor->id,
                'display_name' => $message->sourceActor->display_name,
                'actor_type' => $message->sourceActor->actor_type,
            ],
            'target_actor' => [
                'id' => $message->targetActor->id,
                'display_name' => $message->targetActor->display_name,
                'actor_type' => $message->targetActor->actor_type,
            ],
            'payload' => $message->payload,
            'reply_to_id' => $message->reply_to_id,
            'delivered_at' => $message->delivered_at?->toIso8601String(),
            'read_at' => $message->read_at?->toIso8601String(),
            'created_at' => $message->created_at->toIso8601String(),
        ]);
    }

    /**
     * Mark message as read
     * POST /api/tef/v1/messages/{id}/read
     */
    public function markRead(string $id): JsonResponse
    {
        $message = Message::findOrFail($id);
        $message->markAsRead();

        return response()->json(['message' => 'Message marked as read']);
    }

    /**
     * Map message type to event type for relationship history
     */
    private function mapMessageTypeToEventType(string $messageType): ?string
    {
        return match($messageType) {
            'TASK_CREATE' => \App\Models\RelationshipHistory::EVENT_TASK_SENT,
            'TASK_ACCEPT' => \App\Models\RelationshipHistory::EVENT_TASK_ACCEPTED,
            'TASK_REJECT' => \App\Models\RelationshipHistory::EVENT_TASK_REJECTED,
            'TASK_COMPLETE' => \App\Models\RelationshipHistory::EVENT_TASK_COMPLETED,
            'TASK_CANCEL' => \App\Models\RelationshipHistory::EVENT_TASK_CANCELLED,
            'TASK_DISPUTE' => \App\Models\RelationshipHistory::EVENT_TASK_DISPUTED,
            default => null,
        };
    }
}

