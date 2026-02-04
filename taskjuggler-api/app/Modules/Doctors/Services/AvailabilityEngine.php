<?php

namespace App\Modules\Doctors\Services;

use App\Modules\Doctors\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AvailabilityEngine
{
    /**
     * Find available slots for a provider on a given date
     */
    public function getAvailableSlots($providerId, $date)
    {
        $startOfDay = Carbon::parse($date)->setHour(9)->setMinute(0); // 9 AM
        $endOfDay = Carbon::parse($date)->setHour(17)->setMinute(0); // 5 PM
        $slotDuration = 30; // Minutes

        // Fetch existing appointments
        $existing = DB::table('doctors_appointments')
            ->where('provider_id', $providerId)
            ->whereDate('start_time', $date) // Assuming mocked for now or standard query
            ->get();

        $slots = [];
        $current = $startOfDay->copy();

        while ($current->lt($endOfDay)) {
            $end = $current->copy()->addMinutes($slotDuration);

            // Check for conflict
            $conflict = $existing->first(function ($apt) use ($current, $end) {
                $aptStart = Carbon::parse($apt->start_time);
                $aptEnd = Carbon::parse($apt->end_time);
                return $current->lt($aptEnd) && $end->gt($aptStart);
            });

            if (!$conflict) {
                $slots[] = [
                    'start' => $current->toIso8601String(),
                    'end' => $end->toIso8601String()
                ];
            }

            $current->addMinutes($slotDuration);
        }

        return $slots;
    }

    /**
     * Check if a specific slot is available
     */
    public function isSlotAvailable($providerId, $start, $end)
    {
        $count = DB::table('doctors_appointments')
            ->where('provider_id', $providerId)
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('start_time', [$start, $end])
                    ->orWhereBetween('end_time', [$start, $end]);
            })
            ->count();

        return $count === 0;
    }
}
