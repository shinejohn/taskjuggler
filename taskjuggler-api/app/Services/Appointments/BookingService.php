<?php

namespace App\Services\Appointments;

use App\Models\Appointment;
use App\Models\AppointmentType;
use App\Models\AvailabilitySlot;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BookingService
{
    /**
     * Get available time slots for a given appointment type and date range
     */
    public function getAvailableSlots(
        AppointmentType $appointmentType,
        Carbon $startDate,
        Carbon $endDate,
        string $timezone = 'UTC'
    ): array {
        $slots = [];
        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            $dayOfWeek = $currentDate->dayOfWeek;
            $dateStr = $currentDate->format('Y-m-d');

            // Get recurring availability for this day of week
            $recurringSlots = AvailabilitySlot::where('user_id', $appointmentType->user_id)
                ->where('is_active', true)
                ->where('day_of_week', $dayOfWeek)
                ->where(function ($query) use ($dateStr) {
                    $query->whereNull('start_date')
                        ->orWhere('start_date', '<=', $dateStr);
                })
                ->where(function ($query) use ($dateStr) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $dateStr);
                })
                ->get();

            // Get one-time availability for this specific date
            $oneTimeSlots = AvailabilitySlot::where('user_id', $appointmentType->user_id)
                ->where('is_active', true)
                ->where('specific_date', $dateStr)
                ->get();

            $allSlots = $recurringSlots->merge($oneTimeSlots);

            foreach ($allSlots as $availabilitySlot) {
                $availableSlots = $this->generateTimeSlotsForAvailability(
                    $availabilitySlot,
                    $currentDate->copy(),
                    $appointmentType
                );

                $slots = array_merge($slots, $availableSlots);
            }

            $currentDate->addDay();
        }

        // Sort slots by start time
        usort($slots, function ($a, $b) {
            return strtotime($a['start_time']) <=> strtotime($b['start_time']);
        });

        return $slots;
    }

    /**
     * Generate time slots from an availability slot
     */
    private function generateTimeSlotsForAvailability(
        AvailabilitySlot $availabilitySlot,
        Carbon $date,
        AppointmentType $appointmentType
    ): array {
        $slots = [];
        $startTime = Carbon::parse($availabilitySlot->start_time);
        $endTime = Carbon::parse($availabilitySlot->end_time);
        $duration = $appointmentType->duration_minutes;
        $bufferBefore = $appointmentType->buffer_before_minutes;
        $bufferAfter = $appointmentType->buffer_after_minutes;

        $currentSlotStart = $date->copy()
            ->setTime($startTime->hour, $startTime->minute, 0);

        $dayEnd = $date->copy()
            ->setTime($endTime->hour, $endTime->minute, 0);

        while ($currentSlotStart->copy()->addMinutes($duration)->lte($dayEnd)) {
            $slotStart = $currentSlotStart->copy();
            $slotEnd = $currentSlotStart->copy()->addMinutes($duration);

            // Check if this slot is available (not booked and not in buffer)
            if ($this->isSlotAvailable($appointmentType, $slotStart, $slotEnd, $bufferBefore, $bufferAfter)) {
                $slots[] = [
                    'start_time' => $slotStart->toIso8601String(),
                    'end_time' => $slotEnd->toIso8601String(),
                    'formatted_start' => $slotStart->format('Y-m-d H:i:s'),
                    'formatted_end' => $slotEnd->format('Y-m-d H:i:s'),
                ];
            }

            // Move to next slot (with buffer)
            $currentSlotStart->addMinutes($duration + $bufferAfter);
        }

        return $slots;
    }

    /**
     * Check if a time slot is available
     */
    private function isSlotAvailable(
        AppointmentType $appointmentType,
        Carbon $startTime,
        Carbon $endTime,
        int $bufferBefore,
        int $bufferAfter
    ): bool {
        // Check for overlapping appointments
        $overlapping = Appointment::where('appointment_type_id', $appointmentType->id)
            ->where('status', '!=', Appointment::STATUS_CANCELLED)
            ->where(function ($query) use ($startTime, $endTime, $bufferBefore, $bufferAfter) {
                $bufferStart = $startTime->copy()->subMinutes($bufferBefore);
                $bufferEnd = $endTime->copy()->addMinutes($bufferAfter);

                $query->whereBetween('start_time', [$bufferStart, $bufferEnd])
                    ->orWhereBetween('end_time', [$bufferStart, $bufferEnd])
                    ->orWhere(function ($q) use ($bufferStart, $bufferEnd) {
                        $q->where('start_time', '<=', $bufferStart)
                            ->where('end_time', '>=', $bufferEnd);
                    });
            })
            ->exists();

        return !$overlapping;
    }

    /**
     * Book an appointment
     */
    public function bookAppointment(
        AppointmentType $appointmentType,
        array $bookingData,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): Appointment {
        $startTime = Carbon::parse($bookingData['start_time']);
        $endTime = $startTime->copy()->addMinutes($appointmentType->duration_minutes);

        // Validate slot is still available
        if (!$this->isSlotAvailable($appointmentType, $startTime, $endTime, 0, 0)) {
            throw new \Exception('This time slot is no longer available');
        }

        // Create appointment
        $appointment = Appointment::create([
            'appointment_type_id' => $appointmentType->id,
            'host_id' => $appointmentType->user_id,
            'guest_name' => $bookingData['guest_name'],
            'guest_email' => $bookingData['guest_email'],
            'guest_phone' => $bookingData['guest_phone'] ?? null,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'timezone' => $bookingData['timezone'] ?? 'UTC',
            'status' => Appointment::STATUS_SCHEDULED,
            'notes' => $bookingData['notes'] ?? null,
            'meeting_location' => $bookingData['meeting_location'] ?? null,
            'send_reminder_email' => $bookingData['send_reminder_email'] ?? true,
            'send_reminder_sms' => $bookingData['send_reminder_sms'] ?? false,
            'booking_source' => $bookingData['booking_source'] ?? 'web',
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        // Optionally create a task
        if ($appointmentType->user->preferences['auto_create_task_from_appointment'] ?? false) {
            $this->createTaskFromAppointment($appointment);
        }

        return $appointment;
    }

    /**
     * Create a task from an appointment
     */
    public function createTaskFromAppointment(Appointment $appointment): Task
    {
        $task = Task::create([
            'title' => "Appointment: {$appointment->appointmentType->name} with {$appointment->guest_name}",
            'description' => "Appointment scheduled for {$appointment->start_time->format('Y-m-d H:i')}\n\nGuest: {$appointment->guest_name}\nEmail: {$appointment->guest_email}\nPhone: {$appointment->guest_phone}\n\nNotes: {$appointment->notes}",
            'status' => Task::STATUS_PENDING,
            'priority' => Task::PRIORITY_NORMAL,
            'requestor_id' => $appointment->host_id,
            'owner_id' => $appointment->host_id,
            'contact_name' => $appointment->guest_name,
            'contact_email' => $appointment->guest_email,
            'contact_phone' => $appointment->guest_phone,
            'start_date' => $appointment->start_time,
            'due_date' => $appointment->end_time,
            'tags' => ['appointment', $appointment->appointmentType->name],
        ]);

        $appointment->update(['task_id' => $task->id]);

        return $task;
    }

    /**
     * Cancel an appointment
     */
    public function cancelAppointment(Appointment $appointment, ?string $reason = null): void
    {
        $appointment->update([
            'status' => Appointment::STATUS_CANCELLED,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }
}
