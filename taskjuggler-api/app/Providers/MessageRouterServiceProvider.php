<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\MessageRouter\MessageRouter;
use App\Services\MessageRouter\Adapters\EmailAdapter;
use App\Services\MessageRouter\Adapters\SmsAdapter;
use App\Services\MessageRouter\Adapters\SlackAdapter;
use App\Services\MessageRouter\Adapters\InAppAdapter;

class MessageRouterServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(MessageRouter::class, function ($app) {
            $router = new MessageRouter();
            
            // Register adapters
            $router->registerAdapter('email', $app->make(EmailAdapter::class));
            $router->registerAdapter('sms', $app->make(SmsAdapter::class));
            $router->registerAdapter('slack', $app->make(SlackAdapter::class));
            $router->registerAdapter('in_app', $app->make(InAppAdapter::class));
            
            return $router;
        });
    }

    public function boot(): void
    {
        //
    }
}
