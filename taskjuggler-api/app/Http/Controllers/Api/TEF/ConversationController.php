<?php

namespace App\Http\Controllers\Api\TEF;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConversationController extends Controller
{
    /**
     * Get conversation details
     * GET /api/tef/v1/conversations/{id}
     */
    public function show(string $id): JsonResponse
    {
        $conversation = Conversation::with(['task', 'messages.sourceActor', 'messages.targetActor'])
            ->findOrFail($id);

        return response()->json([
            'id' => $conversation->id,
            'task_id' => $conversation->task_id,
            'task_title' => $conversation->task->title,
            'participants' => $conversation->participants,
            'message_count' => $conversation->message_count,
            'last_message_at' => $conversation->last_message_at?->toIso8601String(),
            'messages' => $conversation->messages->map(function ($msg) {
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
                    'created_at' => $msg->created_at->toIso8601String(),
                ];
            }),
            'created_at' => $conversation->created_at->toIso8601String(),
        ]);
    }

    /**
     * Get conversation by task ID
     * GET /api/tef/v1/conversations/task/{taskId}
     */
    public function byTask(string $taskId): JsonResponse
    {
        $conversation = Conversation::where('task_id', $taskId)
            ->with(['task', 'messages.sourceActor', 'messages.targetActor'])
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        return response()->json([
            'id' => $conversation->id,
            'task_id' => $conversation->task_id,
            'task_title' => $conversation->task->title,
            'participants' => $conversation->participants,
            'message_count' => $conversation->message_count,
            'last_message_at' => $conversation->last_message_at?->toIso8601String(),
            'messages' => $conversation->messages->map(function ($msg) {
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
                    'created_at' => $msg->created_at->toIso8601String(),
                ];
            }),
            'created_at' => $conversation->created_at->toIso8601String(),
        ]);
    }
}

