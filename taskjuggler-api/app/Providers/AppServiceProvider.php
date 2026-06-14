<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use App\Services\AI\McpServerService;

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
        // Point password reset emails at the SPA reset page
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.url').'/reset-password?token='.$token.'&email='.urlencode($user->email);
        });

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
            \App\Events\TaskUpdated::class,
            \App\Listeners\TriggerProcessOnTaskUpdated::class
        );

        // Load migrations from coordinator subdirectory
        $this->loadMigrationsFrom(database_path('migrations/coordinator'));

        // Load migrations from Processes, Projects, and Communications modules
        $this->loadMigrationsFrom(app_path('Modules/Processes/Migrations'));
        $this->loadMigrationsFrom(app_path('Modules/Projects/Migrations'));
        $this->loadMigrationsFrom(app_path('Modules/Communications/Migrations'));
    }
}
