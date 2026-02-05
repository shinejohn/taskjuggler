<?php

namespace App\Providers;

use App\Events\TaskCreated;
use App\Events\TaskStateChanged;
use App\Listeners\ProcessTaskCreatedListener;
use App\Listeners\ProcessTaskUpdatedListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register Process trigger listeners
        Event::listen(TaskCreated::class, ProcessTaskCreatedListener::class);
        Event::listen(TaskStateChanged::class, ProcessTaskUpdatedListener::class);
    }
}
