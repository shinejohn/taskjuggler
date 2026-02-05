<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::where('organization_id', $request->user()->organization_id)
            ->where('user_id', $request->user()->id)
            ->with(['appointmentType']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('scheduled_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($appointments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'appointment_type_id' => 'required|uuid|exists:appointment_types,id',
            'availability_slot_id' => 'nullable|uuid|exists:availability_slots,id',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_phone' => 'nullable|string|max:50',
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        $appointmentType = AppointmentType::findOrFail($validated['appointment_type_id']);
        
        // Check organization access
        if ($appointmentType->organization_id !== $request->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $appointment = Appointment::create([
            ...$validated,
            'appointment_type_id' => $appointmentType->id,
            'user_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
            'duration_minutes' => $appointmentType->duration_minutes,
            'status' => Appointment::STATUS_PENDING,
        ]);

        return response()->json($appointment, 201);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        // Check organization access
        if ($appointment->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $appointment->load(['appointmentType', 'availabilitySlot']);

        return response()->json($appointment);
    }

    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        // Check organization access
        if ($appointment->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'scheduled_at' => 'sometimes|date',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
            'cancellation_reason' => 'nullable|string',
        ]);

        $appointment->update($validated);

        return response()->json($appointment);
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        // Check organization access
        if ($appointment->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $appointment->delete();

        return response()->json(null, 204);
    }

    public function confirm(Request $request, Appointment $appointment): JsonResponse
    {
        // Check organization access
        if ($appointment->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $appointment->update(['status' => Appointment::STATUS_CONFIRMED]);

        return response()->json($appointment);
    }
}
