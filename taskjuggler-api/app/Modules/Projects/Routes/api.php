<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Projects\Controllers\ProjectController;
use App\Http\Middleware\TeamContext;

Route::middleware(['auth:sanctum', TeamContext::class])->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::get('/projects/{project}/stats', [ProjectController::class, 'stats']);

    // Project Members (using TeamController pattern)
    // Note: Project member management can be added here or in a separate controller
});

