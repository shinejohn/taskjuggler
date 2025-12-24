<?php

namespace App\Providers;

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
    }
}
