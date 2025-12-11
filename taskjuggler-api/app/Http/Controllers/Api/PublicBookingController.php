<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppointmentType;
use App\Services\Appointments\BookingService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PublicBookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {}

    /**
     * Get appointment type by booking slug (public)
     */
    public function getAppointmentType(string $slug)
    {
        $appointmentType = AppointmentType::where('booking_slug', $slug)
            ->where('is_public', true)
            ->where('is_active', true)
            ->with('user:id,name,email')
            ->firstOrFail();

        return response()->json([
            'id' => $appointmentType->id,
            'name' => $appointmentType->name,
            'description' => $appointmentType->description,
            'duration_minutes' => $appointmentType->duration_minutes,
            'color' => $appointmentType->color,
            'price' => $appointmentType->price,
            'currency' => $appointmentType->currency,
            'host' => [
                'name' => $appointmentType->user->name,
                'email' => $appointmentType->user->email,
            ],
        ]);
    }

    /**
     * Get available time slots for a date range (public)
     */
    public function getAvailableSlots(Request $request, string $slug)
    {
        $appointmentType = AppointmentType::where('booking_slug', $slug)
            ->where('is_public', true)
            ->where('is_active', true)
            ->firstOrFail();

        $startDate = $request->input('start_date', Carbon::today()->toDateString());
        $endDate = $request->input('end_date', Carbon::today()->addDays(30)->toDateString());
        $timezone = $request->input('timezone', 'UTC');

        $slots = $this->bookingService->getAvailableSlots(
            $appointmentType,
            Carbon::parse($startDate),
            Carbon::parse($endDate),
            $timezone
        );

        return response()->json([
            'slots' => $slots,
            'timezone' => $timezone,
        ]);
    }

    /**
     * Book an appointment (public)
     */
    public function bookAppointment(Request $request, string $slug)
    {
        $appointmentType = AppointmentType::where('booking_slug', $slug)
            ->where('is_public', true)
            ->where('is_active', true)
            ->firstOrFail();

        $validated = $request->validate([
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

        // Check advance booking limit
        $startTime = Carbon::parse($validated['start_time']);
        $daysInAdvance = $startTime->diffInDays(Carbon::today());
        if ($daysInAdvance > $appointmentType->advance_booking_days) {
            return response()->json([
                'error' => "Appointments can only be booked up to {$appointmentType->advance_booking_days} days in advance"
            ], 422);
        }

        try {
            $appointment = $this->bookingService->bookAppointment(
                $appointmentType,
                array_merge($validated, ['booking_source' => 'public']),
                $request->ip(),
                $request->userAgent()
            );

            return response()->json([
                'appointment' => $appointment->load('appointmentType'),
                'message' => 'Appointment booked successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
