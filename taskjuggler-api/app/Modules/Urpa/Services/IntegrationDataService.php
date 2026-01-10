<?php

namespace App\Modules\Urpa\Services;

use App\Models\User;
use App\Modules\Urpa\Models\UrpaIntegration;
use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaContact;
use App\Modules\Urpa\Models\UrpaFibonacciLink;
use App\Modules\Urpa\Services\FibonacciCrmService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IntegrationDataService
{
    public function __construct(
        private FibonacciCrmService $fibonacciCrmService
    ) {}

    /**
     * Get calendar events from all connected calendar integrations
     */
    public function getCalendarEvents(User $user, ?\Carbon\Carbon $startDate = null, ?\Carbon\Carbon $endDate = null): array
    {
        $cacheKey = "calendar_events:{$user->id}:" . ($startDate?->toDateString() ?? 'all');
        
        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user, $startDate, $endDate) {
            $events = [];
            
            // Get calendar integrations
            $calendarIntegrations = UrpaIntegration::where('user_id', $user->id)
                ->where('integration_type', 'calendar')
                ->where('status', 'connected')
                ->get();
            
            foreach ($calendarIntegrations as $integration) {
                try {
                    $integrationEvents = $this->fetchCalendarEvents($integration, $startDate, $endDate);
                    $events = array_merge($events, $integrationEvents);
                } catch (\Exception $e) {
                    Log::error("Failed to fetch calendar events for integration {$integration->id}", [
                        'error' => $e->getMessage(),
                    ]);
                }
            }
            
            // Also check synced activities
            $activityEvents = UrpaActivity::where('user_id', $user->id)
                ->where('activity_type', 'calendar')
                ->when($startDate, fn($q) => $q->where('activity_timestamp', '>=', $startDate))
                ->when($endDate, fn($q) => $q->where('activity_timestamp', '<=', $endDate))
                ->orderBy('activity_timestamp', 'asc')
                ->limit(50)
                ->get()
                ->map(fn($activity) => [
                    'id' => $activity->id,
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'start' => $activity->activity_timestamp,
                    'source' => $activity->source,
                ])
                ->toArray();
            
            return array_merge($events, $activityEvents);
        });
    }

    /**
     * Fetch calendar events from a specific integration
     */
    private function fetchCalendarEvents(UrpaIntegration $integration, ?\Carbon\Carbon $startDate, ?\Carbon\Carbon $endDate): array
    {
        $accessToken = Crypt::decryptString($integration->access_token_encrypted);
        $startDate = $startDate ?? now();
        $endDate = $endDate ?? now()->addDays(30);
        
        if ($integration->provider === 'google') {
            return $this->fetchGoogleCalendarEvents($accessToken, $startDate, $endDate);
        } elseif ($integration->provider === 'microsoft') {
            return $this->fetchOutlookCalendarEvents($accessToken, $startDate, $endDate);
        }
        
        return [];
    }

    /**
     * Fetch Google Calendar events
     */
    private function fetchGoogleCalendarEvents(string $accessToken, \Carbon\Carbon $startDate, \Carbon\Carbon $endDate): array
    {
        try {
            $url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
            $params = [
                'timeMin' => $startDate->toIso8601String(),
                'timeMax' => $endDate->toIso8601String(),
                'maxResults' => 50,
                'singleEvents' => true,
                'orderBy' => 'startTime',
            ];
            
            $response = Http::withToken($accessToken)->get($url, $params);
            
            if ($response->failed()) {
                return [];
            }
            
            $items = $response->json()['items'] ?? [];
            
            return array_map(function ($event) {
                return [
                    'id' => $event['id'],
                    'title' => $event['summary'] ?? 'Untitled Event',
                    'description' => $event['description'] ?? null,
                    'start' => $event['start']['dateTime'] ?? $event['start']['date'] ?? null,
                    'end' => $event['end']['dateTime'] ?? $event['end']['date'] ?? null,
                    'location' => $event['location'] ?? null,
                    'source' => 'google_calendar',
                ];
            }, $items);
        } catch (\Exception $e) {
            Log::error('Failed to fetch Google Calendar events', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Fetch Outlook Calendar events
     */
    private function fetchOutlookCalendarEvents(string $accessToken, \Carbon\Carbon $startDate, \Carbon\Carbon $endDate): array
    {
        try {
            $url = 'https://graph.microsoft.com/v1.0/me/calendar/events';
            $params = [
                '$filter' => "start/dateTime ge '{$startDate->toIso8601String()}' and end/dateTime le '{$endDate->toIso8601String()}'",
                '$top' => 50,
                '$orderby' => 'start/dateTime',
            ];
            
            $response = Http::withToken($accessToken)->get($url, $params);
            
            if ($response->failed()) {
                return [];
            }
            
            $items = $response->json()['value'] ?? [];
            
            return array_map(function ($event) {
                return [
                    'id' => $event['id'],
                    'title' => $event['subject'] ?? 'Untitled Event',
                    'description' => $event['bodyPreview'] ?? null,
                    'start' => $event['start']['dateTime'] ?? null,
                    'end' => $event['end']['dateTime'] ?? null,
                    'location' => $event['location']['displayName'] ?? null,
                    'source' => 'outlook_calendar',
                ];
            }, $items);
        } catch (\Exception $e) {
            Log::error('Failed to fetch Outlook Calendar events', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get contacts from all connected contact sources
     */
    public function getContacts(User $user, ?string $search = null): array
    {
        $cacheKey = "contacts:{$user->id}:" . ($search ? md5($search) : 'all');
        
        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($user, $search) {
            $query = UrpaContact::where('user_id', $user->id);
            
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'ilike', "%{$search}%")
                      ->orWhere('last_name', 'ilike', "%{$search}%")
                      ->orWhere('email', 'ilike', "%{$search}%")
                      ->orWhere('phone', 'ilike', "%{$search}%")
                      ->orWhere('company', 'ilike', "%{$search}%");
                });
            }
            
            return $query->orderBy('last_contacted_at', 'desc')
                ->limit(100)
                ->get()
                ->map(fn($contact) => [
                    'id' => $contact->id,
                    'name' => $contact->full_name,
                    'first_name' => $contact->first_name,
                    'last_name' => $contact->last_name,
                    'email' => $contact->email,
                    'phone' => $contact->phone,
                    'company' => $contact->company,
                    'job_title' => $contact->job_title,
                    'source' => $contact->source,
                ])
                ->toArray();
        });
    }

    /**
     * Get business information from Fibonacci CRM
     */
    public function getBusinessInfo(User $user): array
    {
        $fibonacciLink = UrpaFibonacciLink::where('urpa_user_id', $user->id)->first();
        
        if (!$fibonacciLink || !$fibonacciLink->fibonacci_business_id) {
            return [];
        }
        
        $cacheKey = "business_info:{$user->id}:{$fibonacciLink->fibonacci_business_id}";
        
        return Cache::remember($cacheKey, now()->addHour(), function () use ($fibonacciLink) {
            try {
                return $this->fibonacciCrmService->getBusinessData($fibonacciLink->fibonacci_business_id);
            } catch (\Exception $e) {
                Log::error('Failed to fetch business info', [
                    'error' => $e->getMessage(),
                    'business_id' => $fibonacciLink->fibonacci_business_id,
                ]);
                return [];
            }
        });
    }

    /**
     * Get upcoming tasks for the user
     */
    public function getTasks(User $user, ?int $limit = 10): array
    {
        $cacheKey = "tasks:{$user->id}:{$limit}";
        
        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user, $limit) {
            // Check if TaskJuggler is linked
            $taskJugglerLink = \App\Modules\Urpa\Models\UrpaTaskjugglerLink::where('urpa_user_id', $user->id)->first();
            
            if ($taskJugglerLink && $taskJugglerLink->sync_tasks) {
                // Fetch from TaskJuggler API
                try {
                    $taskService = app(\App\Modules\Urpa\Services\TaskJugglerSyncService::class);
                    return $taskService->fetchTasks($user, $limit);
                } catch (\Exception $e) {
                    Log::error('Failed to fetch tasks from TaskJuggler', ['error' => $e->getMessage()]);
                }
            }
            
            // Fallback to URPA AI tasks
            return \App\Modules\Urpa\Models\UrpaAiTask::where('user_id', $user->id)
                ->where('status', 'pending')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(fn($task) => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'priority' => 'medium', // Default priority
                    'status' => $task->status,
                    'due_date' => $task->due_at?->toIso8601String(),
                ])
                ->toArray();
        });
    }

    /**
     * Get recent activities
     */
    public function getRecentActivity(User $user, int $days = 7, int $limit = 20): array
    {
        $cacheKey = "recent_activity:{$user->id}:{$days}:{$limit}";
        
        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user, $days, $limit) {
            return UrpaActivity::where('user_id', $user->id)
                ->where('activity_timestamp', '>=', now()->subDays($days))
                ->orderBy('activity_timestamp', 'desc')
                ->limit($limit)
                ->get()
                ->map(fn($activity) => [
                    'id' => $activity->id,
                    'type' => $activity->activity_type,
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'timestamp' => $activity->activity_timestamp->toIso8601String(),
                    'source' => $activity->source,
                    'is_read' => $activity->is_read,
                ])
                ->toArray();
        });
    }
}

