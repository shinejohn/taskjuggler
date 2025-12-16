<?php

namespace App\Services\Calendar;

use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;

class CalendarService
{
    /**
     * Generate iCal content for a single task
     */
    public function generateIcalForTask(Task $task, User $user): string
    {
        $uid = $task->id . '@' . parse_url(config('app.url'), PHP_URL_HOST);
        $now = Carbon::now();
        $created = $task->created_at ?? $now;
        $start = $task->start_date ?? $task->due_date ?? $created;
        $end = $task->due_date ?? $start->copy()->addHour();
        
        // If no end date, make it 1 hour duration
        if (!$task->due_date && $task->start_date) {
            $end = $start->copy()->addHour();
        } elseif (!$task->due_date) {
            $end = $start->copy()->addHour();
        }

        $summary = $this->escapeIcalText($task->title);
        $description = $this->escapeIcalText($task->description ?? '');
        
        // Add location if available
        $location = '';
        if ($task->location_address) {
            $locationParts = array_filter([
                $task->location_address,
                $task->location_unit,
                $task->location_city,
                $task->location_state,
                $task->location_zip,
            ]);
            $location = $this->escapeIcalText(implode(', ', $locationParts));
        }

        // Build iCal content
        $ical = "BEGIN:VCALENDAR\r\n";
        $ical .= "VERSION:2.0\r\n";
        $ical .= "PRODID:-//Task Juggler//Task Management//EN\r\n";
        $ical .= "CALSCALE:GREGORIAN\r\n";
        $ical .= "METHOD:PUBLISH\r\n";
        $ical .= "BEGIN:VEVENT\r\n";
        $ical .= "UID:{$uid}\r\n";
        $ical .= "DTSTAMP:" . $now->format('Ymd\THis\Z') . "\r\n";
        $ical .= "DTSTART:" . $start->format('Ymd\THis\Z') . "\r\n";
        $ical .= "DTEND:" . $end->format('Ymd\THis\Z') . "\r\n";
        $ical .= "SUMMARY:{$summary}\r\n";
        
        if ($description) {
            $ical .= "DESCRIPTION:{$description}\r\n";
        }
        
        if ($location) {
            $ical .= "LOCATION:{$location}\r\n";
        }
        
        // Add priority
        $priorityMap = [
            'urgent' => 1,
            'high' => 2,
            'normal' => 5,
            'low' => 9,
        ];
        $priority = $priorityMap[$task->priority ?? 'normal'] ?? 5;
        $ical .= "PRIORITY:{$priority}\r\n";
        
        // Add status
        if ($task->status === 'completed') {
            $ical .= "STATUS:COMPLETED\r\n";
        } elseif (in_array($task->status, ['accepted', 'in_progress'])) {
            $ical .= "STATUS:CONFIRMED\r\n";
        } else {
            $ical .= "STATUS:TENTATIVE\r\n";
        }
        
        // Add organizer (requestor)
        if ($task->requestor) {
            $organizer = $this->escapeIcalText($task->requestor->email ?? $task->requestor->name);
            $ical .= "ORGANIZER:MAILTO:{$organizer}\r\n";
        }
        
        // Add attendee (owner/assignee)
        if ($task->owner) {
            $attendee = $this->escapeIcalText($task->owner->email ?? $task->owner->name);
            $ical .= "ATTENDEE;ROLE=REQ-PARTICIPANT:MAILTO:{$attendee}\r\n";
        } elseif ($task->teamMember && $task->teamMember->email) {
            $attendee = $this->escapeIcalText($task->teamMember->email);
            $ical .= "ATTENDEE;ROLE=REQ-PARTICIPANT:MAILTO:{$attendee}\r\n";
        }
        
        // Add contact information
        if ($task->contact_email || $task->contact_phone) {
            $contactInfo = [];
            if ($task->contact_name) {
                $contactInfo[] = $task->contact_name;
            }
            if ($task->contact_email) {
                $contactInfo[] = "Email: {$task->contact_email}";
            }
            if ($task->contact_phone) {
                $contactInfo[] = "Phone: {$task->contact_phone}";
            }
            if (!empty($contactInfo)) {
                $contact = $this->escapeIcalText(implode('\\n', $contactInfo));
                $ical .= "CONTACT:{$contact}\r\n";
            }
        }
        
        // Add URL to task
        $taskUrl = config('app.url') . '/tasks/' . $task->id;
        $ical .= "URL:{$taskUrl}\r\n";
        
        // Add reminder (15 minutes before)
        $reminderTime = $start->copy()->subMinutes(15);
        if ($reminderTime->isFuture()) {
            $ical .= "BEGIN:VALARM\r\n";
            $ical .= "TRIGGER:-PT15M\r\n";
            $ical .= "ACTION:DISPLAY\r\n";
            $ical .= "DESCRIPTION:Reminder: {$summary}\r\n";
            $ical .= "END:VALARM\r\n";
        }
        
        $ical .= "END:VEVENT\r\n";
        $ical .= "END:VCALENDAR\r\n";
        
        return $ical;
    }

    /**
     * Generate iCal content for multiple tasks
     */
    public function generateIcalForTasks($tasks, User $user): string
    {
        $ical = "BEGIN:VCALENDAR\r\n";
        $ical .= "VERSION:2.0\r\n";
        $ical .= "PRODID:-//Task Juggler//Task Management//EN\r\n";
        $ical .= "CALSCALE:GREGORIAN\r\n";
        $ical .= "METHOD:PUBLISH\r\n";
        
        foreach ($tasks as $task) {
            $taskIcal = $this->generateIcalForTask($task, $user);
            // Extract VEVENT content (between BEGIN:VEVENT and END:VEVENT)
            if (preg_match('/BEGIN:VEVENT(.*?)END:VEVENT/s', $taskIcal, $matches)) {
                $ical .= "BEGIN:VEVENT\r\n";
                $ical .= $matches[1];
                $ical .= "END:VEVENT\r\n";
            }
        }
        
        $ical .= "END:VCALENDAR\r\n";
        
        return $ical;
    }

    /**
     * Generate Google Calendar URL
     */
    public function generateGoogleCalendarUrl(Task $task): string
    {
        $params = [
            'action' => 'TEMPLATE',
            'text' => $task->title,
            'dates' => $this->formatGoogleCalendarDate($task->start_date ?? $task->due_date ?? $task->created_at),
            'details' => $task->description ?? '',
        ];
        
        if ($task->due_date) {
            $endDate = $task->due_date;
        } elseif ($task->start_date) {
            $endDate = $task->start_date->copy()->addHour();
        } else {
            $endDate = ($task->created_at ?? now())->copy()->addHour();
        }
        
        $params['dates'] .= '/' . $this->formatGoogleCalendarDate($endDate);
        
        if ($task->location_address) {
            $locationParts = array_filter([
                $task->location_address,
                $task->location_unit,
                $task->location_city,
                $task->location_state,
                $task->location_zip,
            ]);
            $params['location'] = implode(', ', $locationParts);
        }
        
        return 'https://www.google.com/calendar/render?' . http_build_query($params);
    }

    /**
     * Generate Outlook Calendar URL
     */
    public function generateOutlookCalendarUrl(Task $task): string
    {
        $params = [
            'subject' => $task->title,
            'startdt' => ($task->start_date ?? $task->due_date ?? $task->created_at)->toIso8601String(),
            'body' => $task->description ?? '',
        ];
        
        if ($task->due_date) {
            $params['enddt'] = $task->due_date->toIso8601String();
        } elseif ($task->start_date) {
            $params['enddt'] = $task->start_date->copy()->addHour()->toIso8601String();
        } else {
            $params['enddt'] = ($task->created_at ?? now())->copy()->addHour()->toIso8601String();
        }
        
        if ($task->location_address) {
            $locationParts = array_filter([
                $task->location_address,
                $task->location_unit,
                $task->location_city,
                $task->location_state,
                $task->location_zip,
            ]);
            $params['location'] = implode(', ', $locationParts);
        }
        
        return 'https://outlook.live.com/calendar/0/deeplink/compose?' . http_build_query($params);
    }

    /**
     * Format date for Google Calendar (YYYYMMDDTHHMMSSZ)
     */
    private function formatGoogleCalendarDate($date): string
    {
        if (!$date) {
            $date = now();
        }
        
        if ($date instanceof Carbon) {
            return $date->format('Ymd\THis\Z');
        }
        
        return Carbon::parse($date)->format('Ymd\THis\Z');
    }

    /**
     * Escape text for iCal format
     */
    private function escapeIcalText(string $text): string
    {
        $text = str_replace('\\', '\\\\', $text);
        $text = str_replace(',', '\\,', $text);
        $text = str_replace(';', '\\;', $text);
        $text = str_replace("\n", '\\n', $text);
        $text = str_replace("\r", '', $text);
        
        // Wrap long lines (max 75 characters per line)
        $lines = [];
        $currentLine = '';
        $words = explode(' ', $text);
        
        foreach ($words as $word) {
            if (strlen($currentLine . $word) > 75) {
                if ($currentLine) {
                    $lines[] = $currentLine;
                    $currentLine = $word . ' ';
                } else {
                    // Word is too long, split it
                    $lines[] = substr($word, 0, 75);
                    $currentLine = substr($word, 75) . ' ';
                }
            } else {
                $currentLine .= $word . ' ';
            }
        }
        
        if ($currentLine) {
            $lines[] = rtrim($currentLine);
        }
        
        return implode("\r\n ", $lines);
    }
}
