<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Doctors\Controllers\DashboardController;

Route::middleware(['auth:sanctum'])->prefix('doctors')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ScribeMD
    Route::post('/scribe/start', [\App\Modules\Doctors\Controllers\ScribeController::class, 'start']);
    Route::post('/scribe/{id}/generate', [\App\Modules\Doctors\Controllers\ScribeController::class, 'generate']);
    // Visit Review (Aggregated Data)
    Route::get('/visits/{id}/review', [\App\Modules\Doctors\Controllers\ScribeController::class, 'review']);

    // RCM (Claims)
    Route::post('/claims/generate', [\App\Modules\Doctors\Controllers\RcmController::class, 'generate']);
    Route::post('/claims/{id}/submit', [\App\Modules\Doctors\Controllers\RcmController::class, 'submit']);

    // Patients
    Route::post('/patients', [\App\Modules\Doctors\Controllers\PatientController::class, 'store']);
    Route::get('/patients', [\App\Modules\Doctors\Controllers\PatientController::class, 'index']);

    // Schedule
    Route::get('/schedule/availability', [\App\Modules\Doctors\Controllers\ScheduleController::class, 'availability']);
    Route::post('/schedule/appointments', [\App\Modules\Doctors\Controllers\ScheduleController::class, 'store']);
});
