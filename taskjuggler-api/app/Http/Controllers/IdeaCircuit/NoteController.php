<?php

namespace App\Http\Controllers\IdeaCircuit;

use App\Http\Controllers\Controller;
use App\Events\IdeaCircuit\NoteCreated;
use App\Models\IdeaCircuit\Meeting;
use App\Models\IdeaCircuit\MeetingNote;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of notes for a meeting.
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

        $notes = MeetingNote::where('meeting_id', $meetingId)
            ->with(['user', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $notes]);
    }

    /**
     * Store a newly created note.
     */
    public function store(Request $request, string $meetingId)
    {
        $meeting = Meeting::findOrFail($meetingId);

        // Check authorization
        $participant = $meeting->participants()
            ->where('user_id', Auth::id())
            ->first();

        if (!$participant || !$participant->can_edit_notes) {
            abort(403, 'Unauthorized to create notes');
        }

        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'content' => 'required|string',
            'note_type' => 'nullable|string|in:manual,ai_generated,auto_extracted,voice_note',
            'tags' => 'nullable|array',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'status' => 'nullable|string|in:open,in_progress,completed,cancelled',
            'assigned_to' => 'nullable|uuid|exists:users,id',
            'due_date' => 'nullable|date',
            'is_shared' => 'nullable|boolean',
        ]);

        $note = MeetingNote::create([
            'meeting_id' => $meetingId,
            'user_id' => Auth::id(),
            'category' => $validated['category'],
            'content' => $validated['content'],
            'note_type' => $validated['note_type'] ?? 'manual',
            'tags' => $validated['tags'] ?? [],
            'priority' => $validated['priority'] ?? null,
            'status' => $validated['status'] ?? 'open',
            'assigned_to' => $validated['assigned_to'] ?? null,
            'due_date' => isset($validated['due_date']) ? $validated['due_date'] : null,
            'is_shared' => $validated['is_shared'] ?? true,
        ]);

        // Broadcast note created event
        broadcast(new NoteCreated($note->load(['user', 'assignedTo'])))->toOthers();

        return response()->json(['data' => $note->load(['user', 'assignedTo'])], 201);
    }
}
