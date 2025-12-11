<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectMessage;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        // Get unique conversation partners with last message
        $conversations = DB::select("
            SELECT DISTINCT ON (other_user_id)
                other_user_id,
                last_message_id,
                last_message_at,
                unread_count
            FROM (
                SELECT 
                    CASE 
                        WHEN sender_id = ? THEN recipient_id 
                        ELSE sender_id 
                    END as other_user_id,
                    id as last_message_id,
                    created_at as last_message_at,
                    CASE 
                        WHEN recipient_id = ? AND read_at IS NULL THEN 1 
                        ELSE 0 
                    END as is_unread
                FROM direct_messages
                WHERE sender_id = ? OR recipient_id = ?
                ORDER BY created_at DESC
            ) sub
            GROUP BY other_user_id
            ORDER BY other_user_id, last_message_at DESC
        ", [$userId, $userId, $userId, $userId]);

        // Hydrate with user data
        $otherUserIds = collect($conversations)->pluck('other_user_id');
        $users = User::whereIn('id', $otherUserIds)
            ->select('id', 'name', 'email', 'avatar_url')
            ->get()
            ->keyBy('id');

        $result = collect($conversations)->map(function ($conv) use ($users, $userId) {
            $lastMessage = DirectMessage::find($conv->last_message_id);
            $unreadCount = DirectMessage::where('sender_id', $conv->other_user_id)
                ->where('recipient_id', $userId)
                ->whereNull('read_at')
                ->count();

            return [
                'user' => $users[$conv->other_user_id] ?? null,
                'last_message' => [
                    'content' => $lastMessage?->content,
                    'sent_at' => $lastMessage?->created_at,
                    'is_mine' => $lastMessage?->sender_id === $userId,
                ],
                'unread_count' => $unreadCount,
            ];
        })->filter(fn($c) => $c['user'] !== null)->values();

        return response()->json(['conversations' => $result]);
    }

    /**
     * Get messages with a specific user
     */
    public function messages(Request $request, User $user)
    {
        $currentUser = $request->user();

        $messages = DirectMessage::where(function ($q) use ($currentUser, $user) {
                $q->where('sender_id', $currentUser->id)
                    ->where('recipient_id', $user->id);
            })
            ->orWhere(function ($q) use ($currentUser, $user) {
                $q->where('sender_id', $user->id)
                    ->where('recipient_id', $currentUser->id);
            })
            ->with('sender:id,name,avatar_url')
            ->orderBy('created_at', 'desc')
            ->limit($request->input('limit', 50))
            ->get()
            ->reverse()
            ->values();

        // Mark received messages as read
        DirectMessage::where('sender_id', $user->id)
            ->where('recipient_id', $currentUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'messages' => $messages,
            'with_user' => $user->only(['id', 'name', 'avatar_url']),
        ]);
    }

    /**
     * Send a direct message
     */
    public function send(Request $request, User $recipient)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

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
