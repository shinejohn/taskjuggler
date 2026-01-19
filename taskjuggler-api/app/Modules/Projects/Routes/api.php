<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Projects\Controllers\ProjectController;
use App\Http\Middleware\TeamContext;

Route::middleware(['auth:sanctum', TeamContext::class])->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::get('/projects/{project}/stats', [ProjectController::class, 'stats']);

    // Project Members
    Route::prefix('projects/{project}')->group(function () {
        Route::get('/members', [\App\Modules\Projects\Controllers\ProjectMemberController::class, 'index']);
        Route::post('/members', [\App\Modules\Projects\Controllers\ProjectMemberController::class, 'store']);
        Route::put('/members/{member}', [\App\Modules\Projects\Controllers\ProjectMemberController::class, 'update']);
        Route::delete('/members/{member}', [\App\Modules\Projects\Controllers\ProjectMemberController::class, 'destroy']);
    });
});



