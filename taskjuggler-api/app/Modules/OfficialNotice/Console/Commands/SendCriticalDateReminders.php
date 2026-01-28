<?php

namespace App\Modules\OfficialNotice\Console\Commands;

use Illuminate\Console\Command;
use App\Modules\OfficialNotice\Models\CriticalDate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendCriticalDateReminders extends Command
{
    protected $signature = 'official-notice:send-reminders';
    protected $description = 'Check for critical dates and send notifications';

    public function handle()
    {
        $this->info('Checking for critical dates...');

        // Logic: Find dates due within the next N days (e.g., 30) that haven't been resolved
        // In a real app, 'reminder_days_before' would differ per date.
        // For MVP, we check everything due in the next 30 days.

        $upcomingDates = CriticalDate::where('is_resolved', false)
            ->whereDate('due_date', '<=', Carbon::now()->addDays(30))
            ->whereDate('due_date', '>=', Carbon::now())
            ->get();

        foreach ($upcomingDates as $date) {
            $this->info("Reminder: {$date->title} is due on {$date->due_date}");

            // Dispatch Notification (Placeholder)
            // Notification::route('mail', 'user@example.com')->notify(new CriticalDateAlert($date));

            Log::info("Sent reminder for Critical Date ID: {$date->id}");
        }

        $this->info("Processed " . $upcomingDates->count() . " reminders.");
    }
}
