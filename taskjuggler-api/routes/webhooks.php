<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Webhooks\TwilioController;
use App\Http\Controllers\Webhooks\SendGridController;

Route::prefix('webhooks')->group(function () {
    // Twilio
    Route::post('/twilio/voice/{user}', [TwilioController::class, 'voice'])
        ->name('webhooks.twilio.voice')
        ->middleware('twilio.signature');
    Route::post('/twilio/recording/{user}', [TwilioController::class, 'recording'])
        ->name('webhooks.twilio.recording')
        ->middleware('twilio.signature');
    Route::post('/twilio/transcription/{user}', [TwilioController::class, 'transcription'])
        ->name('webhooks.twilio.transcription')
        ->middleware('twilio.signature');
    Route::post('/twilio/sms/{user}', [TwilioController::class, 'sms'])
        ->name('webhooks.twilio.sms')
        ->middleware('twilio.signature');

    // SendGrid
    Route::post('/sendgrid/inbound', [SendGridController::class, 'inbound'])
        ->name('webhooks.sendgrid.inbound')
        ->middleware('sendgrid.signature');
});
