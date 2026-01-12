<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\CallLog;
use App\Modules\Coordinator\Models\Coordinator;
use App\Modules\Coordinator\Models\Appointment;
use App\Modules\Coordinator\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard metrics
     * GET /api/coordinator/organizations/{orgId}/dashboard/metrics
     */
    public function getMetrics(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $today = Carbon::today();
        $weekStart = Carbon::now()->startOfWeek();

        // Calls today
        $callsToday = CallLog::where('organization_id', $organization->id)
            ->whereDate('started_at', $today)
            ->count();

        $callsYesterday = CallLog::where('organization_id', $organization->id)
            ->whereDate('started_at', $today->copy()->subDay())
            ->count();

        $callsTodayTrend = $callsYesterday > 0
            ? [
                'value' => abs(round((($callsToday - $callsYesterday) / $callsYesterday) * 100)) . '%',
                'direction' => $callsToday >= $callsYesterday ? 'up' : 'down',
            ]
            : null;

        // Appointments this week
        $appointmentsThisWeek = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [$weekStart, Carbon::now()->endOfWeek()])
            ->where('status', '!=', 'cancelled')
            ->count();

        $appointmentsLastWeek = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [$weekStart->copy()->subWeek(), $weekStart->copy()->subDay()])
            ->where('status', '!=', 'cancelled')
            ->count();

        $appointmentsTrend = $appointmentsLastWeek > 0
            ? [
                'value' => abs(round((($appointmentsThisWeek - $appointmentsLastWeek) / $appointmentsLastWeek) * 100)) . '%',
                'direction' => $appointmentsThisWeek >= $appointmentsLastWeek ? 'up' : 'down',
            ]
            : null;

        // Total contacts
        $totalContacts = Contact::where('organization_id', $organization->id)->count();

        // No-show rate (last 30 days)
        $totalAppointments = Appointment::where('organization_id', $organization->id)
            ->where('starts_at', '>=', Carbon::now()->subDays(30))
            ->where('status', '!=', 'cancelled')
            ->count();

        $noShows = Appointment::where('organization_id', $organization->id)
            ->where('starts_at', '>=', Carbon::now()->subDays(30))
            ->where('status', 'no_show')
            ->count();

        $noShowRate = $totalAppointments > 0 ? round(($noShows / $totalAppointments) * 100) : 0;

        // Calculate no-show trend (compare to previous 30 days)
        $prevTotalAppointments = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [Carbon::now()->subDays(60), Carbon::now()->subDays(30)])
            ->where('status', '!=', 'cancelled')
            ->count();

        $prevNoShows = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [Carbon::now()->subDays(60), Carbon::now()->subDays(30)])
            ->where('status', 'no_show')
            ->count();

        $prevNoShowRate = $prevTotalAppointments > 0 ? round(($prevNoShows / $prevTotalAppointments) * 100) : 0;

        $noShowTrend = [
            'value' => abs($noShowRate - $prevNoShowRate) . '%',
            'direction' => $noShowRate <= $prevNoShowRate ? 'down' : 'up', // Down is good
        ];

        return response()->json([
            'calls_today' => $callsToday,
            'calls_today_trend' => $callsTodayTrend,
            'appointments_this_week' => $appointmentsThisWeek,
            'appointments_trend' => $appointmentsTrend,
            'total_contacts' => $totalContacts,
            'no_show_rate' => $noShowRate,
            'no_show_trend' => $noShowTrend,
        ]);
    }

    /**
     * Get recent calls
     * GET /api/coordinator/organizations/{orgId}/dashboard/recent-calls
     */
    public function getRecentCalls(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $limit = $request->query('limit', 10);

        $calls = CallLog::where('organization_id', $organization->id)
            ->with(['contact', 'coordinator'])
            ->orderBy('started_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($call) {
                $time = Carbon::parse($call->started_at);
                $isToday = $time->isToday();
                
                return [
                    'id' => $call->id,
                    'time' => $time->format('g:i A'),
                    'contact_name' => $call->contact ? $call->contact->full_name : 'Unknown',
                    'coordinator_name' => $call->coordinator ? ($call->coordinator->display_name ?? 'Coordinator') : 'Unknown',
                    'duration' => $this->formatDuration($call->duration_seconds),
                    'outcome' => $call->outcome ?? 'Completed',
                    'status' => $this->getCallStatus($call),
                ];
            });

        return response()->json(['data' => $calls]);
    }

    /**
     * Get today's appointments
     * GET /api/coordinator/organizations/{orgId}/dashboard/today-appointments
     */
    public function getTodayAppointments(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        $appointments = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [$today, $tomorrow])
            ->with(['contact', 'bookedByCoordinator', 'appointmentType'])
            ->orderBy('starts_at', 'asc')
            ->get()
            ->map(function ($appt) {
                return [
                    'id' => $appt->id,
                    'time' => Carbon::parse($appt->starts_at)->format('g:i A'),
                    'contact_name' => $appt->contact ? $appt->contact->full_name : 'Unknown',
                    'type' => $appt->appointmentType ? $appt->appointmentType->name : 'Appointment',
                    'coordinator_name' => $appt->bookedByCoordinator ? ($appt->bookedByCoordinator->display_name ?? 'Coordinator') : 'N/A',
                    'status' => $appt->status,
                ];
            });

        return response()->json(['data' => $appointments]);
    }

    private function formatDuration(int $seconds): string
    {
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;
        return sprintf('%d:%02d', $minutes, $remainingSeconds);
    }

    private function getCallStatus($call): string
    {
        if (in_array($call->outcome, ['Appointment Booked', 'Confirmed', 'Inquiry Resolved'])) {
            return 'success';
        }
        if (in_array($call->outcome, ['Call Dropped', 'Failed'])) {
            return 'error';
        }
        return 'neutral';
    }
}

