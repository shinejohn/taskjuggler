<?php

namespace App\Modules\Doctors\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Doctors\Services\AvailabilityEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ScheduleController extends Controller
{
    protected $availabilityEngine;

    public function __construct(AvailabilityEngine $availabilityEngine)
    {
        $this->availabilityEngine = $availabilityEngine;
    }

    /**
     * Get available slots for a provider
     */
    public function availability(Request $request)
    {
        $request->validate([
            'provider_id' => 'required', // uuid
            'date' => 'required|date',
        ]);

        $slots = $this->availabilityEngine->getAvailableSlots($request->provider_id, $request->date);
        return response()->json($slots);
    }

    /**
     * Create an appointment
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required',
            'provider_id' => 'required',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'type' => 'required|string'
        ]);

        // Double check availability
        if (!$this->availabilityEngine->isSlotAvailable($request->provider_id, $request->start_time, $request->end_time)) {
            return response()->json(['message' => 'Slot no longer available'], 409);
        }

        $id = Str::uuid();
        DB::table('doctors_appointments')->insert([
            'id' => $id,
            'patient_id' => $request->patient_id,
            'provider_id' => $request->provider_id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'type' => $request->type,
            'status' => 'scheduled',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Appointment booked', 'id' => $id], 201);
    }
}
