<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectMessage;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class DirectMessageController extends Controller
{
    public function __construct(
        private NotificationService $notifications
    ) {}

    /**
     * List conversations (grouped by other user)
     */
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        // Get unique conversation partners with last message (SQLite compatible)
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
            ->select('id', 'name', 'email', 'avatar_url')
            ->get()
            ->keyBy('id');

        $result = $conversations->map(function ($conv) use ($users, $userId) {
            $otherUserId = $conv['other_user_id'] ?? $conv->other_user_id ?? null;
            $lastMessageId = $conv['last_message_id'] ?? $conv->last_message_id ?? null;
            
            if (!$otherUserId || !$lastMessageId) {
                return null;
            }
            
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

    /**
     * Get messages with a specific user
     */
    public function messages(Request $request, string $user)
    {
        $currentUser = $request->user();
        $otherUser = User::findOrFail($user);

        $messages = DirectMessage::where(function ($q) use ($currentUser, $otherUser) {
                $q->where('sender_id', $currentUser->id)
                    ->where('recipient_id', $otherUser->id);
            })
            ->orWhere(function ($q) use ($currentUser, $otherUser) {
                $q->where('sender_id', $otherUser->id)
                    ->where('recipient_id', $currentUser->id);
            })
            ->with('sender:id,name,avatar_url')
            ->orderBy('created_at', 'desc')
            ->limit($request->input('limit', 50))
            ->get()
            ->reverse()
            ->values();

        // Mark received messages as read
        DirectMessage::where('sender_id', $otherUser->id)
            ->where('recipient_id', $currentUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'messages' => $messages,
            'with_user' => $otherUser->only(['id', 'name', 'avatar_url']),
        ]);
    }

    /**
     * Send a direct message
     */
    public function send(Request $request, string $user)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $recipient = User::findOrFail($user);

        $message = DirectMessage::create([
            'sender_id' => $request->user()->id,
            'recipient_id' => $recipient->id,
            'content' => $validated['content'],
        ]);

        // Notify recipient
        $this->notifications->notifyDirectMessage($message);

        return response()->json([
            'message' => $message->load('sender:id,name,avatar_url'),
        ], 201);
    }

    /**
     * Get total unread count
     */
    public function unreadCount(Request $request)
    {
        $count = DirectMessage::where('recipient_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['unread_count' => $count]);
    }
}
