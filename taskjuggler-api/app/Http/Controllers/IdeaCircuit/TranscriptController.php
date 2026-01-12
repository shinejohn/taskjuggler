<?php

namespace App\Http\Controllers\IdeaCircuit;

use App\Http\Controllers\Controller;
use App\Models\IdeaCircuit\Meeting;
use App\Models\IdeaCircuit\MeetingTranscript;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TranscriptController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the transcript for a meeting.
     */
    public function show(string $meetingId)
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

        $transcripts = MeetingTranscript::where('meeting_id', $meetingId)
            ->where('is_final', true)
            ->with(['speaker', 'participant'])
            ->orderBy('start_time_ms', 'asc')
            ->get();

        return response()->json(['data' => $transcripts]);
    }
}
