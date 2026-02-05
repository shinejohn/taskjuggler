<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AvailabilitySlot;
use App\Models\AppointmentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilitySlotController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AvailabilitySlot::whereHas('appointmentType', function ($q) use ($request) {
            $q->where('organization_id', $request->user()->organization_id)
              ->where('user_id', $request->user()->id);
        });

        if ($request->has('appointment_type_id')) {
            $query->where('appointment_type_id', $request->appointment_type_id);
        }

        $slots = $query->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return response()->json($slots);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'appointment_type_id' => 'required|uuid|exists:appointment_types,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'nullable|boolean',
        ]);

        $appointmentType = AppointmentType::findOrFail($validated['appointment_type_id']);
        
        // Check organization access
        if ($appointmentType->organization_id !== $request->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $slot = AvailabilitySlot::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'is_available' => $validated['is_available'] ?? true,
        ]);

        return response()->json($slot, 201);
    }

    public function show(AvailabilitySlot $slot): JsonResponse
    {
        // Check organization access via appointment type
        if ($slot->appointmentType->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        return response()->json($slot);
    }

    public function update(Request $request, AvailabilitySlot $slot): JsonResponse
    {
        // Check organization access
        if ($slot->appointmentType->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'is_available' => 'nullable|boolean',
        ]);

        $slot->update($validated);

        return response()->json($slot);
    }

    public function destroy(AvailabilitySlot $slot): JsonResponse
    {
        // Check organization access
        if ($slot->appointmentType->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $slot->delete();

        return response()->json(null, 204);
    }
}
