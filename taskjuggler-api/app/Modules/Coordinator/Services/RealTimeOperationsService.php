<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Contact;
use App\Modules\Coordinator\Models\Appointment;
use App\Modules\Coordinator\Models\AppointmentType;
use App\Modules\Coordinator\Models\AiAgentSession;
use Illuminate\Support\Facades\DB;

/**
 * Real-Time Operations Service
 * Implements Protocol Part 3: Real-Time Operations
 */
class RealTimeOperationsService
{
    /**
     * Get availability for booking
     * GET /internal/ai/calendar/{business_id}/availability
     */
    public function getAvailability(
        string $organizationId,
        string $serviceType,
        string $dateRangeStart,
        string $dateRangeEnd,
        ?int $durationMinutes = 60
    ): array {
        $organization = Organization::findOrFail($organizationId);

        // Get appointment type
        $appointmentType = AppointmentType::where('organization_id', $organizationId)
            ->where('name', $serviceType)
            ->first();

        if (!$appointmentType) {
            return ['slots' => []];
        }

        // Get existing appointments
        $existingAppointments = Appointment::where('organization_id', $organizationId)
            ->whereBetween('starts_at', [$dateRangeStart, $dateRangeEnd])
            ->whereIn('status', ['scheduled', 'confirmed'])
            ->get();

        // Generate available slots (simplified - would use availability schedules)
        $slots = $this->generateSlots(
            $dateRangeStart,
            $dateRangeEnd,
            $durationMinutes,
            $existingAppointments,
            $organization
        );

        return ['slots' => $slots];
    }

    /**
     * Lookup customer
     * GET /internal/ai/crm/{business_id}/customers/lookup
     */
    public function lookupCustomer(
        string $organizationId,
        ?string $phone = null,
        ?string $email = null,
        ?string $name = null
    ): array {
        $query = Contact::where('organization_id', $organizationId);

        if ($phone) {
            $query->where(function ($q) use ($phone) {
                $q->where('phone', $phone)
                  ->orWhere('phone_secondary', $phone);
            });
        }

        if ($email) {
            $query->where('email', $email);
        }

        if ($name) {
            $query->where(function ($q) use ($name) {
                $q->where('first_name', 'like', "%{$name}%")
                  ->orWhere('last_name', 'like', "%{$name}%");
            });
        }

        $contact = $query->first();

        if (!$contact) {
            return ['found' => false];
        }

        return [
            'found' => true,
            'customer' => [
                'id' => $contact->id,
                'name' => $contact->full_name,
                'phone' => $contact->phone,
                'is_verified' => false, // Would check verification status
                'summary' => "Customer since {$contact->created_at->format('Y')}, {$contact->appointments()->count()} previous appointments",
            ],
        ];
    }

    /**
     * Create booking
     * POST /internal/ai/calendar/{business_id}/bookings
     */
    public function createBooking(
        string $organizationId,
        AiAgentSession $session,
        array $bookingData
    ): Appointment {
        $organization = Organization::findOrFail($organizationId);

        // Find or create contact
        $contact = Contact::firstOrCreate(
            [
                'organization_id' => $organizationId,
                'phone' => $bookingData['customer']['phone'],
            ],
            [
                'first_name' => $bookingData['customer']['name'],
                'email' => $bookingData['customer']['email'] ?? null,
                'address' => $bookingData['customer']['address'] ?? null,
                'source' => 'ai_coordinator',
            ]
        );

        // Create appointment
        $appointment = Appointment::create([
            'organization_id' => $organizationId,
            'contact_id' => $contact->id,
            'appointment_type_id' => $bookingData['appointment_type_id'] ?? null,
            'booked_by_coordinator_id' => $session->agent->coordinator_id,
            'title' => $bookingData['title'] ?? 'Appointment',
            'description' => $bookingData['notes'] ?? null,
            'starts_at' => $bookingData['datetime'],
            'ends_at' => (new \Carbon\Carbon($bookingData['datetime']))->addMinutes($bookingData['duration_minutes'] ?? 60),
            'status' => 'scheduled',
            'location' => $bookingData['location'] ?? null,
            'location_type' => $bookingData['location_type'] ?? 'in_person',
            'notes' => $bookingData['notes'] ?? null,
        ]);

        // Update contact last contacted
        $contact->touchLastContacted();

        return $appointment;
    }

    /**
     * Create lead
     * POST /internal/ai/crm/{business_id}/leads
     */
    public function createLead(
        string $organizationId,
        AiAgentSession $session,
        array $leadData
    ): Contact {
        $contact = Contact::create([
            'organization_id' => $organizationId,
            'first_name' => $leadData['name'],
            'phone' => $leadData['phone'],
            'email' => $leadData['email'] ?? null,
            'source' => 'ai_coordinator',
            'status' => 'active',
            'notes' => $leadData['notes'] ?? null,
        ]);

        return $contact;
    }

    /**
     * Generate available time slots
     */
    private function generateSlots(
        string $startDate,
        string $endDate,
        int $durationMinutes,
        $existingAppointments,
        Organization $organization
    ): array {
        // Simplified slot generation
        // In production, would use availability schedules and blocked times
        $slots = [];
        $current = new \Carbon\Carbon($startDate);
        $end = new \Carbon\Carbon($endDate);

        while ($current->lt($end)) {
            // Check if slot conflicts with existing appointment
            $conflicts = false;
            foreach ($existingAppointments as $appt) {
                if ($current->between($appt->starts_at, $appt->ends_at)) {
                    $conflicts = true;
                    break;
                }
            }

            if (!$conflicts && $this->isBusinessHours($current, $organization)) {
                $slots[] = [
                    'datetime' => $current->toIso8601String(),
                    'technician' => null, // Would assign based on availability
                    'confidence' => 'confirmed',
                ];
            }

            $current->addMinutes($durationMinutes);
        }

        return $slots;
    }

    /**
     * Check if time is within business hours
     */
    private function isBusinessHours(\Carbon\Carbon $time, Organization $organization): bool
    {
        $businessHours = $organization->business_hours ?? [];
        $dayOfWeek = strtolower($time->format('l')); // monday, tuesday, etc.

        if (!isset($businessHours[$dayOfWeek])) {
            return false;
        }

        $hours = $businessHours[$dayOfWeek];
        if (!isset($hours['open']) || !isset($hours['close'])) {
            return false;
        }

        $openTime = \Carbon\Carbon::parse($time->format('Y-m-d') . ' ' . $hours['open']);
        $closeTime = \Carbon\Carbon::parse($time->format('Y-m-d') . ' ' . $hours['close']);

        return $time->between($openTime, $closeTime);
    }
}




