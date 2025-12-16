<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Tasks\Controllers\TaskController;

Route::middleware(['auth:sanctum', 'module:tasks'])->group(function () {
    // Tasks CRUD
    Route::apiResource('tasks', TaskController::class);
    
    // Task status actions
    Route::post('/tasks/{task}/complete', [TaskController::class, 'complete']);
    Route::post('/tasks/{task}/accept', [TaskController::class, 'accept']);
    Route::post('/tasks/{task}/decline', [TaskController::class, 'decline']);
    Route::post('/tasks/{task}/watch', [TaskController::class, 'watch']);
    
    // Task timeline
    Route::get('/tasks/{task}/timeline', [TaskController::class, 'timeline']);
    Route::put('/tasks/{task}/timeline', [TaskController::class, 'updateTimeline']);
    
    // Task invitations
    Route::post('/tasks/{task}/invite', [TaskController::class, 'createInvitation']);
    Route::get('/tasks/{task}/invite/{inviteCode}', [TaskController::class, 'getByInviteCode']);
    Route::post('/tasks/{task}/invite/{inviteCode}/accept', [TaskController::class, 'acceptInvitation']);
    Route::post('/tasks/{task}/invite/{inviteCode}/decline', [TaskController::class, 'declineInvitation']);
    
    // Task assignment
    Route::post('/tasks/{task}/assign', [TaskController::class, 'assign']);
    
    // Task export
    Route::get('/tasks/{task}/export/ical', [TaskController::class, 'exportIcal']);
    Route::post('/tasks/export/ical', [TaskController::class, 'exportIcalMultiple']);
    Route::post('/tasks/export/csv', [TaskController::class, 'exportCsv']);
    Route::post('/tasks/export/pdf', [TaskController::class, 'exportPdf']);
    Route::get('/tasks/{task}/calendar/google', [TaskController::class, 'googleCalendarUrl']);
    Route::get('/tasks/{task}/calendar/outlook', [TaskController::class, 'outlookCalendarUrl']);
    
    // Task Exchange Format (TEF)
    Route::get('/tasks/{task}/tef', [TaskController::class, 'toTef']);
    Route::get('/tasks/{task}/export/tef', [TaskController::class, 'exportTef']);
    Route::post('/tasks/import/tef', [TaskController::class, 'importTef']);
    
    // Task messages
    Route::get('/tasks/{task}/messages', [TaskController::class, 'messages']);
    Route::post('/tasks/{task}/messages', [TaskController::class, 'sendMessage']);
    Route::post('/tasks/{task}/messages/read', [TaskController::class, 'markMessagesRead']);
    Route::get('/tasks/{task}/messages/unread', [TaskController::class, 'unreadCount']);
});

