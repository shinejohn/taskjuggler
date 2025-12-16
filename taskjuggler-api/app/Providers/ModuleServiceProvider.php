<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadModuleRoutes();
        $this->loadModuleMigrations();
    }

    protected function getEnabledModules(): array
    {
        return collect(config('modules.enabled', []))
            ->filter(fn($enabled) => $enabled === true)
            ->keys()
            ->map(fn($name) => ucfirst($name))
            ->toArray();
    }

    protected function loadModuleRoutes(): void
    {
        foreach ($this->getEnabledModules() as $module) {
            $routesPath = app_path("Modules/{$module}/Routes/api.php");
            
            if (File::exists($routesPath)) {
                Route::middleware('api')
                    ->prefix('api')
                    ->group($routesPath);
            }
        }
    }

    protected function loadModuleMigrations(): void
    {
        foreach ($this->getEnabledModules() as $module) {
            $migrationsPath = app_path("Modules/{$module}/Migrations");
            
            if (File::isDirectory($migrationsPath)) {
                $this->loadMigrationsFrom($migrationsPath);
            }
        }
    }
}

