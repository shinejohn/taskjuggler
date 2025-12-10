<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\InboxController;
use App\Http\Controllers\Api\RoutingRuleController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ContactListController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\Marketplace\ListingController;
use App\Http\Controllers\Api\Marketplace\VendorController;

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
    Route::post('/tasks/{task}/assign', [TaskController::class, 'assign']);
    Route::get('/tasks/{task}/export/ical', [TaskController::class, 'exportIcal']);
    Route::post('/tasks/export/ical', [TaskController::class, 'exportIcalMultiple']);
    Route::post('/tasks/export/csv', [TaskController::class, 'exportCsv']);
    Route::post('/tasks/export/pdf', [TaskController::class, 'exportPdf']);
    Route::get('/tasks/{task}/calendar/google', [TaskController::class, 'googleCalendarUrl']);
    Route::get('/tasks/{task}/calendar/outlook', [TaskController::class, 'outlookCalendarUrl']);

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
});
