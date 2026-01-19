<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Communications\Controllers\AwsWebhookController;

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

