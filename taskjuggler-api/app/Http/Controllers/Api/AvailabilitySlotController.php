<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AvailabilitySlot;
use Illuminate\Http\Request;

class AvailabilitySlotController extends Controller
{
    public function index(Request $request)
    {
        $slots = $request->user()
            ->availabilitySlots()
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json($slots);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'day_of_week' => 'nullable|integer|min:0|max:6', // 0 = Sunday, 6 = Saturday
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'specific_date' => 'nullable|date', // For one-time slots
            'timezone' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        // Validate: either day_of_week (recurring) or specific_date (one-time), not both
        if (empty($validated['day_of_week']) && empty($validated['specific_date'])) {
            return response()->json(['error' => 'Either day_of_week (recurring) or specific_date (one-time) must be provided'], 422);
        }

        if (!empty($validated['day_of_week']) && !empty($validated['specific_date'])) {
            return response()->json(['error' => 'Cannot set both day_of_week and specific_date'], 422);
        }

        $slot = AvailabilitySlot::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'is_active' => $validated['is_active'] ?? true,
            'timezone' => $validated['timezone'] ?? $request->user()->timezone ?? 'UTC',
        ]);

        return response()->json($slot, 201);
    }

    public function show(Request $request, string $id)
    {
        $slot = $request->user()
            ->availabilitySlots()
            ->findOrFail($id);

        return response()->json($slot);
    }

    public function update(Request $request, string $id)
    {
        $slot = $request->user()
            ->availabilitySlots()
            ->findOrFail($id);

        $validated = $request->validate([
            'day_of_week' => 'nullable|integer|min:0|max:6',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'specific_date' => 'nullable|date',
            'timezone' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        $slot->update($validated);

        return response()->json($slot);
    }

    public function destroy(Request $request, string $id)
    {
        $slot = $request->user()
            ->availabilitySlots()
            ->findOrFail($id);

        $slot->delete();

        return response()->json(['message' => 'Availability slot deleted successfully']);
    }
}
