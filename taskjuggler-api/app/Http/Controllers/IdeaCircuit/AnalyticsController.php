<?php

namespace App\Http\Controllers\IdeaCircuit;

use App\Http\Controllers\Controller;
use App\Models\IdeaCircuit\Meeting;
use App\Models\IdeaCircuit\MeetingMessage;
use App\Models\IdeaCircuit\MeetingNote;
use App\Models\IdeaCircuit\MeetingParticipant;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get meeting analytics
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        $filters = $request->only(['start_date', 'end_date', 'meeting_type', 'status']);

        // Base query for user's meetings
        $meetingsQuery = Meeting::where('user_id', $userId);

        // Apply filters
        if (isset($filters['start_date'])) {
            $meetingsQuery->where('created_at', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date'])) {
            $meetingsQuery->where('created_at', '<=', $filters['end_date']);
        }
        if (isset($filters['meeting_type'])) {
            $meetingsQuery->where('meeting_type', $filters['meeting_type']);
        }
        if (isset($filters['status'])) {
            $meetingsQuery->where('status', $filters['status']);
        }

        $meetings = $meetingsQuery->get();

        // Overall statistics
        $totalMeetings = $meetings->count();
        $activeMeetings = $meetings->where('status', 'active')->count();
        $completedMeetings = $meetings->where('status', 'completed')->count();
        $scheduledMeetings = $meetings->where('status', 'scheduled')->count();

        // Duration statistics
        $completedMeetingsWithDuration = $meetings->where('status', 'completed')
            ->filter(fn($m) => $m->duration_seconds > 0);
        
        $totalDurationSeconds = $completedMeetingsWithDuration->sum('duration_seconds');
        $averageDurationSeconds = $completedMeetingsWithDuration->isNotEmpty() 
            ? $totalDurationSeconds / $completedMeetingsWithDuration->count() 
            : 0;
        $longestMeetingSeconds = $completedMeetingsWithDuration->max('duration_seconds') ?? 0;
        $shortestMeetingSeconds = $completedMeetingsWithDuration->min('duration_seconds') ?? 0;

        // Participant engagement metrics
        $meetingIds = $meetings->pluck('id');
        $totalParticipants = MeetingParticipant::whereIn('meeting_id', $meetingIds)->count();
        $averageParticipantsPerMeeting = $totalMeetings > 0 ? $totalParticipants / $totalMeetings : 0;

        // Message statistics
        $totalMessages = MeetingMessage::whereIn('meeting_id', $meetingIds)
            ->where('is_deleted', false)
            ->count();
        $averageMessagesPerMeeting = $totalMeetings > 0 ? $totalMessages / $totalMeetings : 0;
        $aiGeneratedMessages = MeetingMessage::whereIn('meeting_id', $meetingIds)
            ->where('is_ai_generated', true)
            ->where('is_deleted', false)
            ->count();

        // Note statistics
        $totalNotes = MeetingNote::whereIn('meeting_id', $meetingIds)->count();
        $averageNotesPerMeeting = $totalMeetings > 0 ? $totalNotes / $totalMeetings : 0;
        $notesByCategory = MeetingNote::whereIn('meeting_id', $meetingIds)
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get()
            ->pluck('count', 'category')
            ->toArray();

        // Meeting type distribution
        $meetingsByType = $meetings->groupBy('meeting_type')
            ->map(fn($group) => $group->count())
            ->toArray();

        // Status distribution
        $meetingsByStatus = $meetings->groupBy('status')
            ->map(fn($group) => $group->count())
            ->toArray();

        // Time-based analytics (last 30 days)
        $thirtyDaysAgo = now()->subDays(30);
        $recentMeetings = $meetings->filter(fn($m) => $m->created_at >= $thirtyDaysAgo);
        
        $meetingsByDay = $recentMeetings->groupBy(function($meeting) {
            return $meeting->created_at->format('Y-m-d');
        })->map(fn($group) => $group->count())->toArray();

        // Engagement score calculation (simplified)
        // Based on: messages per participant, notes per meeting, duration
        $engagementScores = [];
        foreach ($meetings as $meeting) {
            $participantCount = $meeting->participants->count();
            $messageCount = $meeting->messages->where('is_deleted', false)->count();
            $noteCount = $meeting->notes->count();
            $duration = $meeting->duration_seconds ?? 0;

            $score = 0;
            if ($participantCount > 0) {
                $score += ($messageCount / max($participantCount, 1)) * 10; // Messages per participant
            }
            $score += min($noteCount * 5, 30); // Notes contribution
            $score += min($duration / 60, 50); // Duration contribution (max 50 for 50+ min meetings)
            
            $engagementScores[$meeting->id] = min($score, 100); // Cap at 100
        }

        $averageEngagementScore = count($engagementScores) > 0 
            ? array_sum($engagementScores) / count($engagementScores) 
            : 0;

        return response()->json([
            'data' => [
                'overview' => [
                    'total_meetings' => $totalMeetings,
                    'active_meetings' => $activeMeetings,
                    'completed_meetings' => $completedMeetings,
                    'scheduled_meetings' => $scheduledMeetings,
                ],
                'duration' => [
                    'total_seconds' => $totalDurationSeconds,
                    'total_minutes' => round($totalDurationSeconds / 60, 2),
                    'total_hours' => round($totalDurationSeconds / 3600, 2),
                    'average_seconds' => round($averageDurationSeconds, 2),
                    'average_minutes' => round($averageDurationSeconds / 60, 2),
                    'longest_seconds' => $longestMeetingSeconds,
                    'longest_minutes' => round($longestMeetingSeconds / 60, 2),
                    'shortest_seconds' => $shortestMeetingSeconds,
                    'shortest_minutes' => round($shortestMeetingSeconds / 60, 2),
                ],
                'participants' => [
                    'total' => $totalParticipants,
                    'average_per_meeting' => round($averageParticipantsPerMeeting, 2),
                ],
                'messages' => [
                    'total' => $totalMessages,
                    'average_per_meeting' => round($averageMessagesPerMeeting, 2),
                    'ai_generated' => $aiGeneratedMessages,
                    'ai_percentage' => $totalMessages > 0 
                        ? round(($aiGeneratedMessages / $totalMessages) * 100, 2) 
                        : 0,
                ],
                'notes' => [
                    'total' => $totalNotes,
                    'average_per_meeting' => round($averageNotesPerMeeting, 2),
                    'by_category' => $notesByCategory,
                ],
                'distribution' => [
                    'by_type' => $meetingsByType,
                    'by_status' => $meetingsByStatus,
                ],
                'time_based' => [
                    'meetings_by_day' => $meetingsByDay,
                ],
                'engagement' => [
                    'average_score' => round($averageEngagementScore, 2),
                    'scores_by_meeting' => $engagementScores,
                ],
            ]
        ]);
    }
}

