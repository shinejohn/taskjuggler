<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Modules\SiteHealth\Models\Site;
use App\Modules\SiteHealth\Policies\SitePolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Site::class => SitePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
