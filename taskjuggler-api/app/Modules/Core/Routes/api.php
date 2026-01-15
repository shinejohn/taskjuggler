<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Core\Controllers\AuthController;
use App\Modules\Core\Controllers\ProfileController;
use App\Modules\Core\Controllers\SubscriptionController;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'timestamp' => now()]));

// Auth routes - with app context middleware
Route::middleware('app.context')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/auth/google/url', [AuthController::class, 'googleOAuthUrl']);
    Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);
});

Route::middleware(['auth:sanctum', 'app.context'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/push-token', [AuthController::class, 'registerPushToken']);
    Route::post('/subscriptions/checkout', [SubscriptionController::class, 'checkout']);
    
    // Profile routes
    Route::apiResource('profiles', ProfileController::class);
    Route::post('/profiles/{profile}/set-default', [ProfileController::class, 'setDefault'])->name('profiles.set-default');
});

