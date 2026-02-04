<?php

namespace App\Modules\Doctors\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PatientController extends Controller
{
    /**
     * Store a new patient
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Find organization (mock for now or from provider)
        // ideally look up provider record for this user
        $provider = DB::table('doctors_providers')->where('user_id', $user->id)->first();
        $organizationId = $provider ? $provider->organization_id : '00000000-0000-0000-0000-000000000000';

        $id = Str::uuid();
        DB::table('doctors_patients')->insert([
            'id' => $id,
            'organization_id' => $organizationId,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'dob' => $request->dob,
            'email' => $request->email,
            'phone' => $request->phone,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Patient created successfully',
            'patient' => [
                'id' => $id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
            ]
        ], 201);
    }

    /**
     * List recent patients
     */
    public function index(Request $request)
    {
        // ... simple list logic if needed, but DashboardController covers recent
        $patients = DB::table('doctors_patients')->limit(20)->get();
        return response()->json($patients);
    }
}
