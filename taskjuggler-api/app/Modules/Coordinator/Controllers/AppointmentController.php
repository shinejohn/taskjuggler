<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Get appointments for organization
     * GET /api/coordinator/organizations/{orgId}/appointments
     */
    public function index(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $query = Appointment::where('organization_id', $organization->id)
            ->with(['contact', 'coordinator', 'appointmentType']);

        // Date filters
        if ($request->has('date_from')) {
            $query->where('starts_at', '>=', $request->query('date_from'));
        }

        if ($request->has('date_to')) {
            $query->where('starts_at', '<=', Carbon::parse($request->query('date_to'))->endOfDay());
        }

        // Status filter
        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        // Coordinator filter
        if ($request->has('coordinator_id')) {
            $query->where('booked_by_coordinator_id', $request->query('coordinator_id'));
        }

        // Contact filter
        if ($request->has('contact_id')) {
            $query->where('contact_id', $request->query('contact_id'));
        }

        $appointments = $query->orderBy('starts_at', 'asc')->get();

        return response()->json(['data' => $appointments]);
    }

    /**
     * Get today's appointments
     * GET /api/coordinator/organizations/{orgId}/appointments/today
     */
    public function getToday(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        $appointments = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [$today, $tomorrow])
            ->with(['contact', 'coordinator', 'appointmentType'])
            ->orderBy('starts_at', 'asc')
            ->get();

        return response()->json(['data' => $appointments]);
    }

    /**
     * Get appointment by ID
     * GET /api/coordinator/organizations/{orgId}/appointments/{id}
     */
    public function show(Request $request, string $orgId, string $id): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $appointment = Appointment::where('id', $id)
                ->where('organization_id', $organization->id)
                ->with(['contact', 'coordinator', 'appointmentType'])
                ->firstOrFail();

            return response()->json($appointment);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Appointment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve appointment'], 500);
        }
    }

    /**
     * Create appointment
     * POST /api/coordinator/organizations/{orgId}/appointments
     */
    public function store(Request $request, string $orgId): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $validated = $request->validate([
                'contact_id' => 'required|uuid|exists:coord_contacts,id',
                'appointment_type_id' => 'nullable|uuid|exists:coord_appointment_types,id',
                'booked_by_coordinator_id' => 'nullable|uuid|exists:coord_coordinators,id',
                'assigned_to_user_id' => 'nullable|uuid|exists:users,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'starts_at' => 'required|date',
                'ends_at' => 'required|date|after:starts_at',
                'status' => 'nullable|string|default:scheduled',
                'location' => 'nullable|string',
                'location_type' => 'nullable|string|default:onsite',
                'notes' => 'nullable|string',
            ]);

            $validated['organization_id'] = $organization->id;
            $appointment = Appointment::create($validated);

            return response()->json($appointment->load(['contact', 'coordinator', 'appointmentType']), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Organization not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Failed to create appointment: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create appointment'], 500);
        }
    }

    /**
     * Update appointment
     * PUT /api/coordinator/organizations/{orgId}/appointments/{id}
     */
    public function update(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $appointment = Appointment::where('id', $id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        $validated = $request->validate([
            'contact_id' => 'sometimes|uuid|exists:coord_contacts,id',
            'appointment_type_id' => 'nullable|uuid|exists:coord_appointment_types,id',
            'assigned_to_user_id' => 'nullable|uuid|exists:users,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'starts_at' => 'sometimes|date',
            'ends_at' => 'sometimes|date|after:starts_at',
            'status' => 'sometimes|string',
            'location' => 'nullable|string',
            'location_type' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($validated);

        return response()->json($appointment->load(['contact', 'coordinator', 'appointmentType']));
    }

    /**
     * Cancel appointment
     * POST /api/coordinator/organizations/{orgId}/appointments/{id}/cancel
     */
    public function cancel(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $appointment = Appointment::where('id', $id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $appointment->cancel($validated['reason'] ?? null);

        return response()->json($appointment->load(['contact', 'coordinator', 'appointmentType']));
    }

    /**
     * Delete appointment
     * DELETE /api/coordinator/organizations/{orgId}/appointments/{id}
     */
    public function destroy(Request $request, string $orgId, string $id): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $appointment = Appointment::where('id', $id)
                ->where('organization_id', $organization->id)
                ->firstOrFail();

            $appointment->delete();

            return response()->json(['message' => 'Appointment deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Appointment not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Failed to delete appointment: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete appointment'], 500);
        }
    }
}

