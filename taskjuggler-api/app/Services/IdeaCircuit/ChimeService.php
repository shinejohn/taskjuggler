<?php

namespace App\Services\IdeaCircuit;

use Aws\ChimeSDKMeetings\ChimeSDKMeetingsClient;
use Illuminate\Support\Facades\Log;

class ChimeService
{
    protected ChimeSDKMeetingsClient $chimeClient;
    protected string $region;

    public function __construct()
    {
        $this->region = config('services.ses.region', 'us-east-1');
        
        $this->chimeClient = new ChimeSDKMeetingsClient([
            'version' => 'latest',
            'region' => $this->region,
            'credentials' => [
                'key' => config('services.ses.key'),
                'secret' => config('services.ses.secret'),
            ],
        ]);
    }

    /**
     * Create a Chime SDK meeting
     *
     * @param string $externalMeetingId External meeting ID (usually the database meeting ID)
     * @param string $title Meeting title
     * @return array Chime meeting data
     * @throws \Exception
     */
    public function createMeeting(string $externalMeetingId, string $title): array
    {
        try {
            $result = $this->chimeClient->createMeeting([
                'ClientRequestToken' => uniqid('meeting-', true),
                'ExternalMeetingId' => $externalMeetingId,
                'MediaRegion' => $this->region,
                'Tags' => [
                    ['Key' => 'Title', 'Value' => $title],
                    ['Key' => 'Platform', 'Value' => 'IdeaCircuit'],
                    ['Key' => 'CreatedAt', 'Value' => now()->toIso8601String()],
                ],
            ]);

            $meeting = $result['Meeting'];

            Log::info('Chime meeting created', [
                'meeting_id' => $meeting['MeetingId'],
                'external_meeting_id' => $externalMeetingId,
            ]);

            return [
                'meeting_id' => $meeting['MeetingId'],
                'external_meeting_id' => $meeting['ExternalMeetingId'],
                'media_region' => $meeting['MediaRegion'],
                'media_placement' => $meeting['MediaPlacement'],
                'meeting_arn' => $meeting['MeetingArn'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('Chime meeting creation failed', [
                'error' => $e->getMessage(),
                'external_meeting_id' => $externalMeetingId,
            ]);
            throw $e;
        }
    }

    /**
     * Create a Chime SDK attendee
     *
     * @param string $meetingId Chime meeting ID
     * @param string $externalUserId External user ID (usually the participant ID)
     * @return array Chime attendee data
     * @throws \Exception
     */
    public function createAttendee(string $meetingId, string $externalUserId): array
    {
        try {
            $result = $this->chimeClient->createAttendee([
                'MeetingId' => $meetingId,
                'ExternalUserId' => $externalUserId,
            ]);

            $attendee = $result['Attendee'];

            Log::info('Chime attendee created', [
                'attendee_id' => $attendee['AttendeeId'],
                'meeting_id' => $meetingId,
                'external_user_id' => $externalUserId,
            ]);

            return [
                'attendee_id' => $attendee['AttendeeId'],
                'external_user_id' => $attendee['ExternalUserId'],
                'join_token' => $attendee['JoinToken'],
            ];
        } catch (\Exception $e) {
            Log::error('Chime attendee creation failed', [
                'error' => $e->getMessage(),
                'meeting_id' => $meetingId,
                'external_user_id' => $externalUserId,
            ]);
            throw $e;
        }
    }

    /**
     * Get Chime credentials for joining a meeting
     *
     * @param string $meetingId Database meeting ID
     * @param string $participantId Participant ID
     * @return array Chime credentials
     */
    public function getCredentials(string $meetingId, string $participantId): array
    {
        // This method would typically fetch from database
        // For now, it's a placeholder - actual implementation would fetch
        // chime_meeting_id and chime_attendee_id from the database
        return [
            'meeting_id' => $meetingId,
            'participant_id' => $participantId,
        ];
    }
}





