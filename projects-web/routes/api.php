<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\ProblemController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TEFController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\ProcessController;
use App\Http\Controllers\Api\ProcessStepController;
use App\Http\Controllers\Api\ProcessExecutionController;
use App\Http\Controllers\Api\InboxController;
use App\Http\Controllers\Api\RoutingRuleController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\ContactListController;
use App\Http\Controllers\Api\DirectMessageController;
use App\Http\Controllers\Api\Marketplace\ListingController as MarketplaceListingController;
use App\Http\Controllers\Api\Marketplace\VendorController as MarketplaceVendorController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AppointmentTypeController;
use App\Http\Controllers\Api\AvailabilitySlotController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', function () {
    try {
        // Check database connection
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        
        // Check Redis if available
        $cacheStatus = 'unknown';
        try {
            \Illuminate\Support\Facades\Cache::store('redis')->put('health_check', true, 10);
            $cacheStatus = 'connected';
        } catch (\Exception $e) {
            $cacheStatus = 'disconnected';
        }
        
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'services' => [
                'database' => 'connected',
                'cache' => $cacheStatus,
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'error' => $e->getMessage(),
            'timestamp' => now()->toIso8601String(),
        ], 500);
    }
});

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/activity', [DashboardController::class, 'activity']);
    
    // My Tasks (cross-project)
    Route::get('/my/tasks', [TaskController::class, 'myTasks']);
    Route::get('/my/requests', [TaskController::class, 'myRequests']);

    // Standalone Tasks (not tied to a project)
    Route::get('/tasks/standalone', [TaskController::class, 'indexStandalone']);
    Route::post('/tasks/standalone', [TaskController::class, 'storeStandalone']);
    Route::get('/tasks/standalone/{task}', [TaskController::class, 'showStandalone']);
    Route::put('/tasks/standalone/{task}', [TaskController::class, 'updateStandalone']);
    Route::delete('/tasks/standalone/{task}', [TaskController::class, 'destroyStandalone']);

    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::get('/projects/{project}/stats', [ProjectController::class, 'stats']);
    
    // Project Members
    Route::get('/projects/{project}/members', [TeamController::class, 'index']);
    Route::post('/projects/{project}/members', [TeamController::class, 'store']);
    Route::put('/projects/{project}/members/{member}', [TeamController::class, 'update']);
    Route::delete('/projects/{project}/members/{member}', [TeamController::class, 'destroy']);

    // Tasks (nested under projects)
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('tasks', TaskController::class);
        
        // Task state transitions
        Route::post('/tasks/{task}/accept', [TaskController::class, 'accept']);
        Route::post('/tasks/{task}/decline', [TaskController::class, 'decline']);
        Route::post('/tasks/{task}/start', [TaskController::class, 'start']);
        Route::post('/tasks/{task}/complete', [TaskController::class, 'complete']);
        Route::post('/tasks/{task}/cancel', [TaskController::class, 'cancel']);
        
        // Task messages
        Route::get('/tasks/{task}/messages', [TaskController::class, 'messages']);
        Route::post('/tasks/{task}/messages', [TaskController::class, 'addMessage']);
        
        // Task TEF export
        Route::get('/tasks/{task}/tef', [TEFController::class, 'exportTask']);
    });
    
    // Questions
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('questions', QuestionController::class);
        Route::post('/questions/{question}/vote', [QuestionController::class, 'vote']);
        Route::post('/questions/{question}/convert', [QuestionController::class, 'convertToTask']);
        
        // Answers
        Route::post('/questions/{question}/answers', [QuestionController::class, 'addAnswer']);
        Route::post('/questions/{question}/answers/{answer}/accept', [QuestionController::class, 'acceptAnswer']);
        Route::post('/answers/{answer}/vote', [QuestionController::class, 'voteAnswer']);
    });
    
    // Problems
    Route::prefix('projects/{project}')->group(function () {
        Route::apiResource('problems', ProblemController::class);
        Route::post('/problems/{problem}/resolve', [ProblemController::class, 'resolve']);
    });
    
    // TEF Import/Export
    Route::get('/projects/{project}/tef', [TEFController::class, 'exportProject']);
    Route::post('/projects/{project}/tef/import', [TEFController::class, 'importTasks']);

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

    // Inbox
    Route::get('/inbox', [InboxController::class, 'index']);
    Route::get('/inbox/{inboxItem}', [InboxController::class, 'show']);
    Route::post('/inbox/{inboxItem}/process', [InboxController::class, 'process']);
    Route::post('/inbox/{inboxItem}/dismiss', [InboxController::class, 'dismiss']);
    Route::post('/inbox/{inboxItem}/create-task', [InboxController::class, 'createTask']);

    // Routing Rules
    Route::apiResource('routing-rules', RoutingRuleController::class);
    Route::post('/routing-rules/reorder', [RoutingRuleController::class, 'reorder']);
    Route::post('/routing-rules/test', [RoutingRuleController::class, 'test']);

    // Teams (standalone, not project members)
    Route::apiResource('teams', TeamController::class);
    Route::get('/teams/{team}/members', [TeamController::class, 'members']);
    Route::post('/teams/{team}/invite', [TeamController::class, 'invite']);
    Route::delete('/teams/{team}/members/{user}', [TeamController::class, 'removeMember']);
    Route::post('/teams/{team}/leave', [TeamController::class, 'leave']);
    Route::get('/teams/{team}/tasks', [TeamController::class, 'tasks']);
    Route::post('/teams/join/{inviteCode}', [TeamController::class, 'acceptInvitation']);

    // Contact Lists
    Route::apiResource('contact-lists', ContactListController::class);
    Route::post('/contact-lists/{contactList}/members', [ContactListController::class, 'addMember']);
    Route::delete('/contact-lists/{contactList}/members/{member}', [ContactListController::class, 'removeMember']);

    // Channels
    Route::get('/channels', [ChannelController::class, 'index']);
    Route::post('/channels/phone', [ChannelController::class, 'provisionPhone']);
    Route::post('/channels/email', [ChannelController::class, 'createEmail']);
    Route::put('/channels/{channel}', [ChannelController::class, 'update']);
    Route::delete('/channels/{channel}', [ChannelController::class, 'destroy']);

    // Marketplace
    Route::prefix('marketplace')->group(function () {
        Route::get('/listings', [MarketplaceListingController::class, 'index']);
        Route::post('/listings', [MarketplaceListingController::class, 'store']);
        Route::get('/listings/{listing}', [MarketplaceListingController::class, 'show']);
        Route::post('/listings/{listing}/bid', [MarketplaceListingController::class, 'bid']);
        Route::post('/listings/{listing}/assign', [MarketplaceListingController::class, 'assign']);

        Route::get('/vendors', [MarketplaceVendorController::class, 'index']);
        Route::get('/vendors/{vendor}', [MarketplaceVendorController::class, 'show']);
        Route::post('/vendors', [MarketplaceVendorController::class, 'store']);
        Route::put('/vendors/{vendor}', [MarketplaceVendorController::class, 'update']);
    });

    // Appointments
    Route::apiResource('appointment-types', AppointmentTypeController::class);
    Route::apiResource('availability-slots', AvailabilitySlotController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);

    // Direct Messages
    Route::prefix('messages')->group(function () {
        Route::get('/conversations', [DirectMessageController::class, 'conversations']);
        Route::get('/unread', [DirectMessageController::class, 'unreadCount']);
        Route::get('/with/{user}', [DirectMessageController::class, 'messages']);
        Route::post('/to/{user}', [DirectMessageController::class, 'send']);
    });
});

// Webhooks (no auth - signature verification instead)
Route::prefix('webhooks')->group(function () {
    Route::post('/email', [WebhookController::class, 'email']);
    Route::post('/sms', [WebhookController::class, 'sms']);
    Route::post('/voice', [WebhookController::class, 'voice']);
    Route::post('/slack', [WebhookController::class, 'slack']);
});


