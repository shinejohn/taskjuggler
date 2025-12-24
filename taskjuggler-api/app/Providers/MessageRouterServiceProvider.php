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
            // MessageRouter constructor requires TEFMessageFactory and TEFValidator
            $tefMessageFactory = $app->make(\App\Services\TEF\TEFMessageFactory::class);
            $tefValidator = $app->make(\App\Services\TEF\TEFValidator::class);
            
            $router = new MessageRouter($tefMessageFactory, $tefValidator);
            
            return $router;
        });
    }

    public function boot(): void
    {
        //
    }
}
