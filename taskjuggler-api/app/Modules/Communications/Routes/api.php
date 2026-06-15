<?php

use App\Modules\Communications\Controllers\AwsWebhookController;
use App\Modules\Communications\Controllers\MatrixController;
use App\Modules\Communications\Controllers\MatrixWebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Communications API Routes
|--------------------------------------------------------------------------
|
| Common telco services shared between URPA and Coordinator (4Calls)
|
*/

// Webhook routes (no auth required - AWS validates signatures)
Route::prefix('communications/webhooks')->group(function () {
    Route::post('/aws-connect', [AwsWebhookController::class, 'handleConnect']);
    Route::post('/aws-sms', [AwsWebhookController::class, 'handleSms']);
});

// Matrix messaging (Phase 2 comms modernization)
Route::post('/matrix/webhook', [MatrixWebhookController::class, 'handle']);

Route::middleware('auth:sanctum')->prefix('matrix')->group(function () {
    Route::get('/status', [MatrixController::class, 'status']);
    Route::get('/session', [MatrixController::class, 'session']);
    Route::get('/dm/{userId}', [MatrixController::class, 'directRoom']);
});
