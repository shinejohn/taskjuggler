<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Urpa\Controllers\ActivityController;
use App\Modules\Urpa\Controllers\ContactController;
use App\Modules\Urpa\Controllers\AiController;
use App\Modules\Urpa\Controllers\VoiceController;
use App\Modules\Urpa\Controllers\PhoneController;
use App\Modules\Urpa\Controllers\IntegrationController;
use App\Modules\Urpa\Controllers\TaskJugglerController;
use App\Modules\Urpa\Controllers\FibonacciController;

/*
|--------------------------------------------------------------------------
| URPA API Routes
|--------------------------------------------------------------------------
|
| All routes require authentication via Sanctum
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    
    // Activities
    Route::prefix('activities')->group(function () {
        Route::get('/', [ActivityController::class, 'index']);
        Route::post('/', [ActivityController::class, 'store']);
        Route::post('/sync', [ActivityController::class, 'sync']);
        Route::get('/{id}', [ActivityController::class, 'show']);
        Route::put('/{id}', [ActivityController::class, 'update']);
        Route::patch('/{id}/read', [ActivityController::class, 'markAsRead']);
        Route::patch('/{id}/star', [ActivityController::class, 'toggleStar']);
        Route::delete('/{id}', [ActivityController::class, 'destroy']);
    });

    // Contacts
    Route::prefix('contacts')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::post('/', [ContactController::class, 'store']);
        Route::post('/import', [ContactController::class, 'import']);
        Route::get('/{id}', [ContactController::class, 'show']);
        Route::put('/{id}', [ContactController::class, 'update']);
        Route::delete('/{id}', [ContactController::class, 'destroy']);
    });

    // AI
    Route::prefix('ai')->group(function () {
        Route::get('/sessions', [AiController::class, 'sessions']);
        Route::post('/sessions', [AiController::class, 'createSession']);
        Route::get('/sessions/{id}/messages', [AiController::class, 'getMessages']);
        Route::post('/sessions/{id}/messages', [AiController::class, 'sendMessage']);
        Route::patch('/sessions/{id}/complete', [AiController::class, 'completeSession']);
        Route::get('/artifacts', [AiController::class, 'artifacts']);
        Route::post('/artifacts', [AiController::class, 'generateArtifact']);
        Route::get('/tasks', [AiController::class, 'tasks']);
    });

    // Voice
    Route::prefix('voice')->group(function () {
        Route::get('/prerecorded', [VoiceController::class, 'getPrerecordedResponses']);
        Route::post('/find-response', [VoiceController::class, 'findResponse']);
        Route::post('/prerecorded/bulk', [VoiceController::class, 'bulkCreateResponses']);
        Route::post('/prerecorded/{id}/used', [VoiceController::class, 'logUsage']);
    });

    // Vapi webhook (no auth required for webhooks)
    Route::post('/voice/vapi/webhook', [VoiceController::class, 'vapiWebhook']);

    // Vapi API endpoints
    Route::prefix('voice/vapi')->group(function () {
        Route::post('/call', [\App\Modules\Urpa\Controllers\VapiController::class, 'startCall']);
        Route::post('/call/{callId}/end', [\App\Modules\Urpa\Controllers\VapiController::class, 'endCall']);
        Route::get('/call/{callId}', [\App\Modules\Urpa\Controllers\VapiController::class, 'getCallStatus']);
    });

    // Phone
    Route::prefix('phone')->group(function () {
        Route::get('/calls', [PhoneController::class, 'index']);
        Route::post('/calls', [PhoneController::class, 'store']);
        Route::get('/calls/{id}', [PhoneController::class, 'show']);
        Route::put('/calls/{id}', [PhoneController::class, 'update']);
        Route::patch('/calls/{id}/complete', [PhoneController::class, 'complete']);
    });

    // Integrations
    Route::prefix('integrations')->group(function () {
        Route::get('/', [IntegrationController::class, 'index']);
        Route::post('/', [IntegrationController::class, 'store']);
        Route::get('/{id}', [IntegrationController::class, 'show']);
        Route::put('/{id}', [IntegrationController::class, 'update']);
        Route::delete('/{id}', [IntegrationController::class, 'destroy']);
        Route::post('/{id}/sync', [IntegrationController::class, 'sync']);
        Route::get('/{id}/sync-status', [IntegrationController::class, 'syncStatus']);
        
        // OAuth flows
        Route::get('/oauth/{provider}/redirect', [IntegrationController::class, 'oauthRedirect']);
        Route::get('/oauth/{provider}/callback', [IntegrationController::class, 'oauthCallback']);

        // TaskJuggler
        Route::prefix('taskjuggler')->group(function () {
            Route::get('/status', [TaskJugglerController::class, 'status']);
            Route::post('/link', [TaskJugglerController::class, 'link']);
            Route::post('/sync', [TaskJugglerController::class, 'sync']);
            Route::get('/tasks', [TaskJugglerController::class, 'tasks']);
            Route::post('/tasks', [TaskJugglerController::class, 'createTask']);
        });

        // Fibonacci
        Route::prefix('fibonacci')->group(function () {
            Route::get('/status', [FibonacciController::class, 'status']);
            
            // CRM
            Route::prefix('crm')->group(function () {
                Route::post('/link', [FibonacciController::class, 'linkCrm']);
                Route::get('/business/{businessId}', [FibonacciController::class, 'getBusinessProfile']);
                Route::get('/business/{businessId}/faqs', [FibonacciController::class, 'getFAQs']);
                Route::post('/business/{businessId}/sync-faqs', [FibonacciController::class, 'syncFAQs']);
                Route::get('/business/{businessId}/polls', [FibonacciController::class, 'getPolls']);
            });

            // Publishing
            Route::prefix('publishing')->group(function () {
                Route::post('/link', [FibonacciController::class, 'linkPublishing']);
                Route::get('/team/{teamId}', [FibonacciController::class, 'getPublishingTeam']);
                Route::get('/teams/{teamId}/projects', [FibonacciController::class, 'getProjects']);
                Route::post('/teams/{teamId}/projects', [FibonacciController::class, 'createContentRequest']);
            });
        });
    });
});

