<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectMessage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DirectMessageController extends Controller
{
    public function conversations(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Get all messages involving this user
        $allMessages = DirectMessage::where('sender_id', $userId)
            ->orWhere('recipient_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Group by other user and get latest message
        $conversationsMap = [];
        foreach ($allMessages as $message) {
            $otherUserId = $message->sender_id === $userId ? $message->recipient_id : $message->sender_id;
            
            if (!isset($conversationsMap[$otherUserId])) {
                $conversationsMap[$otherUserId] = [
                    'other_user_id' => $otherUserId,
                    'last_message_id' => $message->id,
                    'last_message_at' => $message->created_at,
                ];
            }
        }

        $conversations = collect($conversationsMap)->values();

        // Hydrate with user data
        $otherUserIds = $conversations->pluck('other_user_id')->unique();
        $users = User::whereIn('id', $otherUserIds)
            ->where('organization_id', $request->user()->organization_id)
            ->select('id', 'name', 'email', 'avatar')
            ->get()
            ->keyBy('id');

        $result = $conversations->map(function ($conv) use ($users, $userId) {
            $otherUserId = $conv['other_user_id'];
            $lastMessageId = $conv['last_message_id'];
            
            $lastMessage = DirectMessage::find($lastMessageId);
            $unreadCount = DirectMessage::where('sender_id', $otherUserId)
                ->where('recipient_id', $userId)
                ->whereNull('read_at')
                ->count();

            return [
                'user' => $users[$otherUserId] ?? null,
                'last_message' => [
                    'content' => $lastMessage?->content,
                    'sent_at' => $lastMessage?->created_at,
                    'is_mine' => $lastMessage?->sender_id === $userId,
                ],
                'unread_count' => $unreadCount,
            ];
        })->filter(fn($c) => $c !== null && $c['user'] !== null)->values();

        return response()->json(['conversations' => $result]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = DirectMessage::where('recipient_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }

    public function messages(Request $request, User $user): JsonResponse
    {
        // Check same organization
        if ($user->organization_id !== $request->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $messages = DirectMessage::where(function ($q) use ($request, $user) {
            $q->where('sender_id', $request->user()->id)
              ->where('recipient_id', $user->id);
        })->orWhere(function ($q) use ($request, $user) {
            $q->where('sender_id', $user->id)
              ->where('recipient_id', $request->user()->id);
        })
        ->orderBy('created_at', 'asc')
        ->get();

        // Mark as read
        DirectMessage::where('sender_id', $user->id)
            ->where('recipient_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['messages' => $messages]);
    }

    public function send(Request $request, User $user): JsonResponse
    {
        // Check same organization
        if ($user->organization_id !== $request->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $message = DirectMessage::create([
            'sender_id' => $request->user()->id,
            'recipient_id' => $user->id,
            'content' => $validated['content'],
        ]);

        return response()->json($message, 201);
    }
}
