<?php

namespace App\Http\Controllers\IdeaCircuit;

use App\Http\Controllers\Controller;
use App\Events\IdeaCircuit\MeetingEnded;
use App\Events\IdeaCircuit\ParticipantJoined;
use App\Models\IdeaCircuit\Meeting;
use App\Models\IdeaCircuit\MeetingParticipant;
use App\Models\Task;
use App\Models\Appointment;
use App\Services\IdeaCircuit\ChimeService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MeetingController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $meetings = Meeting::where('user_id', $request->user()->id)
            ->with(['participants', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $meetings]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'meeting_type' => 'nullable|string|in:general,presentation,sales_call,planning,workshop,webinar',
            'visibility' => 'nullable|string|in:private,public,unlisted',
            'allow_guests' => 'nullable|boolean',
            'max_participants' => 'nullable|integer|min:1|max:100',
            'scheduled_at' => 'nullable|date',
        ]);

        $meeting = Meeting::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'meeting_type' => $validated['meeting_type'] ?? 'general',
            'visibility' => $validated['visibility'] ?? 'private',
            'allow_guests' => $validated['allow_guests'] ?? true,
            'max_participants' => $validated['max_participants'] ?? 10,
            'scheduled_at' => isset($validated['scheduled_at']) ? $validated['scheduled_at'] : null,
            'status' => 'scheduled',
        ]);

        return response()->json(['data' => $meeting->load(['user', 'participants'])], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $meeting = Meeting::with(['user', 'participants', 'messages', 'notes', 'transcripts'])
            ->findOrFail($id);

        // Check authorization - user must be the host OR a participant
        $userId = Auth::id();
        $isHost = (string) $meeting->user_id === (string) $userId;
        $isParticipant = $meeting->participants()
            ->where('user_id', $userId)
            ->exists();
        
        if (!$isHost && !$isParticipant) {
            abort(403, 'Unauthorized');
        }

        return response()->json(['data' => $meeting]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization - only host can update
        if ((string) $meeting->user_id !== (string) Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'meeting_type' => 'sometimes|string|in:general,presentation,sales_call,planning,workshop,webinar',
            'status' => 'sometimes|string|in:scheduled,waiting,active,ended,cancelled',
            'visibility' => 'sometimes|string|in:private,public,unlisted',
            'allow_guests' => 'sometimes|boolean',
            'max_participants' => 'sometimes|integer|min:1|max:100',
            'scheduled_at' => 'nullable|date',
        ]);

        $meeting->update($validated);

        return response()->json(['data' => $meeting->load(['user', 'participants'])]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization - only host can delete
        if ((string) $meeting->user_id !== (string) Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $meeting->delete();

        return response()->json(['message' => 'Meeting deleted successfully'], 200);
    }

    /**
     * Join a meeting
     */
    public function join(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_guest' => 'nullable|boolean',
        ]);

        // Check if meeting allows guests
        if ($validated['is_guest'] ?? false && !$meeting->allow_guests) {
            abort(403, 'This meeting does not allow guest participants');
        }

        $participant = $meeting->participants()->create([
            'meeting_id' => $meeting->id,
            'user_id' => ($validated['is_guest'] ?? false) ? null : Auth::id(),
            'is_guest' => $validated['is_guest'] ?? false,
            'guest_name' => ($validated['is_guest'] ?? false) ? $validated['name'] : null,
            'display_name' => $validated['name'],
            'name' => $validated['name'],
            'role' => ($meeting->user_id === Auth::id()) ? 'host' : 'attendee',
            'is_active' => true,
            'connection_status' => 'connected',
            'joined_at' => now(),
        ]);

        // Update meeting status if needed
        if ($meeting->status === 'scheduled') {
            $meeting->update(['status' => 'waiting']);
        }

        // Broadcast participant joined event
        broadcast(new ParticipantJoined($participant->load(['user', 'meeting'])))->toOthers();

        return response()->json(['data' => $participant->load(['user', 'meeting'])], 201);
    }

    /**
     * End a meeting
     */
    public function end(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization
        if ($meeting->user_id !== Auth::id()) {
            abort(403, 'Only the meeting host can end the meeting');
        }

        $meeting->update([
            'status' => 'ended',
            'ended_at' => now(),
            'duration_seconds' => $meeting->started_at 
                ? now()->diffInSeconds($meeting->started_at) 
                : null,
        ]);

        // Deactivate all participants
        $meeting->participants()->update([
            'is_active' => false,
            'connection_status' => 'disconnected',
            'left_at' => now(),
        ]);

        // Broadcast meeting ended event
        broadcast(new MeetingEnded($meeting->load(['user'])))->toOthers();

        return response()->json(['data' => $meeting->load(['user', 'participants'])]);
    }

    /**
     * Create task from meeting (Task Juggler integration)
     */
    public function createTask(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization
        if ($meeting->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,normal,high,urgent',
            'due_date' => 'nullable|date',
        ]);

        // Create task in Task Juggler
        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'priority' => $validated['priority'] ?? 'normal',
            'due_date' => isset($validated['due_date']) ? $validated['due_date'] : null,
            'status' => 'pending',
            'requestor_id' => Auth::id(),
        ]);

        // Link task to meeting
        DB::table('ideacircuit_meeting_tasks')->insert([
            'id' => (string) Str::uuid(),
            'meeting_id' => $meeting->id,
            'task_id' => $task->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['data' => $task], 201);
    }

    /**
     * Get tasks for a meeting (Task Juggler integration)
     */
    public function getTasks(string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization
        if ($meeting->user_id !== Auth::id()) {
            $isParticipant = $meeting->participants()
                ->where('user_id', Auth::id())
                ->exists();
            
            if (!$isParticipant) {
                abort(403, 'Unauthorized');
            }
        }

        $taskIds = DB::table('ideacircuit_meeting_tasks')
            ->where('meeting_id', $meeting->id)
            ->pluck('task_id');

        $tasks = Task::whereIn('id', $taskIds)->get();

        return response()->json(['data' => $tasks]);
    }

    /**
     * Create appointment from meeting (Task Juggler integration)
     */
    public function createAppointment(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization
        if ($meeting->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'appointment_type_id' => 'required|uuid|exists:appointment_types,id',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'nullable|string|max:50',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'timezone' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        // Create appointment in Task Juggler
        $appointment = Appointment::create([
            'appointment_type_id' => $validated['appointment_type_id'],
            'host_id' => Auth::id(),
            'guest_name' => $validated['guest_name'],
            'guest_email' => $validated['guest_email'],
            'guest_phone' => $validated['guest_phone'] ?? null,
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'timezone' => $validated['timezone'] ?? 'UTC',
            'status' => 'scheduled',
            'notes' => $validated['notes'] ?? null,
        ]);

        // Link appointment to meeting
        DB::table('ideacircuit_meeting_appointments')->insert([
            'id' => (string) Str::uuid(),
            'meeting_id' => $meeting->id,
            'appointment_id' => $appointment->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['data' => $appointment], 201);
    }

    /**
     * Get appointments for a meeting (Task Juggler integration)
     */
    public function getAppointments(string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization
        if ($meeting->user_id !== Auth::id()) {
            $isParticipant = $meeting->participants()
                ->where('user_id', Auth::id())
                ->exists();
            
            if (!$isParticipant) {
                abort(403, 'Unauthorized');
            }
        }

        $appointmentIds = DB::table('ideacircuit_meeting_appointments')
            ->where('meeting_id', $meeting->id)
            ->pluck('appointment_id');

        $appointments = Appointment::whereIn('id', $appointmentIds)->get();

        return response()->json(['data' => $appointments]);
    }

    /**
     * Create Chime SDK meeting
     */
    public function createChimeMeeting(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization - only host can create Chime meeting
        if ((string) $meeting->user_id !== (string) Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // If Chime meeting already exists, return existing data
        if ($meeting->chime_meeting_id) {
            return response()->json([
                'data' => [
                    'meeting_id' => $meeting->chime_meeting_id,
                    'external_meeting_id' => $meeting->chime_external_id,
                    'media_region' => $meeting->chime_region,
                    'media_placement' => $meeting->chime_media_placement,
                ],
                'message' => 'Chime meeting already exists',
            ]);
        }

        try {
            $chimeService = app(ChimeService::class);
            $chimeData = $chimeService->createMeeting($meeting->id, $meeting->title);

            // Update meeting with Chime data
            $meeting->update([
                'chime_meeting_id' => $chimeData['meeting_id'],
                'chime_region' => $chimeData['media_region'],
                'chime_external_id' => $chimeData['external_meeting_id'],
                'chime_media_placement' => $chimeData['media_placement'],
            ]);

            return response()->json(['data' => $chimeData], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create Chime meeting',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create Chime SDK attendee
     */
    public function createChimeAttendee(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check if Chime meeting exists
        if (!$meeting->chime_meeting_id) {
            return response()->json([
                'error' => 'Chime meeting not created',
                'message' => 'Please create Chime meeting first',
            ], 400);
        }

        // Find or create participant
        $participant = $meeting->participants()
            ->where('user_id', Auth::id())
            ->first();

        if (!$participant) {
            // Create participant if doesn't exist
            $participant = $meeting->participants()->create([
                'meeting_id' => $meeting->id,
                'user_id' => Auth::id(),
                'display_name' => Auth::user()->name ?? 'Participant',
                'name' => Auth::user()->name ?? 'Participant',
                'role' => ($meeting->user_id === Auth::id()) ? 'host' : 'attendee',
                'is_active' => true,
                'connection_status' => 'connected',
                'joined_at' => now(),
            ]);
        }

        // If Chime attendee already exists, return existing data
        if ($participant->chime_attendee_id) {
            return response()->json([
                'data' => [
                    'attendee_id' => $participant->chime_attendee_id,
                    'external_user_id' => $participant->chime_external_user_id,
                    'join_token' => $participant->chime_join_token,
                ],
                'message' => 'Chime attendee already exists',
            ]);
        }

        try {
            $chimeService = app(ChimeService::class);
            $attendeeData = $chimeService->createAttendee(
                $meeting->chime_meeting_id,
                $participant->id
            );

            // Update participant with Chime data
            $participant->update([
                'chime_attendee_id' => $attendeeData['attendee_id'],
                'chime_external_user_id' => $attendeeData['external_user_id'],
                'chime_join_token' => $attendeeData['join_token'],
            ]);

            return response()->json(['data' => $attendeeData], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create Chime attendee',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get Chime credentials for joining a meeting
     */
    public function getChimeCredentials(string $id)
    {
        $meeting = Meeting::findOrFail($id);

        // Check authorization
        $userId = Auth::id();
        $isHost = (string) $meeting->user_id === (string) $userId;
        $isParticipant = $meeting->participants()
            ->where('user_id', $userId)
            ->exists();

        if (!$isHost && !$isParticipant) {
            abort(403, 'Unauthorized');
        }

        // Check if Chime meeting exists
        if (!$meeting->chime_meeting_id) {
            return response()->json([
                'error' => 'Chime meeting not created',
                'message' => 'Please create Chime meeting first',
            ], 400);
        }

        // Get participant
        $participant = $meeting->participants()
            ->where('user_id', $userId)
            ->first();

        if (!$participant || !$participant->chime_attendee_id) {
            return response()->json([
                'error' => 'Chime attendee not created',
                'message' => 'Please create Chime attendee first',
            ], 400);
        }

        return response()->json([
            'data' => [
                'meeting' => [
                    'MeetingId' => $meeting->chime_meeting_id,
                    'MediaRegion' => $meeting->chime_region,
                    'MediaPlacement' => $meeting->chime_media_placement,
                ],
                'attendee' => [
                    'AttendeeId' => $participant->chime_attendee_id,
                    'ExternalUserId' => $participant->chime_external_user_id,
                    'JoinToken' => $participant->chime_join_token,
                ],
            ],
        ]);
    }
}
