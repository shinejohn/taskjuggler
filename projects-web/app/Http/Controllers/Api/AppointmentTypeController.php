<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppointmentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentTypeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $appointmentTypes = AppointmentType::where('organization_id', $request->user()->organization_id)
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($appointmentTypes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:5|max:480',
            'color' => 'nullable|string|max:7',
            'is_active' => 'nullable|boolean',
            'buffer_before_minutes' => 'nullable|integer|min:0',
            'buffer_after_minutes' => 'nullable|integer|min:0',
            'advance_booking_days' => 'nullable|integer|min:0|max:365',
            'cancellation_hours' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'is_public' => 'nullable|boolean',
        ]);

        $appointmentType = AppointmentType::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
            'is_active' => $validated['is_active'] ?? true,
            'is_public' => $validated['is_public'] ?? true,
        ]);

        return response()->json($appointmentType, 201);
    }

    public function show(AppointmentType $appointmentType): JsonResponse
    {
        // Check organization access
        if ($appointmentType->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        return response()->json($appointmentType);
    }

    public function update(Request $request, AppointmentType $appointmentType): JsonResponse
    {
        // Check organization access
        if ($appointmentType->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'sometimes|integer|min:5|max:480',
            'color' => 'nullable|string|max:7',
            'is_active' => 'nullable|boolean',
            'buffer_before_minutes' => 'nullable|integer|min:0',
            'buffer_after_minutes' => 'nullable|integer|min:0',
            'advance_booking_days' => 'nullable|integer|min:0|max:365',
            'cancellation_hours' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'is_public' => 'nullable|boolean',
        ]);

        $appointmentType->update($validated);

        return response()->json($appointmentType);
    }

    public function destroy(AppointmentType $appointmentType): JsonResponse
    {
        // Check organization access
        if ($appointmentType->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $appointmentType->delete();

        return response()->json(null, 204);
    }
}
