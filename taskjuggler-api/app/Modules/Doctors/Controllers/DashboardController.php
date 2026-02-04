<?php

namespace App\Modules\Doctors\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Modules\Doctors\Models\Appointment;
use App\Modules\Doctors\Models\Patient;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get organization context from user or request
        // For MVP, assuming user belongs to one organization
        $user = $request->user();
        $provider = DB::table('doctors_providers')->where('user_id', $user->id)->first();

        $organizationId = $provider ? $provider->organization_id : null;

        // Stats
        $stats = [
            'appointments_today' => 0,
            'patients_total' => 0,
            'tasks_pending' => 0,
        ];

        // Recent Activity
        $recentPatients = [];
        $upcomingAppointments = [];

        if ($organizationId) {
            $stats['appointments_today'] = DB::table('doctors_appointments')
                ->where('organization_id', $organizationId)
                ->whereDate('start_time', now()->toDateString())
                ->count();

            $stats['patients_total'] = DB::table('doctors_patients')
                ->where('organization_id', $organizationId)
                ->count();

            // Fetch upcoming appointments
            $upcomingAppointments = DB::table('doctors_appointments')
                ->join('doctors_patients', 'doctors_appointments.patient_id', '=', 'doctors_patients.id')
                ->where('doctors_appointments.organization_id', $organizationId)
                ->where('doctors_appointments.start_time', '>=', now())
                ->orderBy('doctors_appointments.start_time', 'asc')
                ->limit(5)
                ->select(
                    'doctors_appointments.id',
                    'doctors_appointments.start_time',
                    'doctors_appointments.status',
                    'doctors_patients.first_name',
                    'doctors_patients.last_name'
                )
                ->get();

            // Fetch recent patients (based on created_at or last visit)
            $recentPatients = DB::table('doctors_patients')
                ->where('organization_id', $organizationId)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
        }

        return response()->json([
            'stats' => $stats,
            'upcoming_appointments' => $upcomingAppointments,
            'recent_patients' => $recentPatients,
            'provider_profile' => $provider
        ]);
    }
}
