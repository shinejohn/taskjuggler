<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Processes\Controllers\ProcessController;
use App\Modules\Processes\Controllers\ProcessStepController;
use App\Modules\Processes\Controllers\ProcessExecutionController;
use App\Modules\Processes\Controllers\ProcessWebhookController;
use App\Http\Middleware\TeamContext;

// Inbound webhook trigger (public; webhook_id acts as the shared secret)
Route::post('/webhooks/processes/{webhookId}', ProcessWebhookController::class);

Route::middleware(['auth:sanctum', TeamContext::class])->group(function () {
    // Process Executions (literal routes MUST precede apiResource('processes'),
    // otherwise GET /processes/executions is captured by the {process} binding)
    Route::get('/processes/executions', [ProcessExecutionController::class, 'index']);
    Route::get('/processes/executions/{execution}', [ProcessExecutionController::class, 'show']);
    Route::get('/processes/{process}/executions', [ProcessExecutionController::class, 'index']);

    // Processes
    Route::apiResource('processes', ProcessController::class);
    Route::post('/processes/{process}/publish', [ProcessController::class, 'publish']);
    Route::post('/processes/{process}/execute', [ProcessController::class, 'execute']);

    // Process Steps
    Route::prefix('processes/{process}')->group(function () {
        Route::apiResource('steps', ProcessStepController::class);
    });
});



