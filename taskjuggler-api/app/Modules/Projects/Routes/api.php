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

    // Project Tasks + Timeline
    Route::get('/projects/{project}/tasks', [ProjectController::class, 'tasks']);
    Route::post('/projects/{project}/tasks', [ProjectController::class, 'addTask']);
    Route::get('/projects/{project}/timeline', [ProjectController::class, 'timeline']);

    // Project Milestones
    Route::prefix('projects/{project}')->group(function () {
        Route::get('/milestones', [\App\Modules\Projects\Controllers\ProjectMilestoneController::class, 'index']);
        Route::post('/milestones', [\App\Modules\Projects\Controllers\ProjectMilestoneController::class, 'store']);
        Route::put('/milestones/{milestone}', [\App\Modules\Projects\Controllers\ProjectMilestoneController::class, 'update']);
        Route::delete('/milestones/{milestone}', [\App\Modules\Projects\Controllers\ProjectMilestoneController::class, 'destroy']);
        Route::post('/milestones/{milestone}/complete', [\App\Modules\Projects\Controllers\ProjectMilestoneController::class, 'complete']);
    });
});



