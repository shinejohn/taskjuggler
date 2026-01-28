<?php

use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', function () {
    return response()->json(['message' => 'Official Notice API Module Active']);
});

// Protected routes will go here
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/areas', 'OfficialNoticeController@listAreas');
    Route::post('/areas', 'OfficialNoticeController@createArea');
    Route::get('/areas/{id}', 'OfficialNoticeController@getArea');
    Route::post('/areas/{id}/documents', 'OfficialNoticeController@uploadDocument');
    Route::get('/documents/{id}', 'OfficialNoticeController@getDocument');

    // Identity Verification (Protected)
    Route::post('/identity/start-verification', 'IdentityController@startVerification');
    Route::get('/identity/status', 'IdentityController@status');
    Route::post('/identity/refresh', 'IdentityController@refresh');

    // Signing Sessions
    Route::post('/documents/{document_id}/signing-session', 'SigningSessionController@create');
    Route::get('/signing-sessions/{session_id}', 'SigningSessionController@show');
    Route::get('/signing-sessions/{session_id}/my-status', 'SigningSessionController@myStatus');
    Route::post('/signing-sessions/{session_id}/request-verification', 'SigningSessionController@requestVerification');
    Route::post('/signing-sessions/{session_id}/accept-waiver', 'SigningSessionController@acceptWaiver');
    Route::post('/signing-sessions/{session_id}/sign', 'SigningSessionController@sign');
});

// Public / Webhooks
Route::post('/identity/verification-webhook', 'IdentityController@handleWebhook');
