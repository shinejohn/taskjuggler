<?php

namespace App\Providers;

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
        // Register MCP tools for AI agents
        if (class_exists(\PhpMcp\Laravel\Facades\Mcp::class)) {
            try {
                app(\App\Services\AI\McpServerService::class)->registerMcpTools();
            } catch (\Exception $e) {
                // MCP not configured, skip
            }
        }

        // Register Task Observer for trust score updates
        \App\Models\Task::observe(\App\Observers\TaskObserver::class);

        // Register event listeners for process triggers
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\TaskCreated::class,
            \App\Listeners\TriggerProcessOnTaskCreated::class
        );

        \Illuminate\Support\Facades\Event::listen(
            \App\Events\TaskCreated::class,
            \App\Listeners\ProvisionMatrixOnTaskCreated::class
        );

        \Illuminate\Support\Facades\Event::listen(
            \App\Events\TaskUpdated::class,
            \App\Listeners\TriggerProcessOnTaskUpdated::class
        );

        \Illuminate\Support\Facades\Event::listen(
            \App\Events\TaskUpdated::class,
            \App\Listeners\SyncTaskToUrpaOnUpdate::class
        );

        // Load migrations from coordinator subdirectory
        $this->loadMigrationsFrom(database_path('migrations/coordinator'));

        // Load migrations from Processes, Projects, and Communications modules
        $this->loadMigrationsFrom(app_path('Modules/Processes/Migrations'));
        $this->loadMigrationsFrom(app_path('Modules/Projects/Migrations'));
        $this->loadMigrationsFrom(app_path('Modules/Communications/Migrations'));

        // Urpa and Coordinator are not in config('modules.enabled'), so the
        // ModuleServiceProvider never loads their migrations — but main-dir
        // migrations (e.g. urpa_webhook_events) FK their tables. Load explicitly.
        $this->loadMigrationsFrom(app_path('Modules/Urpa/Migrations'));
        $this->loadMigrationsFrom(app_path('Modules/Coordinator/Migrations'));
    }
}
