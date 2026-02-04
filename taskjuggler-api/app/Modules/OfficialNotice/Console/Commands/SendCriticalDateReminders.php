<?php

namespace App\Modules\OfficialNotice\Console\Commands;

use Illuminate\Console\Command;
use App\Modules\OfficialNotice\Models\CriticalDate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendCriticalDateReminders extends Command
{
    protected $signature = 'official-notice:send-reminders';
    protected $description = 'Check for critical dates and send notifications';

    public function handle()
    {
        $this->info('Checking for critical dates...');

        // Find dates due within the next 30 days that haven't been resolved
        $upcomingDates = CriticalDate::with(['document.area'])
            ->where('is_resolved', false)
            ->whereDate('due_date', '<=', Carbon::now()->addDays(30))
            ->whereDate('due_date', '>=', Carbon::now())
            ->whereNull('last_reminder_sent_at')
            ->orWhere(function ($query) {
                $query->where('is_resolved', false)
                    ->where('last_reminder_sent_at', '<', Carbon::now()->subDays(7));
            })
            ->get();

        $sentCount = 0;

        foreach ($upcomingDates as $date) {
            $this->info("Reminder: {$date->title} is due on {$date->due_date}");

            try {
                // Get the document owner to notify
                $owner = User::find($date->document?->area?->owner_id);

                if ($owner && $owner->email) {
                    // Send notification using Laravel's mail
                    Notification::route('mail', $owner->email)->notify(
                        new \App\Notifications\CriticalDateReminderNotification($date)
                    );

                    // Update last reminder sent timestamp
                    $date->update(['last_reminder_sent_at' => now()]);
                    $sentCount++;

                    Log::info("Sent reminder for Critical Date ID: {$date->id} to {$owner->email}");
                } else {
                    Log::warning("No owner found for Critical Date ID: {$date->id}");
                }
            } catch (\Exception $e) {
                Log::error("Failed to send reminder for Critical Date ID: {$date->id} - {$e->getMessage()}");
            }
        }

        $this->info("Processed {$upcomingDates->count()} dates, sent {$sentCount} reminders.");
    }
}
