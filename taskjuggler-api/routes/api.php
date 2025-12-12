<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
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

// Health check endpoint (for Railway)
Route::get('/health', function () {
    $status = 'healthy';
    $checks = [];
    $httpCode = 200;

    // Check Database
    try {
        DB::connection()->getPdo();
        DB::select('SELECT 1');
        $checks['database'] = 'connected';
    } catch (\Exception $e) {
        $checks['database'] = 'failed: ' . $e->getMessage();
        $status = 'unhealthy';
        $httpCode = 500;
    }

    // Check Redis
    try {
        $cacheKey = 'health_check_' . time();
        Cache::store('redis')->put($cacheKey, true, 10);
        Cache::store('redis')->forget($cacheKey);
        $checks['redis'] = 'connected';
    } catch (\Exception $e) {
        $checks['redis'] = 'failed: ' . $e->getMessage();
        // Redis failure is not fatal - app can still work
        $checks['redis_warning'] = 'degraded performance expected';
    }

    // Check Storage
    try {
        $storagePath = storage_path('framework/cache');
        if (is_writable($storagePath)) {
            $checks['storage'] = 'writable';
        } else {
            $checks['storage'] = 'not writable';
            $status = 'degraded';
        }
    } catch (\Exception $e) {
        $checks['storage'] = 'failed: ' . $e->getMessage();
    }

    // App info
    $info = [
        'app_name' => config('app.name'),
        'environment' => config('app.env'),
        'laravel_version' => app()->version(),
        'php_version' => PHP_VERSION,
    ];

    return response()->json([
        'status' => $status,
        'timestamp' => now()->toIso8601String(),
        'checks' => $checks,
        'info' => $info,
    ], $httpCode);
});

// Simple ping endpoint
Route::get('/ping', function () {
    return response()->json(['pong' => true, 'time' => now()->toIso8601String()]);
});

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/push-token', [AuthController::class, 'registerPushToken']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/{task}/complete', [TaskController::class, 'complete']);
    Route::post('/tasks/{task}/accept', [TaskController::class, 'accept']);
    Route::post('/tasks/{task}/decline', [TaskController::class, 'decline']);
    Route::post('/tasks/{task}/watch', [TaskController::class, 'watch']);
    Route::get('/tasks/{task}/timeline', [TaskController::class, 'timeline']);
    Route::put('/tasks/{task}/timeline', [TaskController::class, 'updateTimeline']);
    Route::post('/tasks/{task}/invite', [TaskController::class, 'createInvitation']);
    Route::post('/tasks/{task}/assign', [TaskController::class, 'assign']);
    Route::get('/tasks/{task}/export/ical', [TaskController::class, 'exportIcal']);
    Route::post('/tasks/export/ical', [TaskController::class, 'exportIcalMultiple']);
    Route::post('/tasks/export/csv', [TaskController::class, 'exportCsv']);
    Route::post('/tasks/export/pdf', [TaskController::class, 'exportPdf']);
    Route::get('/tasks/{task}/calendar/google', [TaskController::class, 'googleCalendarUrl']);
    Route::get('/tasks/{task}/calendar/outlook', [TaskController::class, 'outlookCalendarUrl']);
    Route::get('/tasks/{task}/tef', [TaskController::class, 'toTef']);
    Route::get('/tasks/{task}/export/tef', [TaskController::class, 'exportTef']);
    Route::post('/tasks/import/tef', [TaskController::class, 'importTef']);
    Route::get('/tasks/{task}/messages', [TaskController::class, 'messages']);
    Route::post('/tasks/{task}/messages', [TaskController::class, 'sendMessage']);
    Route::post('/tasks/{task}/messages/read', [TaskController::class, 'markMessagesRead']);
    Route::get('/tasks/{task}/messages/unread', [TaskController::class, 'unreadCount']);

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
});

// Public booking routes (no auth required)
Route::prefix('public/booking')->group(function () {
    Route::get('/{slug}', [PublicBookingController::class, 'getAppointmentType']);
    Route::get('/{slug}/slots', [PublicBookingController::class, 'getAvailableSlots']);
    Route::post('/{slug}/book', [PublicBookingController::class, 'bookAppointment']);
});

// Public task invitation routes (no auth required to view)
Route::get('/tasks/{taskId}/invite/{inviteCode}', [TaskController::class, 'getByInviteCode']);

// Public team invitation route (no auth required to view)
Route::get('/teams/invite/{inviteCode}', [TeamController::class, 'getInvitation']);

// Authenticated invitation actions
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/tasks/{taskId}/invite/{inviteCode}/accept', [TaskController::class, 'acceptInvitation']);
    Route::post('/tasks/{taskId}/invite/{inviteCode}/decline', [TaskController::class, 'declineInvitation']);
});
