<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InboxController;
use App\Http\Controllers\Api\RoutingRuleController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ContactListController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\Marketplace\ListingController;
use App\Http\Controllers\Api\Marketplace\VendorController;
use App\Http\Controllers\Api\AppointmentTypeController;
use App\Http\Controllers\Api\AvailabilitySlotController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\PublicBookingController;
use App\Http\Controllers\Api\DirectMessageController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TEF\ActorController;
use App\Http\Controllers\Api\TEF\RelationshipController;
use App\Http\Controllers\Api\TEF\MessageController;
use App\Http\Controllers\Api\TEF\ConversationController;
use App\Http\Controllers\Api\IoT\DeviceController;
use App\Http\Controllers\Api\AI\AgentController;
use App\Modules\SiteHealth\Http\Controllers\SiteController;
use App\Modules\SiteHealth\Http\Controllers\ScanController;
use App\Modules\SiteHealth\Http\Controllers\IssueController;
use App\Modules\SiteHealth\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\McpController;

// Note: Auth routes are now in app/Modules/Core/Routes/api.php
// Note: Task routes are now in app/Modules/Tasks/Routes/api.php

// Load Core module routes (auth, profiles)
require base_path('app/Modules/Core/Routes/api.php');

// Load Tasks module routes
require base_path('app/Modules/Tasks/Routes/api.php');

// Load Coordinator routes
if (file_exists(base_path('routes/coordinator.php'))) {
    require base_path('routes/coordinator.php');
}

// Load URPA module routes
Route::prefix('urpa')->group(function () {
    require base_path('app/Modules/Urpa/Routes/api.php');
});

Route::middleware('auth:sanctum')->group(function () {

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

    // Team
    Route::apiResource('team', TeamController::class);

    // Contact Lists
    Route::apiResource('contact-lists', ContactListController::class);
    Route::post('/contact-lists/{contactList}/members', [ContactListController::class, 'addMember']);
    Route::delete('/contact-lists/{contactList}/members/{member}', [ContactListController::class, 'removeMember']);
    Route::post('/contact-lists/import', [ContactListController::class, 'importContacts']);

    // Channels
    Route::get('/channels', [ChannelController::class, 'index']);
    Route::post('/channels/phone', [ChannelController::class, 'provisionPhone']);
    Route::post('/channels/email', [ChannelController::class, 'createEmail']);
    Route::put('/channels/{channel}', [ChannelController::class, 'update']);
    Route::delete('/channels/{channel}', [ChannelController::class, 'destroy']);

    // Marketplace
    Route::prefix('marketplace')->group(function () {
        Route::get('/listings', [ListingController::class, 'index']);
        Route::post('/listings', [ListingController::class, 'store']);
        Route::get('/listings/{listing}', [ListingController::class, 'show']);
        Route::post('/listings/{listing}/bid', [ListingController::class, 'bid']);
        Route::post('/listings/{listing}/assign', [ListingController::class, 'assign']);

        Route::get('/vendors', [VendorController::class, 'index']);
        Route::get('/vendors/{vendor}', [VendorController::class, 'show']);
        Route::post('/vendors', [VendorController::class, 'store']);
        Route::put('/vendors/{vendor}', [VendorController::class, 'update']);
    });

    // Vendor Dashboard (for vendors)
    Route::prefix('vendor')->group(function () {
        Route::get('/dashboard', [VendorController::class, 'dashboard']);
        Route::get('/jobs', [VendorController::class, 'jobs']);
        Route::get('/earnings', [VendorController::class, 'earnings']);
    });

    // Appointments
    Route::apiResource('appointment-types', AppointmentTypeController::class);
    Route::apiResource('availability-slots', AvailabilitySlotController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);

    // Teams
    Route::get('/teams', [TeamController::class, 'index']);
    Route::post('/teams', [TeamController::class, 'store']);
    Route::get('/teams/{team}', [TeamController::class, 'show']);
    Route::put('/teams/{team}', [TeamController::class, 'update']);
    Route::delete('/teams/{team}', [TeamController::class, 'destroy']);
    Route::get('/teams/{team}/members', [TeamController::class, 'members']);
    Route::post('/teams/{team}/invite', [TeamController::class, 'invite']);
    Route::delete('/teams/{team}/members/{user}', [TeamController::class, 'removeMember']);
    Route::post('/teams/{team}/leave', [TeamController::class, 'leave']);
    Route::get('/teams/{team}/tasks', [TeamController::class, 'tasks']);
    Route::post('/teams/join/{inviteCode}', [TeamController::class, 'acceptInvitation']);

    // Direct messages
    Route::prefix('messages')->group(function () {
        Route::get('/conversations', [DirectMessageController::class, 'conversations']);
        Route::get('/unread', [DirectMessageController::class, 'unreadCount']);
        Route::get('/with/{user}', [DirectMessageController::class, 'messages']);
        Route::post('/to/{user}', [DirectMessageController::class, 'send']);
    });

    // TEF 2.0.0 API endpoints
    Route::prefix('tef/v1')->group(function () {
        // Actors
        Route::post('/actors', [ActorController::class, 'register']);
        Route::post('/actors/claim', [ActorController::class, 'claim']);
        Route::get('/actors/{id}', [ActorController::class, 'show']);
        Route::put('/actors/{id}', [ActorController::class, 'update']);
        Route::delete('/actors/{id}', [ActorController::class, 'destroy']);
        Route::get('/actors/{id}/capabilities', [ActorController::class, 'capabilities']);
        Route::post('/actors/{id}/authenticate', [ActorController::class, 'authenticate']);

        // Relationships
        Route::post('/relationships', [RelationshipController::class, 'store']);
        Route::get('/relationships', [RelationshipController::class, 'index']);
        Route::get('/relationships/{id}', [RelationshipController::class, 'show']);
        Route::put('/relationships/{id}', [RelationshipController::class, 'update']);
        Route::delete('/relationships/{id}', [RelationshipController::class, 'destroy']);
        Route::get('/relationships/{id}/history', [RelationshipController::class, 'history']);
        
        // Trust Scores
        Route::get('/relationships/{id}/trust-score', [\App\Http\Controllers\Api\TEF\TrustScoreController::class, 'show']);
        Route::put('/relationships/{id}/trust-score', [\App\Http\Controllers\Api\TEF\TrustScoreController::class, 'update']);
        Route::post('/relationships/{id}/trust-score/recalculate', [\App\Http\Controllers\Api\TEF\TrustScoreController::class, 'recalculate']);

        // Messages
        Route::post('/messages', [MessageController::class, 'store']);
        Route::get('/messages', [MessageController::class, 'index']);
        Route::get('/messages/{id}', [MessageController::class, 'show']);
        Route::post('/messages/{id}/read', [MessageController::class, 'markRead']);

        // Conversations
        Route::get('/conversations/{id}', [ConversationController::class, 'show']);
        Route::get('/conversations/task/{taskId}', [ConversationController::class, 'byTask']);
    });

    // IoT Device endpoints
    Route::prefix('iot/devices')->group(function () {
        Route::post('/register', [DeviceController::class, 'register']);
        Route::post('/claim', [DeviceController::class, 'claim']);
        Route::get('/', [DeviceController::class, 'index']);
        Route::get('/{id}', [DeviceController::class, 'show']);
        Route::put('/{id}/capabilities', [DeviceController::class, 'updateCapabilities']);
        Route::post('/{id}/claim-code', [DeviceController::class, 'generateClaimCode']);
        Route::post('/{id}/send-task', [DeviceController::class, 'sendTask']);
        Route::delete('/{id}', [DeviceController::class, 'destroy']);
    });

    // AI Agent endpoints
    Route::prefix('ai/agents')->group(function () {
        Route::post('/register', [AgentController::class, 'register']);
        Route::post('/claim', [AgentController::class, 'claim']);
        Route::get('/', [AgentController::class, 'index']);
        Route::get('/{id}', [AgentController::class, 'show']);
        Route::put('/{id}/capabilities', [AgentController::class, 'updateCapabilities']);
        Route::post('/{id}/claim-code', [AgentController::class, 'generateClaimCode']);
        Route::post('/{id}/delegate-task', [AgentController::class, 'delegateTask']);
        Route::delete('/{id}', [AgentController::class, 'destroy']);
    });

    // Performance endpoints
    Route::prefix('performance')->group(function () {
        Route::get('/cache/stats', [\App\Http\Controllers\Api\Performance\CacheController::class, 'stats']);
        Route::post('/cache/warm-up', [\App\Http\Controllers\Api\Performance\CacheController::class, 'warmUp']);
        Route::delete('/cache/user', [\App\Http\Controllers\Api\Performance\CacheController::class, 'clearUserCache']);
    });

    // Test Results endpoints (admin only in production)
    Route::prefix('test-results')->group(function () {
        Route::post('/run', [\App\Http\Controllers\TestResultsController::class, 'runTests']);
        Route::get('/latest', [\App\Http\Controllers\TestResultsController::class, 'getLatestResults']);
        Route::get('/all', [\App\Http\Controllers\TestResultsController::class, 'getAllResults']);
        Route::get('/{filename}', [\App\Http\Controllers\TestResultsController::class, 'getResult']);
    });

    // Test Fix endpoints
    Route::prefix('test-fix')->group(function () {
        Route::post('/analyze', [\App\Http\Controllers\TestFixController::class, 'analyze']);
        Route::post('/apply', [\App\Http\Controllers\TestFixController::class, 'applyFixes']);
    });

    // SiteHealth Scanner endpoints
    Route::prefix('scanner')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // Sites
        Route::apiResource('sites', SiteController::class);
        Route::post('/sites/{site}/scan', [ScanController::class, 'store']);
        Route::get('/sites/{site}/scans', [ScanController::class, 'index']);
        
        // Scans
        Route::get('/scans/{scan}', [ScanController::class, 'show']);
        Route::get('/scans/{scan}/report', [ScanController::class, 'report']);
        
        // Issues
        Route::get('/issues', [IssueController::class, 'index']);
        Route::get('/issues/{issue}', [IssueController::class, 'show']);
        Route::put('/issues/{issue}', [IssueController::class, 'update']);
        Route::post('/issues/{issue}/fix', [IssueController::class, 'generateFix']);
        Route::post('/issues/bulk', [IssueController::class, 'bulkUpdate']);
    });
});

// MCP (Model Context Protocol) routes
Route::prefix('mcp')->group(function () {
    // Public registration/login
    Route::post('/register', [McpController::class, 'register']);
    Route::post('/login', [McpController::class, 'login']);
    
    // API key validation (for MCP server)
    Route::post('/validate-key', [McpController::class, 'validateKey']);
    Route::post('/get-token', [McpController::class, 'getToken']);
    
    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/api-key', [McpController::class, 'getApiKey']);
        Route::post('/api-key/regenerate', [McpController::class, 'regenerateApiKey']);
    });
});

// Public booking routes (no auth required)
Route::prefix('public/booking')->group(function () {
    Route::get('/{slug}', [PublicBookingController::class, 'getAppointmentType']);
    Route::get('/{slug}/slots', [PublicBookingController::class, 'getAvailableSlots']);
    Route::post('/{slug}/book', [PublicBookingController::class, 'bookAppointment']);
});

// Public team invitation route (no auth required to view)
// Note: Task invitation routes are now in app/Modules/Tasks/Routes/api.php
Route::get('/teams/invite/{inviteCode}', [TeamController::class, 'getInvitation']);
