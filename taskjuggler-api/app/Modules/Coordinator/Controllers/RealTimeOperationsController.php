<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Services\RealTimeOperationsService;
use App\Modules\Coordinator\Services\AiAgentAuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Real-Time Operations Controller
 * Implements Protocol Part 3: Real-Time Operations
 */
class RealTimeOperationsController extends Controller
{
    public function __construct(
        private RealTimeOperationsService $operationsService,
        private AiAgentAuthService $authService
    ) {}

    /**
     * Get availability
     * GET /internal/ai/calendar/{business_id}/availability
     */
    public function getAvailability(Request $request, string $businessId): JsonResponse
    {
        $session = $this->validateSession($request);
        if ($session instanceof JsonResponse) {
            return $session;
        }

        if (!$session->hasPermission('read_calendar')) {
            return response()->json(['error' => 'Insufficient permissions'], 403);
        }

        $validated = $request->validate([
            'service_type' => 'required|string',
            'date_range_start' => 'required|date',
            'date_range_end' => 'required|date',
            'duration_minutes' => 'nullable|integer|min:15',
        ]);

        $result = $this->operationsService->getAvailability(
            $businessId,
            $validated['service_type'],
            $validated['date_range_start'],
            $validated['date_range_end'],
            $validated['duration_minutes'] ?? 60
        );

        return response()->json($result);
    }

    /**
     * Lookup customer
     * GET /internal/ai/crm/{business_id}/customers/lookup
     */
    public function lookupCustomer(Request $request, string $businessId): JsonResponse
    {
        $session = $this->validateSession($request);
        if ($session instanceof JsonResponse) {
            return $session;
        }

        if (!$session->hasPermission('read_crm_basic')) {
            return response()->json(['error' => 'Insufficient permissions'], 403);
        }

        $validated = $request->validate([
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'name' => 'nullable|string',
        ]);

        $result = $this->operationsService->lookupCustomer(
            $businessId,
            $validated['phone'] ?? null,
            $validated['email'] ?? null,
            $validated['name'] ?? null
        );

        return response()->json($result);
    }

    /**
     * Create booking
     * POST /internal/ai/calendar/{business_id}/bookings
     */
    public function createBooking(Request $request, string $businessId): JsonResponse
    {
        $session = $this->validateSession($request);
        if ($session instanceof JsonResponse) {
            return $session;
        }

        if (!$session->hasPermission('create_booking')) {
            return response()->json(['error' => 'Insufficient permissions'], 403);
        }

        $validated = $request->validate([
            'service_type' => 'required|string',
            'datetime' => 'required|date',
            'duration_minutes' => 'nullable|integer|min:15',
            'customer' => 'required|array',
            'customer.name' => 'required|string',
            'customer.phone' => 'required|string',
            'customer.email' => 'nullable|email',
            'customer.address' => 'nullable|string',
            'location' => 'nullable|string',
            'location_type' => 'nullable|string|in:in_person,phone,video',
            'notes' => 'nullable|string',
        ]);

        $appointment = $this->operationsService->createBooking(
            $businessId,
            $session,
            $validated
        );

        return response()->json([
            'booking_id' => $appointment->id,
            'confirmation_number' => 'COORD-' . strtoupper(substr($appointment->id, 0, 8)),
            'status' => 'confirmed',
            'assigned_technician' => null,
            'confirmation_sent' => false,
        ], 201);
    }

    /**
     * Create lead
     * POST /internal/ai/crm/{business_id}/leads
     */
    public function createLead(Request $request, string $businessId): JsonResponse
    {
        $session = $this->validateSession($request);
        if ($session instanceof JsonResponse) {
            return $session;
        }

        if (!$session->hasPermission('create_lead')) {
            return response()->json(['error' => 'Insufficient permissions'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'interest' => 'nullable|string',
            'notes' => 'nullable|string',
            'requested_callback' => 'nullable|boolean',
            'preferred_callback_time' => 'nullable|string',
        ]);

        $contact = $this->operationsService->createLead(
            $businessId,
            $session,
            $validated
        );

        return response()->json([
            'lead_id' => $contact->id,
            'status' => 'new',
        ], 201);
    }

    /**
     * Validate session helper
     */
    private function validateSession(Request $request)
    {
        $sessionToken = $request->header('Authorization');
        if (!$sessionToken) {
            return response()->json(['error' => 'Missing authorization'], 401);
        }

        $sessionToken = str_replace('Bearer ', '', $sessionToken);
        $session = $this->authService->validateSession($sessionToken);
        
        if (!$session) {
            return response()->json(['error' => 'Invalid session'], 401);
        }

        return $session;
    }
}




