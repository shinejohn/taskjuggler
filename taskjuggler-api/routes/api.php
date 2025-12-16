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

// Note: Auth routes are now in app/Modules/Core/Routes/api.php
// Note: Task routes are now in app/Modules/Tasks/Routes/api.php

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
