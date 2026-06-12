<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = min((int) $request->get('limit', 20), 100);

        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        $unreadCount = Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'data' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'message' => 'nullable|string',
            'body' => 'nullable|string',
            'data' => 'nullable|array',
            'channels' => 'nullable|array',
        ]);

        $notification = Notification::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'body' => $validated['body'] ?? $validated['message'] ?? null,
            'data' => $validated['data'] ?? null,
            'channels' => $validated['channels'] ?? ['in_app'],
            'created_at' => now(),
        ]);

        return response()->json(['data' => $notification], 201);
    }

    public function markRead(Request $request, string $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json(['data' => $notification->fresh()]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }
}
