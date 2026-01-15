<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\IdeaCircuit\Meeting;

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (string) $user->id === (string) $userId;
});

// IdeaCircuit meeting channels
Broadcast::channel('meetings.{meetingId}', function ($user, $meetingId) {
    // #region agent log
    file_put_contents('/Users/johnshine/Dropbox/Fibonacco/Alpha-Site/IdeaCircuit/.cursor/debug.log', json_encode([
        'id' => 'log_' . time() . '_' . uniqid(),
        'timestamp' => time() * 1000,
        'location' => 'channels.php:15',
        'message' => 'Channel authorization check',
        'data' => ['user_id' => $user->id, 'meeting_id' => $meetingId],
        'sessionId' => 'debug-session',
        'runId' => 'run1',
        'hypothesisId' => 'A'
    ]) . "\n", FILE_APPEND);
    // #endregion agent log
    
    $meeting = Meeting::find($meetingId);
    
    if (!$meeting) {
        // #region agent log
        file_put_contents('/Users/johnshine/Dropbox/Fibonacco/Alpha-Site/IdeaCircuit/.cursor/debug.log', json_encode([
            'id' => 'log_' . time() . '_' . uniqid(),
            'timestamp' => time() * 1000,
            'location' => 'channels.php:25',
            'message' => 'Meeting not found',
            'data' => ['meeting_id' => $meetingId],
            'sessionId' => 'debug-session',
            'runId' => 'run1',
            'hypothesisId' => 'A'
        ]) . "\n", FILE_APPEND);
        // #endregion agent log
        return false;
    }
    
    // Check if user is host or participant
    $isHost = (string) $meeting->user_id === (string) $user->id;
    $isParticipant = $meeting->participants()
        ->where('user_id', $user->id)
        ->exists();
    
    // #region agent log
    file_put_contents('/Users/johnshine/Dropbox/Fibonacco/Alpha-Site/IdeaCircuit/.cursor/debug.log', json_encode([
        'id' => 'log_' . time() . '_' . uniqid(),
        'timestamp' => time() * 1000,
        'location' => 'channels.php:40',
        'message' => 'Authorization result',
        'data' => ['is_host' => $isHost, 'is_participant' => $isParticipant, 'authorized' => $isHost || $isParticipant],
        'sessionId' => 'debug-session',
        'runId' => 'run1',
        'hypothesisId' => 'A'
    ]) . "\n", FILE_APPEND);
    // #endregion agent log
    
    return $isHost || $isParticipant;
});
