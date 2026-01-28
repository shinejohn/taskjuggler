<?php

namespace App\Modules\OfficialNotice\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class OfficialNoticeServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');

        Route::prefix('api/official-notice')
            ->middleware('api')
            ->namespace('App\Modules\OfficialNotice\Controllers')
            ->group(__DIR__ . '/../Routes/api.php');

        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Modules\OfficialNotice\Console\Commands\SendCriticalDateReminders::class,
            ]);
        }
    }

    public function register()
    {
        //
    }
}
