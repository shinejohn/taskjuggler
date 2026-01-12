<?php

namespace App\Http\Controllers\IdeaCircuit;

use App\Http\Controllers\Controller;
use App\Events\IdeaCircuit\MessageReceived;
use App\Models\IdeaCircuit\Meeting;
use App\Models\IdeaCircuit\MeetingMessage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of messages for a meeting.
     */
    public function index(string $meetingId)
    {
        $meeting = Meeting::findOrFail($meetingId);

        // Check authorization
        if ($meeting->user_id !== Auth::id()) {
            $isParticipant = $meeting->participants()
                ->where('user_id', Auth::id())
                ->exists();
            
            if (!$isParticipant) {
                abort(403, 'Unauthorized');
            }
        }

        $messages = MeetingMessage::where('meeting_id', $meetingId)
            ->where('is_deleted', false)
            ->with(['user', 'participant'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $messages]);
    }

    /**
     * Store a newly created message.
     */
    public function store(Request $request, string $meetingId)
    {
        $meeting = Meeting::findOrFail($meetingId);

        // Check authorization
        $participant = $meeting->participants()
            ->where('user_id', Auth::id())
            ->first();

        if (!$participant || !$participant->can_chat) {
            abort(403, 'Unauthorized to send messages');
        }

        $validated = $request->validate([
            'text' => 'required|string',
            'participant_id' => 'nullable|uuid|exists:ideacircuit_meeting_participants,id',
            'message_type' => 'nullable|string|in:text,system,ai_response,file,action,poll,reaction',
            'reply_to_message_id' => 'nullable|uuid|exists:ideacircuit_meeting_messages,id',
        ]);

        $message = MeetingMessage::create([
            'meeting_id' => $meetingId,
            'participant_id' => $validated['participant_id'] ?? $participant->id,
            'user_id' => Auth::id(),
            'message_text' => $validated['text'],
            'message_type' => $validated['message_type'] ?? 'text',
            'reply_to_message_id' => $validated['reply_to_message_id'] ?? null,
        ]);

        // Broadcast message received event
        broadcast(new MessageReceived($message->load(['user', 'participant'])))->toOthers();

        return response()->json(['data' => $message->load(['user', 'participant'])], 201);
    }
}
