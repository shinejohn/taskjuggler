<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Core\Controllers\AuthController;
use App\Modules\Core\Controllers\ProfileController;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'timestamp' => now()]));

// Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/push-token', [AuthController::class, 'registerPushToken']);
    
    // Profile routes
    Route::apiResource('profiles', ProfileController::class);
    Route::post('/profiles/{profile}/set-default', [ProfileController::class, 'setDefault'])->name('profiles.set-default');
});

