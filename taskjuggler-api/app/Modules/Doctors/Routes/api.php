<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Doctors\Controllers\DashboardController;
use App\Modules\Doctors\Controllers\ScribeController;
use App\Modules\Doctors\Controllers\RcmController;
use App\Modules\Doctors\Controllers\PatientController;
use App\Modules\Doctors\Controllers\ScheduleController;
use App\Modules\Doctors\Controllers\DocConnectController;
use App\Modules\Doctors\Controllers\PatientPortalController;

Route::middleware(['auth:sanctum'])->prefix('doctors')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // =====================================================
    // Patient Portal
    // =====================================================
    Route::prefix('portal')->group(function () {
        Route::get('/dashboard', [PatientPortalController::class, 'index']);
        Route::post('/intake', [PatientPortalController::class, 'storeIntake']);
        Route::get('/consents', [PatientPortalController::class, 'getConsents']);
        Route::patch('/notifications/{id}/read', [PatientPortalController::class, 'markRead']);
        Route::post('/chat', [PatientPortalController::class, 'chat']);
        
        // New Features
        Route::get('/appointments', [PatientPortalController::class, 'getAppointments']);
        Route::get('/labs', [PatientPortalController::class, 'getLabs']);
        Route::get('/prior-auth', [PatientPortalController::class, 'getPriorAuths']);
        Route::get('/messages', [PatientPortalController::class, 'getMessages']);
        Route::post('/messages', [PatientPortalController::class, 'sendMessage']);
    });

    // =====================================================
    // DocConnect (Professional Network)
    // =====================================================
    Route::prefix('docconnect')->group(function () {
        Route::get('/feed', [DocConnectController::class, 'getFeed']);
        Route::post('/posts', [DocConnectController::class, 'createPost']);
        Route::post('/referrals', [DocConnectController::class, 'createReferral']);
        Route::get('/peers', [DocConnectController::class, 'getOnlinePeers']);
        Route::patch('/status', [DocConnectController::class, 'updateStatus']);
        Route::get('/directory/search', [DocConnectController::class, 'searchDirectory']);
    });

    // =====================================================
    // Legacy ScribeMD (Backwards Compatibility)
    // =====================================================
    Route::post('/scribe/start', [ScribeController::class, 'start']);
    Route::post('/scribe/{id}/generate', [ScribeController::class, 'generate']);
    Route::get('/visits/{id}/review', [ScribeController::class, 'review']);

    // =====================================================
    // ScribeMD Live Dashboard (New)
    // =====================================================
    Route::prefix('scribemd')->middleware(['patient.consent'])->group(function () {
        // Visits
        Route::get('/visits', [ScribeController::class, 'listVisits']);
        Route::post('/visits', [ScribeController::class, 'createVisit']);
        Route::get('/visits/{id}', [ScribeController::class, 'getVisit']);
        Route::post('/visits/{id}/stop', [ScribeController::class, 'stopVisitRecording']);
        Route::post('/visits/{id}/approve', [ScribeController::class, 'approveVisit']);

        // Dashboard Items
        Route::post('/visits/{id}/items', [ScribeController::class, 'addItem']);
        Route::patch('/visits/{visitId}/items/{itemId}', [ScribeController::class, 'updateItem']);
        Route::delete('/visits/{visitId}/items/{itemId}', [ScribeController::class, 'deleteItem']);
        Route::post('/visits/{visitId}/items/{itemId}/toggle', [ScribeController::class, 'toggleItem']);

        // Claim
        Route::get('/visits/{id}/claim', [ScribeController::class, 'getClaim']);
        Route::patch('/visits/{id}/claim', [ScribeController::class, 'updateClaim']);

        // Note
        Route::patch('/visits/{id}/note', [ScribeController::class, 'updateNote']);

        // Audio Transcription
        Route::post('/transcribe', [ScribeController::class, 'transcribe']);
    });

    // RCM (Claims)
    Route::post('/claims/generate', [RcmController::class, 'generate']);
    Route::post('/claims/{id}/submit', [RcmController::class, 'submit']);

    // Patients
    Route::post('/patients/lookup', [PatientController::class, 'lookupByCode']);
    Route::get('/patients/{id}', [PatientController::class, 'show'])->middleware('patient.consent');
    Route::post('/patients', [PatientController::class, 'store']);
    Route::get('/patients', [PatientController::class, 'index']);

    // Schedule
    Route::get('/schedule/availability', [ScheduleController::class, 'availability']);
    Route::post('/schedule/appointments', [ScheduleController::class, 'store']);
});

