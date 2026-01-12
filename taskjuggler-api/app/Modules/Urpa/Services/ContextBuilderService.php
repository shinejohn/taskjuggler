<?php

namespace App\Modules\Urpa\Services;

use App\Models\User;
use App\Modules\Urpa\Models\UrpaContact;
use App\Modules\Urpa\Models\UrpaUserProfile;
use App\Modules\Urpa\Models\UrpaUserPersona;
use Illuminate\Support\Facades\Log;

class ContextBuilderService
{
    public function __construct(
        private IntegrationDataService $integrationDataService
    ) {}

    /**
     * Build comprehensive context for a phone call or chat session
     */
    public function buildCallContext(User $user, ?UrpaContact $contact = null): array
    {
        return [
            'user' => $this->getUserContext($user),
            'contact' => $contact ? $this->getContactContext($contact) : null,
            'calendar' => $this->getCalendarContext($user),
            'tasks' => $this->getTasksContext($user),
            'business' => $this->getBusinessContext($user),
            'recent_activity' => $this->getRecentActivity($user),
            'time' => [
                'current' => now()->toIso8601String(),
                'timezone' => config('app.timezone', 'UTC'),
                'time_of_day' => $this->getTimeOfDay(),
            ],
        ];
    }

    /**
     * Build system prompt with rich context
     */
    public function buildSystemPrompt(User $user, array $context, string $persona = 'professional'): string
    {
        $profile = UrpaUserProfile::where('user_id', $user->id)->first();
        $personaData = UrpaUserPersona::where('user_id', $user->id)
            ->where('name', $persona)
            ->first();
        
        $basePrompt = "You are URPA, a Universal Remote Personal Assistant for {$user->name}.";
        
        // Add persona-specific instructions
        $personaPrompts = [
            'professional' => "Maintain a professional, courteous tone. Be concise and efficient.",
            'friendly' => "Be warm, friendly, and conversational. Show genuine interest.",
            'executive' => "Be direct, strategic, and focused on high-level priorities.",
            'creative' => "Be imaginative, inspiring, and open to creative solutions.",
        ];
        
        $personaPrompt = $personaData?->system_prompt ?? ($personaPrompts[$persona] ?? $personaPrompts['professional']);
        
        // Build context sections
        $contextSections = [];
        
        // User context
        $contextSections[] = "USER CONTEXT:";
        $contextSections[] = "- Name: {$user->name}";
        if ($user->email) {
            $contextSections[] = "- Email: {$user->email}";
        }
        if ($user->phone) {
            $contextSections[] = "- Phone: {$user->phone}";
        }
        
        // Business context
        if (!empty($context['business'])) {
            $business = $context['business'];
            $contextSections[] = "\nBUSINESS CONTEXT:";
            if (!empty($business['name'])) {
                $contextSections[] = "- Business: {$business['name']}";
            }
            if (!empty($business['industry'])) {
                $contextSections[] = "- Industry: {$business['industry']}";
            }
            if (!empty($business['hours'])) {
                $hours = is_array($business['hours']) ? json_encode($business['hours']) : $business['hours'];
                $contextSections[] = "- Business Hours: {$hours}";
            }
            if (!empty($business['phone'])) {
                $contextSections[] = "- Business Phone: {$business['phone']}";
            }
            if (!empty($business['email'])) {
                $contextSections[] = "- Business Email: {$business['email']}";
            }
        }
        
        // Contact context
        if (!empty($context['contact'])) {
            $contact = $context['contact'];
            $contextSections[] = "\nCALLER CONTEXT:";
            $contextSections[] = "- Name: {$contact['name']}";
            if (!empty($contact['email'])) {
                $contextSections[] = "- Email: {$contact['email']}";
            }
            if (!empty($contact['phone'])) {
                $contextSections[] = "- Phone: {$contact['phone']}";
            }
            if (!empty($contact['company'])) {
                $contextSections[] = "- Company: {$contact['company']}";
            }
            if (!empty($contact['job_title'])) {
                $contextSections[] = "- Job Title: {$contact['job_title']}";
            }
        }
        
        // Calendar context
        if (!empty($context['calendar']) && count($context['calendar']) > 0) {
            $contextSections[] = "\nUPCOMING EVENTS:";
            $upcomingEvents = array_slice($context['calendar'], 0, 5);
            foreach ($upcomingEvents as $event) {
                $start = isset($event['start']) ? \Carbon\Carbon::parse($event['start'])->format('M j, Y g:i A') : 'TBD';
                $contextSections[] = "- {$event['title']} on {$start}";
            }
        }
        
        // Tasks context
        if (!empty($context['tasks']) && count($context['tasks']) > 0) {
            $contextSections[] = "\nPENDING TASKS:";
            $pendingTasks = array_slice($context['tasks'], 0, 5);
            foreach ($pendingTasks as $task) {
                $priority = strtoupper($task['priority'] ?? 'medium');
                $contextSections[] = "- [{$priority}] {$task['title']}";
            }
        }
        
        // Time context
        if (!empty($context['time'])) {
            $time = $context['time'];
            $contextSections[] = "\nTIME CONTEXT:";
            $contextSections[] = "- Current Time: " . \Carbon\Carbon::parse($time['current'])->format('l, F j, Y g:i A');
            $contextSections[] = "- Time of Day: " . ucfirst($time['time_of_day']);
            $contextSections[] = "- Timezone: {$time['timezone']}";
        }
        
        // Available actions
        $contextSections[] = "\nAVAILABLE ACTIONS:";
        $contextSections[] = "- schedule_appointment(date, time, duration, notes) - Schedule an appointment or meeting";
        $contextSections[] = "- create_task(title, description, priority) - Create a new task";
        $contextSections[] = "- send_email(to, subject, body) - Send an email";
        $contextSections[] = "- lookup_contact(name_or_number) - Find contact information";
        $contextSections[] = "- get_calendar(date_range) - Get calendar events";
        
        // Response strategy
        $contextSections[] = "\nRESPONSE STRATEGY:";
        $contextSections[] = "1. Check if pre-recorded response exists (use when possible to save costs)";
        $contextSections[] = "2. Use function calling for structured actions (schedule, create task, etc.)";
        $contextSections[] = "3. Generate natural response only when needed";
        $contextSections[] = "4. Keep responses concise and professional";
        $contextSections[] = "5. Personalize responses using caller's name when available";
        
        $capabilities = "You can help with: scheduling, task management, email composition, research, content creation, and general assistance.";
        
        return $basePrompt . "\n\n" . $personaPrompt . "\n\n" . implode("\n", $contextSections) . "\n\n" . $capabilities;
    }

    /**
     * Get user context
     */
    private function getUserContext(User $user): array
    {
        $profile = UrpaUserProfile::where('user_id', $user->id)->first();
        
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'default_persona' => $profile?->default_persona ?? 'professional',
            'has_text_assistant' => $profile?->has_text_assistant ?? false,
            'has_phone_assistant' => $profile?->has_phone_assistant ?? false,
        ];
    }

    /**
     * Get contact context
     */
    private function getContactContext(UrpaContact $contact): array
    {
        return [
            'id' => $contact->id,
            'name' => $contact->full_name,
            'first_name' => $contact->first_name,
            'last_name' => $contact->last_name,
            'email' => $contact->email,
            'phone' => $contact->phone,
            'company' => $contact->company,
            'job_title' => $contact->job_title,
            'source' => $contact->source,
            'last_contacted_at' => $contact->last_contacted_at?->toIso8601String(),
        ];
    }

    /**
     * Get calendar context
     */
    private function getCalendarContext(User $user): array
    {
        return $this->integrationDataService->getCalendarEvents(
            $user,
            now(),
            now()->addDays(7)
        );
    }

    /**
     * Get tasks context
     */
    private function getTasksContext(User $user): array
    {
        return $this->integrationDataService->getTasks($user, 10);
    }

    /**
     * Get business context
     */
    private function getBusinessContext(User $user): array
    {
        return $this->integrationDataService->getBusinessInfo($user);
    }

    /**
     * Get recent activity context
     */
    private function getRecentActivity(User $user): array
    {
        return $this->integrationDataService->getRecentActivity($user, 7, 10);
    }

    /**
     * Get time of day (morning, afternoon, evening)
     */
    private function getTimeOfDay(): string
    {
        $hour = (int) now()->format('H');
        
        if ($hour >= 5 && $hour < 12) {
            return 'morning';
        } elseif ($hour >= 12 && $hour < 17) {
            return 'afternoon';
        } elseif ($hour >= 17 && $hour < 21) {
            return 'evening';
        } else {
            return 'night';
        }
    }
}

