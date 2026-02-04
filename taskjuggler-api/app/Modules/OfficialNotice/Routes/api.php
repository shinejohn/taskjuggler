<?php

use Illuminate\Support\Facades\Route;
use App\Modules\OfficialNotice\Controllers\OfficialNoticeController;
use App\Modules\OfficialNotice\Controllers\IdentityController;
use App\Modules\OfficialNotice\Controllers\SigningSessionController;
use App\Modules\OfficialNotice\Controllers\MilestoneController;

// Public routes
Route::get('/', function () {
    return response()->json(['message' => 'Official Notice API Module Active']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/areas', [OfficialNoticeController::class, 'listAreas']);
    Route::post('/areas', [OfficialNoticeController::class, 'createArea']);
    Route::get('/areas/{id}', [OfficialNoticeController::class, 'getArea']);
    Route::post('/areas/{id}/documents', [OfficialNoticeController::class, 'uploadDocument']);
    Route::get('/documents/{id}', [OfficialNoticeController::class, 'getDocument']);
    Route::get('/documents/{id}/file', [OfficialNoticeController::class, 'viewDocumentFile']);

    // Identity Verification (Protected)
    Route::post('/identity/start-verification', [IdentityController::class, 'startVerification']);
    Route::get('/identity/status', [IdentityController::class, 'status']);
    Route::post('/identity/refresh', [IdentityController::class, 'refresh']);

    // Signing Sessions
    Route::post('/documents/{document_id}/signing-session', [SigningSessionController::class, 'create']);
    Route::get('/signing-sessions/{session_id}', [SigningSessionController::class, 'show']);
    Route::get('/signing-sessions/{session_id}/my-status', [SigningSessionController::class, 'myStatus']);
    Route::post('/signing-sessions/{session_id}/request-verification', [SigningSessionController::class, 'requestVerification']);
    Route::post('/signing-sessions/{session_id}/verify-face', [SigningSessionController::class, 'verifyFace']);
    Route::post('/signing-sessions/{session_id}/accept-waiver', [SigningSessionController::class, 'acceptWaiver']);
    Route::post('/signing-sessions/{session_id}/sign', [SigningSessionController::class, 'sign']);
    
    // Milestones
    Route::apiResource('milestones', MilestoneController::class);
});

// Public / Webhooks
Route::post('/identity/verification-webhook', [IdentityController::class, 'handleWebhook']);
