<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Coordinator\Controllers\AiAgentAuthController;
use App\Modules\Coordinator\Controllers\ContextPacketController;
use App\Modules\Coordinator\Controllers\OrganizationController;
use App\Modules\Coordinator\Controllers\CoordinatorController;
use App\Modules\Coordinator\Controllers\AiInteractionController;
use App\Modules\Coordinator\Controllers\DashboardController;
use App\Modules\Coordinator\Controllers\ContactController;
use App\Modules\Coordinator\Controllers\CallLogController;
use App\Modules\Coordinator\Controllers\AppointmentController;

/*
|--------------------------------------------------------------------------
| Coordinator API Routes
|--------------------------------------------------------------------------
|
| Routes for Coordinator - AI Virtual Assistants
|
*/

// Internal AI Agent Routes (Protocol Part 1 & 2)
Route::prefix('internal/ai')->group(function () {
    // Authentication (Part 1)
    Route::post('/auth', [AiAgentAuthController::class, 'authenticate']);
    Route::post('/auth/refresh', [AiAgentAuthController::class, 'refresh']);
    
    // Context Packets (Part 2)
    Route::get('/context/{business_id}', [ContextPacketController::class, 'getContext']);
    Route::get('/context/{business_id}/refresh', [ContextPacketController::class, 'refreshContext']);
    
    // Real-Time Operations (Part 3)
    Route::get('/calendar/{business_id}/availability', [\App\Modules\Coordinator\Controllers\RealTimeOperationsController::class, 'getAvailability']);
    Route::get('/crm/{business_id}/customers/lookup', [\App\Modules\Coordinator\Controllers\RealTimeOperationsController::class, 'lookupCustomer']);
    Route::post('/calendar/{business_id}/bookings', [\App\Modules\Coordinator\Controllers\RealTimeOperationsController::class, 'createBooking']);
    Route::post('/crm/{business_id}/leads', [\App\Modules\Coordinator\Controllers\RealTimeOperationsController::class, 'createLead']);
    
    // Interactions (Part 3 & 4)
    Route::post('/interactions/{business_id}', [AiInteractionController::class, 'logInteraction']);
    Route::post('/interactions/{interaction_id}/feedback', [AiInteractionController::class, 'logFeedback']);
});

// Onboarding Routes (public, but requires auth)
Route::prefix('coordinator/onboarding')->middleware('auth:sanctum')->group(function () {
    Route::get('/role-templates', [\App\Modules\Coordinator\Controllers\OnboardingController::class, 'getRoleTemplates']);
    Route::get('/persona-templates', [\App\Modules\Coordinator\Controllers\OnboardingController::class, 'getPersonaTemplates']);
    Route::post('/complete', [\App\Modules\Coordinator\Controllers\OnboardingController::class, 'complete']);
});

// Public Coordinator Routes (for frontend)
Route::prefix('coordinator')->middleware('auth:sanctum')->group(function () {
    // Organizations
    Route::apiResource('organizations', OrganizationController::class);
    
    // Coordinators
    Route::get('/organizations/{orgId}/coordinators', [CoordinatorController::class, 'index']);
    Route::post('/organizations/{orgId}/coordinators', [CoordinatorController::class, 'store']);
    Route::apiResource('coordinators', CoordinatorController::class)->except(['index', 'store']);

    // Dashboard
    Route::prefix('organizations/{orgId}/dashboard')->group(function () {
        Route::get('/metrics', [DashboardController::class, 'getMetrics']);
        Route::get('/recent-calls', [DashboardController::class, 'getRecentCalls']);
        Route::get('/today-appointments', [DashboardController::class, 'getTodayAppointments']);
    });

    // Contacts
    Route::prefix('organizations/{orgId}/contacts')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::post('/', [ContactController::class, 'store']);
        Route::get('/{id}', [ContactController::class, 'show']);
        Route::put('/{id}', [ContactController::class, 'update']);
        Route::delete('/{id}', [ContactController::class, 'destroy']);
        Route::post('/bulk-delete', [ContactController::class, 'bulkDelete']);
        Route::post('/bulk-tag', [ContactController::class, 'bulkTag']);
    });

    // Calls
    Route::prefix('organizations/{orgId}/calls')->group(function () {
        Route::get('/', [CallLogController::class, 'index']);
        Route::get('/stats', [CallLogController::class, 'getStats']);
        Route::get('/{id}', [CallLogController::class, 'show']);
    });

    // Appointments
    Route::prefix('organizations/{orgId}/appointments')->group(function () {
        Route::get('/', [AppointmentController::class, 'index']);
        Route::get('/today', [AppointmentController::class, 'getToday']);
        Route::post('/', [AppointmentController::class, 'store']);
        Route::get('/{id}', [AppointmentController::class, 'show']);
        Route::put('/{id}', [AppointmentController::class, 'update']);
        Route::delete('/{id}', [AppointmentController::class, 'destroy']);
        Route::post('/{id}/cancel', [AppointmentController::class, 'cancel']);
    });

    // Campaigns
    Route::prefix('organizations/{orgId}/campaigns')->group(function () {
        Route::get('/', [\App\Modules\Coordinator\Controllers\CampaignController::class, 'index']);
        Route::post('/', [\App\Modules\Coordinator\Controllers\CampaignController::class, 'store']);
        Route::get('/{id}', [\App\Modules\Coordinator\Controllers\CampaignController::class, 'show']);
        Route::put('/{id}', [\App\Modules\Coordinator\Controllers\CampaignController::class, 'update']);
        Route::delete('/{id}', [\App\Modules\Coordinator\Controllers\CampaignController::class, 'destroy']);
        Route::post('/{id}/start', [\App\Modules\Coordinator\Controllers\CampaignController::class, 'start']);
        Route::post('/{id}/pause', [\App\Modules\Coordinator\Controllers\CampaignController::class, 'pause']);
        Route::get('/{id}/stats', [\App\Modules\Coordinator\Controllers\CampaignController::class, 'getStats']);
    });

    // Billing
    Route::prefix('organizations/{orgId}/billing')->group(function () {
        Route::get('/', [\App\Modules\Coordinator\Controllers\BillingController::class, 'index']);
        Route::get('/history', [\App\Modules\Coordinator\Controllers\BillingController::class, 'getHistory']);
        Route::put('/payment-method', [\App\Modules\Coordinator\Controllers\BillingController::class, 'updatePaymentMethod']);
        Route::post('/cancel', [\App\Modules\Coordinator\Controllers\BillingController::class, 'cancel']);
    });
});

