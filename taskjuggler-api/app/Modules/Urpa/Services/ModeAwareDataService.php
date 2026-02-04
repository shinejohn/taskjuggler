<?php

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaModeSettings;

/**
 * Mode-aware data service for URPA dashboard widgets
 * Filters and classifies data based on current user mode
 */
class ModeAwareDataService
{
    protected ?string $currentMode = null;
    protected int $userId;
    
    public function __construct(int $userId)
    {
        $this->userId = $userId;
        $settings = UrpaModeSettings::getOrCreateForUser($userId);
        $this->currentMode = $settings->current_mode;
    }
    
    /**
     * Get mode-filtered emails
     */
    public function getEmails(int $limit = 10): array
    {
        return \App\Modules\Urpa\Models\UrpaActivity::where('user_id', $this->userId)
            ->byType('email')
            ->byMode($this->currentMode === 'all' ? '*' : $this->currentMode)
            ->latest('activity_timestamp')
            ->take($limit)
            ->get()
            ->map(fn($activity) => [
                'id' => $activity->id,
                'from' => $activity->raw_content['from'] ?? 'Unknown',
                'subject' => $activity->title,
                'preview' => $activity->description,
                'mode' => $activity->mode,
                'time' => $activity->activity_timestamp->diffForHumans(),
                'unread' => !$activity->is_read,
            ])
            ->toArray();
    }
    
    /**
     * Get mode-filtered calendar events
     */
    public function getCalendarEvents(int $limit = 5): array
    {
        return \App\Modules\Urpa\Models\UrpaActivity::where('user_id', $this->userId)
            ->byType('event')
            ->byMode($this->currentMode === 'all' ? '*' : $this->currentMode)
            ->where('activity_timestamp', '>=', now())
            ->orderBy('activity_timestamp', 'asc')
            ->take($limit)
            ->get()
            ->map(fn($activity) => [
                'id' => $activity->id,
                'title' => $activity->title,
                'time' => $activity->activity_timestamp->format('h:i A'),
                'duration' => $activity->raw_content['duration'] ?? '1h',
                'mode' => $activity->mode,
                'type' => $activity->raw_content['type'] ?? 'event',
            ])
            ->toArray();
    }
    
    /**
     * Get mode-filtered tasks
     */
    public function getTasks(int $limit = 10): array
    {
        $query = \App\Modules\Urpa\Models\UrpaActivity::where('user_id', $this->userId)
            ->byType('task');
            
        if ($this->currentMode !== 'all') {
            $query->byMode($this->currentMode);
        }
            
        return $query->latest('activity_timestamp')
            ->take($limit)
            ->get()
            ->map(fn($activity) => [
                'id' => $activity->id,
                'title' => $activity->title,
                'due' => $activity->raw_content['due'] ?? 'No date',
                'priority' => $activity->raw_content['priority'] ?? 'medium',
                'mode' => $activity->mode,
                'completed' => $activity->status === 'completed',
            ])
            ->toArray();
    }
    
    /**
     * Get mode-filtered voicemails
     */
    public function getVoicemails(int $limit = 5): array
    {
        return \App\Modules\Urpa\Models\UrpaActivity::where('user_id', $this->userId)
            ->byType('voicemail')
            ->byMode($this->currentMode === 'all' ? '*' : $this->currentMode)
            ->latest('activity_timestamp')
            ->take($limit)
            ->get()
            ->map(fn($activity) => [
                'id' => $activity->id,
                'caller' => $activity->raw_content['caller_name'] ?? $activity->title,
                'transcription' => $activity->description,
                'duration' => $activity->raw_content['duration'] ?? '0:00',
                'mode' => $activity->mode,
                'time' => $activity->activity_timestamp->diffForHumans(),
                'line' => $activity->raw_content['line'] ?? 'Unknown',
            ])
            ->toArray();
    }
    
    /**
     * Get mode-filtered messages
     */
    public function getMessages(int $limit = 10): array
    {
        return \App\Modules\Urpa\Models\UrpaActivity::where('user_id', $this->userId)
            ->byType('message')
            ->byMode($this->currentMode === 'all' ? '*' : $this->currentMode)
            ->latest('activity_timestamp')
            ->take($limit)
            ->get()
            ->map(fn($activity) => [
                'id' => $activity->id,
                'from' => $activity->raw_content['from'] ?? 'Unknown',
                'message' => $activity->description,
                'mode' => $activity->mode,
                'time' => $activity->activity_timestamp->diffForHumans(),
                'channel' => $activity->raw_content['channel'] ?? 'general',
            ])
            ->toArray();
    }
    
    /**
     * Filter data array by current mode (Helper for array-based data if needed)
     */
    protected function filterByMode(array $data, int $limit): array
    {
        // ... kept for fallback or memory filtering if needed
        return $data; 
    }
    
    /**
     * Get dashboard stats for current mode
     */
    public function getDashboardStats(): array
    {
        // TODO: Implement real stats aggregation from UrpaActivity
        // For now, returning mode-specific placeholders that differ by mode
        $stats = [
            'practice' => [
                'patients_today' => \App\Modules\Urpa\Models\UrpaActivity::where('user_id', $this->userId)->byMode('practice')->byType('event')->count(),
                'charts_pending' => 3, // Placeholder
                'prior_auths' => 2,
                'prescriptions' => 5,
                'labs_to_review' => 4,
            ],
            'business' => [
                'revenue_today' => 4250,
                'claims_pending' => 12,
                'staff_on_shift' => 8,
                'vendor_orders' => 3,
                'pto_requests' => 2,
            ],
            'personal' => [
                'goals_active' => 6,
                'trips_planned' => 3,
                'messages_unread' => \App\Modules\Urpa\Models\UrpaActivity::where('user_id', $this->userId)->byMode('personal')->byType('message')->unread()->count(),
                'files_uploaded' => 124,
                'events_today' => 2,
            ],
        ];
        
        if ($this->currentMode === 'all') {
            return $stats;
        }
        
        return $stats[$this->currentMode] ?? [];
    }
}
