<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/webhooks.php'));
        },
        channels: __DIR__.'/../routes/channels.php',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'twilio.signature' => \App\Http\Middleware\ValidateTwilioSignature::class,
            'sendgrid.signature' => \App\Http\Middleware\ValidateSendGridSignature::class,
            'module' => \App\Http\Middleware\ModuleAccess::class,
            'profile.context' => \App\Http\Middleware\ProfileContext::class,
            'team.context' => \App\Http\Middleware\TeamContext::class,
            'scanner.limits' => \App\Http\Middleware\CheckScannerLimits::class,
            'app.context' => \App\Http\Middleware\AppContext::class,
        ]);
        
        // Add profile context middleware to API routes
        $middleware->append(\App\Http\Middleware\ProfileContext::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
