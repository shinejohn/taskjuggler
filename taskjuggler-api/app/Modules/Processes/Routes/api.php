<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Processes\Controllers\ProcessController;
use App\Modules\Processes\Controllers\ProcessStepController;
use App\Modules\Processes\Controllers\ProcessExecutionController;
use App\Http\Middleware\TeamContext;

Route::middleware(['auth:sanctum', TeamContext::class])->group(function () {
    // Processes
    Route::apiResource('processes', ProcessController::class);
    Route::post('/processes/{process}/publish', [ProcessController::class, 'publish']);
    Route::post('/processes/{process}/execute', [ProcessController::class, 'execute']);

    // Process Steps
    Route::prefix('processes/{process}')->group(function () {
        Route::apiResource('steps', ProcessStepController::class);
    });

    // Process Executions
    Route::get('/processes/{process}/executions', [ProcessExecutionController::class, 'index']);
    Route::get('/processes/executions', [ProcessExecutionController::class, 'index']);
    Route::get('/processes/executions/{execution}', [ProcessExecutionController::class, 'show']);
});



