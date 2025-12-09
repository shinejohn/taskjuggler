<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Notification;
use App\Models\InboxItem;
use App\Models\Task;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduled Tasks
Schedule::call(function () {
    // Clean up old read notifications (older than 30 days)
    Notification::where('read_at', '!=', null)
        ->where('read_at', '<', Carbon::now()->subDays(30))
        ->delete();
})->daily()->at('02:00')->name('cleanup-old-notifications');

Schedule::call(function () {
    // Clean up old processed inbox items (older than 90 days)
    InboxItem::where('processed_at', '!=', null)
        ->where('processed_at', '<', Carbon::now()->subDays(90))
        ->delete();
})->weekly()->sundays()->at('03:00')->name('cleanup-old-inbox-items');

Schedule::call(function () {
    // Log stale tasks (no activity for 7 days) for monitoring
    $staleCount = Task::where('status', '!=', 'completed')
        ->where('status', '!=', 'cancelled')
        ->where('updated_at', '<', Carbon::now()->subDays(7))
        ->count();
    
    if ($staleCount > 0) {
        \Log::info("Found {$staleCount} stale tasks requiring attention");
    }
})->hourly()->name('monitor-stale-tasks');

Schedule::call(function () {
    // Clean up failed jobs older than 7 days
    \DB::table('failed_jobs')
        ->where('failed_at', '<', Carbon::now()->subDays(7))
        ->delete();
})->daily()->at('04:00')->name('cleanup-failed-jobs');
