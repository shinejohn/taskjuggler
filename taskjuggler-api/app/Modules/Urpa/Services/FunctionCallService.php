<?php

namespace App\Modules\Urpa\Services;

use App\Models\User;
use App\Modules\Urpa\Models\UrpaAiTask;
use App\Modules\Urpa\Models\UrpaContact;
use App\Modules\Urpa\Models\UrpaActivity;
use Illuminate\Support\Facades\Log;

class FunctionCallService
{
    public function __construct(
        private IntegrationDataService $integrationDataService
    ) {}

    /**
     * Get available functions for AI to call
     */
    public function getAvailableFunctions(): array
    {
        return [
            'schedule_appointment' => [
                'description' => 'Schedule an appointment or meeting',
                'parameters' => [
                    'date' => ['type' => 'string', 'description' => 'Date in YYYY-MM-DD format', 'required' => true],
                    'time' => ['type' => 'string', 'description' => 'Time in HH:MM format', 'required' => true],
                    'duration' => ['type' => 'integer', 'description' => 'Duration in minutes', 'required' => false, 'default' => 30],
                    'title' => ['type' => 'string', 'description' => 'Event title', 'required' => true],
                    'notes' => ['type' => 'string', 'description' => 'Additional notes', 'required' => false],
                ],
            ],
            'create_task' => [
                'description' => 'Create a new task',
                'parameters' => [
                    'title' => ['type' => 'string', 'description' => 'Task title', 'required' => true],
                    'description' => ['type' => 'string', 'description' => 'Task description', 'required' => false],
                    'priority' => ['type' => 'string', 'description' => 'Priority: low, medium, high, urgent', 'required' => false, 'default' => 'medium'],
                    'due_date' => ['type' => 'string', 'description' => 'Due date in YYYY-MM-DD format', 'required' => false],
                ],
            ],
            'send_email' => [
                'description' => 'Send an email',
                'parameters' => [
                    'to' => ['type' => 'string', 'description' => 'Recipient email address', 'required' => true],
                    'subject' => ['type' => 'string', 'description' => 'Email subject', 'required' => true],
                    'body' => ['type' => 'string', 'description' => 'Email body', 'required' => true],
                ],
            ],
            'lookup_contact' => [
                'description' => 'Find contact information by name or number',
                'parameters' => [
                    'search' => ['type' => 'string', 'description' => 'Name, email, or phone number to search', 'required' => true],
                ],
            ],
            'get_calendar' => [
                'description' => 'Get calendar events for a date range',
                'parameters' => [
                    'start_date' => ['type' => 'string', 'description' => 'Start date in YYYY-MM-DD format', 'required' => false],
                    'end_date' => ['type' => 'string', 'description' => 'End date in YYYY-MM-DD format', 'required' => false],
                ],
            ],
        ];
    }

    /**
     * Execute a function call
     */
    public function executeFunction(string $name, array $params, User $user): array
    {
        try {
            return match($name) {
                'schedule_appointment' => $this->scheduleAppointment($params, $user),
                'create_task' => $this->createTask($params, $user),
                'send_email' => $this->sendEmail($params, $user),
                'lookup_contact' => $this->lookupContact($params, $user),
                'get_calendar' => $this->getCalendar($params, $user),
                default => ['error' => "Unknown function: {$name}"],
            };
        } catch (\Exception $e) {
            Log::error("Function call failed: {$name}", [
                'error' => $e->getMessage(),
                'params' => $params,
                'user_id' => $user->id,
            ]);
            
            return [
                'error' => 'Function execution failed',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Schedule an appointment
     */
    private function scheduleAppointment(array $params, User $user): array
    {
        $date = $params['date'] ?? null;
        $time = $params['time'] ?? null;
        $duration = $params['duration'] ?? 30;
        $title = $params['title'] ?? 'Appointment';
        $notes = $params['notes'] ?? null;

        if (!$date || !$time) {
            return ['error' => 'Date and time are required'];
        }

        try {
            $startDateTime = \Carbon\Carbon::parse("{$date} {$time}");
            $endDateTime = $startDateTime->copy()->addMinutes($duration);

            // Create calendar activity
            $activity = UrpaActivity::create([
                'user_id' => $user->id,
                'activity_type' => 'calendar',
                'source' => 'urpa_ai',
                'title' => $title,
                'description' => $notes,
                'activity_timestamp' => $startDateTime,
                'raw_content' => [
                    'start' => $startDateTime->toIso8601String(),
                    'end' => $endDateTime->toIso8601String(),
                    'duration' => $duration,
                ],
            ]);

            return [
                'success' => true,
                'message' => "Appointment scheduled for {$startDateTime->format('M j, Y g:i A')}",
                'activity_id' => $activity->id,
                'start' => $startDateTime->toIso8601String(),
                'end' => $endDateTime->toIso8601String(),
            ];
        } catch (\Exception $e) {
            return ['error' => 'Failed to schedule appointment: ' . $e->getMessage()];
        }
    }

    /**
     * Create a task
     */
    private function createTask(array $params, User $user): array
    {
        $title = $params['title'] ?? null;
        $description = $params['description'] ?? null;
        $priority = $params['priority'] ?? 'medium';
        $dueDate = $params['due_date'] ?? null;

        if (!$title) {
            return ['error' => 'Task title is required'];
        }

        try {
            $task = UrpaAiTask::create([
                'user_id' => $user->id,
                'title' => $title,
                'description' => $description,
                'status' => 'pending',
                'source_type' => 'ai_function_call',
                'due_at' => $dueDate ? \Carbon\Carbon::parse($dueDate) : null,
            ]);

            return [
                'success' => true,
                'message' => "Task '{$title}' created successfully",
                'task_id' => $task->id,
            ];
        } catch (\Exception $e) {
            return ['error' => 'Failed to create task: ' . $e->getMessage()];
        }
    }

    /**
     * Send an email
     */
    private function sendEmail(array $params, User $user): array
    {
        $to = $params['to'] ?? null;
        $subject = $params['subject'] ?? null;
        $body = $params['body'] ?? null;

        if (!$to || !$subject || !$body) {
            return ['error' => 'To, subject, and body are required'];
        }

        try {
            // Get user's email channel
            $emailChannel = $user->getEmailChannel();
            
            if (!$emailChannel) {
                // If no email channel exists, create activity but don't send
                $activity = UrpaActivity::create([
                    'user_id' => $user->id,
                    'activity_type' => 'email',
                    'source' => 'urpa_ai',
                    'title' => $subject,
                    'description' => $body,
                    'raw_content' => [
                        'to' => $to,
                        'subject' => $subject,
                        'body' => $body,
                        'status' => 'failed',
                        'error' => 'No email channel configured',
                    ],
                ]);

                return [
                    'success' => false,
                    'message' => "Email channel not configured. Please set up an email channel first.",
                    'activity_id' => $activity->id,
                ];
            }

            // Send email using SendGrid service
            $emailService = app(\App\Services\SendGrid\EmailService::class);
            $sent = $emailService->sendEmail(
                $emailChannel,
                $to,
                $subject,
                nl2br(e($body)), // Convert to HTML
                strip_tags($body), // Plain text version
                []
            );

            // Create email activity
            $activity = UrpaActivity::create([
                'user_id' => $user->id,
                'activity_type' => 'email',
                'source' => 'urpa_ai',
                'title' => $subject,
                'description' => $body,
                'raw_content' => [
                    'to' => $to,
                    'subject' => $subject,
                    'body' => $body,
                    'status' => $sent ? 'sent' : 'failed',
                    'channel_id' => $emailChannel->id,
                ],
            ]);

            if ($sent) {
                return [
                    'success' => true,
                    'message' => "Email to {$to} sent successfully",
                    'activity_id' => $activity->id,
                ];
            } else {
                return [
                    'success' => false,
                    'message' => "Failed to send email to {$to}. Please check your SendGrid configuration.",
                    'activity_id' => $activity->id,
                ];
            }
        } catch (\Exception $e) {
            Log::error('Email sending error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'to' => $to,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Lookup contact
     */
    private function lookupContact(array $params, User $user): array
    {
        $search = $params['search'] ?? null;

        if (!$search) {
            return ['error' => 'Search term is required'];
        }

        try {
            $contacts = $this->integrationDataService->getContacts($user, $search);

            if (empty($contacts)) {
                return [
                    'success' => false,
                    'message' => 'No contacts found',
                    'contacts' => [],
                ];
            }

            return [
                'success' => true,
                'message' => 'Found ' . count($contacts) . ' contact(s)',
                'contacts' => $contacts,
            ];
        } catch (\Exception $e) {
            return ['error' => 'Failed to lookup contact: ' . $e->getMessage()];
        }
    }

    /**
     * Get calendar events
     */
    private function getCalendar(array $params, User $user): array
    {
        $startDate = $params['start_date'] ?? null;
        $endDate = $params['end_date'] ?? null;

        try {
            $start = $startDate ? \Carbon\Carbon::parse($startDate) : now();
            $end = $endDate ? \Carbon\Carbon::parse($endDate) : now()->addDays(7);

            $events = $this->integrationDataService->getCalendarEvents($user, $start, $end);

            return [
                'success' => true,
                'message' => 'Found ' . count($events) . ' event(s)',
                'events' => $events,
            ];
        } catch (\Exception $e) {
            return ['error' => 'Failed to get calendar: ' . $e->getMessage()];
        }
    }
}

