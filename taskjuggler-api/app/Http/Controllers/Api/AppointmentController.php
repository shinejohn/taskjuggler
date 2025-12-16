<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentType;
use App\Services\Appointments\BookingService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {}

    public function index(Request $request)
    {
        $query = $request->user()
            ->hostedAppointments()
            ->with(['appointmentType', 'task']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->upcoming) {
            $query->upcoming();
        }

        if ($request->past) {
            $query->past();
        }

        $appointments = $query->orderBy('start_time', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_type_id' => 'required|exists:appointment_types,id',
            'start_time' => 'required|date|after:now',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'meeting_location' => 'nullable|string|max:500',
            'timezone' => 'nullable|string|max:50',
            'send_reminder_email' => 'nullable|boolean',
            'send_reminder_sms' => 'nullable|boolean',
        ]);

        $appointmentType = AppointmentType::findOrFail($validated['appointment_type_id']);

        // Verify user owns the appointment type
        if ($appointmentType->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $appointment = $this->bookingService->bookAppointment(
                $appointmentType,
                $validated,
                $request->ip(),
                $request->userAgent()
            );

            return response()->json($appointment, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function show(Request $request, string $id)
    {
        $appointment = $request->user()
            ->hostedAppointments()
            ->with(['appointmentType', 'task'])
            ->findOrFail($id);

        return response()->json($appointment);
    }

    public function update(Request $request, string $id)
    {
        $appointment = $request->user()
            ->hostedAppointments()
            ->findOrFail($id);

        $validated = $request->validate([
            'guest_name' => 'sometimes|string|max:255',
            'guest_email' => 'sometimes|email|max:255',
            'guest_phone' => 'nullable|string|max:50',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
            'notes' => 'nullable|string',
            'internal_notes' => 'nullable|string',
            'meeting_location' => 'nullable|string|max:500',
            'meeting_url' => 'nullable|url|max:500',
            'status' => 'sometimes|in:scheduled,confirmed,cancelled,completed,no_show',
        ]);

        $appointment->update($validated);

        return response()->json($appointment);
    }

    public function destroy(Request $request, string $id)
    {
        $appointment = $request->user()
            ->hostedAppointments()
            ->findOrFail($id);

        $this->bookingService->cancelAppointment($appointment, 'Cancelled by host');

        return response()->json(['message' => 'Appointment cancelled successfully']);
    }

    public function confirm(Request $request, string $id)
    {
        $appointment = $request->user()
            ->hostedAppointments()
            ->findOrFail($id);

        $appointment->update([
            'status' => Appointment::STATUS_CONFIRMED,
            'confirmed_at' => now(),
        ]);

        return response()->json($appointment);
    }
}
