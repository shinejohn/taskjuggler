<?php

/**
 * HEALTH CHECK ROUTE
 * 
 * Add this to your routes/api.php file.
 * Railway uses this to determine if your app is healthy.
 * 
 * Usage: Add this line to routes/api.php:
 *   require __DIR__.'/health.php';
 * 
 * Or copy the route directly into routes/api.php
 */

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

Route::get('/health', function () {
    $status = 'healthy';
    $checks = [];
    $httpCode = 200;

    // Check Database
    try {
        DB::connection()->getPdo();
        DB::select('SELECT 1');
        $checks['database'] = 'connected';
    } catch (\Exception $e) {
        $checks['database'] = 'failed: ' . $e->getMessage();
        $status = 'unhealthy';
        $httpCode = 500;
    }

    // Check Redis
    try {
        $cacheKey = 'health_check_' . time();
        Cache::store('redis')->put($cacheKey, true, 10);
        Cache::store('redis')->forget($cacheKey);
        $checks['redis'] = 'connected';
    } catch (\Exception $e) {
        $checks['redis'] = 'failed: ' . $e->getMessage();
        // Redis failure is not fatal - app can still work
        $checks['redis_warning'] = 'degraded performance expected';
    }

    // Check Storage
    try {
        $storagePath = storage_path('framework/cache');
        if (is_writable($storagePath)) {
            $checks['storage'] = 'writable';
        } else {
            $checks['storage'] = 'not writable';
            $status = 'degraded';
        }
    } catch (\Exception $e) {
        $checks['storage'] = 'failed: ' . $e->getMessage();
    }

    // App info
    $info = [
        'app_name' => config('app.name'),
        'environment' => config('app.env'),
        'laravel_version' => app()->version(),
        'php_version' => PHP_VERSION,
    ];

    return response()->json([
        'status' => $status,
        'timestamp' => now()->toIso8601String(),
        'checks' => $checks,
        'info' => $info,
    ], $httpCode);
});

// Simple ping endpoint
Route::get('/ping', function () {
    return response()->json(['pong' => true, 'time' => now()->toIso8601String()]);
});
