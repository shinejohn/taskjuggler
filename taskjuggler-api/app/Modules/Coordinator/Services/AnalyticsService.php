<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\CallLog;
use App\Modules\Coordinator\Models\Appointment;
use App\Modules\Coordinator\Models\Contact;
use App\Modules\Coordinator\Models\Coordinator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Get comprehensive analytics for organization
     */
    public function getAnalytics(Organization $organization, array $filters = []): array
    {
        $dateFrom = $filters['date_from'] ?? now()->subDays(30)->startOfDay();
        $dateTo = $filters['date_to'] ?? now()->endOfDay();

        return [
            'period' => [
                'from' => Carbon::parse($dateFrom)->toIso8601String(),
                'to' => Carbon::parse($dateTo)->toIso8601String(),
            ],
            'calls' => $this->getCallAnalytics($organization, $dateFrom, $dateTo),
            'appointments' => $this->getAppointmentAnalytics($organization, $dateFrom, $dateTo),
            'contacts' => $this->getContactAnalytics($organization, $dateFrom, $dateTo),
            'coordinators' => $this->getCoordinatorPerformance($organization, $dateFrom, $dateTo),
            'trends' => $this->getTrends($organization, $dateFrom, $dateTo),
        ];
    }

    /**
     * Get call analytics
     */
    protected function getCallAnalytics(Organization $organization, $dateFrom, $dateTo): array
    {
        $calls = CallLog::where('organization_id', $organization->id)
            ->whereBetween('started_at', [$dateFrom, $dateTo])
            ->get();

        $totalCalls = $calls->count();
        $inboundCalls = $calls->where('direction', 'inbound')->count();
        $outboundCalls = $calls->where('direction', 'outbound')->count();
        $answeredCalls = $calls->where('status', 'completed')->count();
        $missedCalls = $calls->where('status', 'no-answer')->count();

        $totalDuration = $calls->sum('duration_seconds');
        $avgDuration = $totalCalls > 0 ? round($totalDuration / $totalCalls) : 0;

        $appointmentsBooked = $calls->filter(function ($call) {
            return in_array($call->outcome, ['Appointment Booked', 'Appointment Scheduled']);
        })->count();

        $bookingRate = $totalCalls > 0 ? round(($appointmentsBooked / $totalCalls) * 100, 2) : 0;
        $answerRate = $totalCalls > 0 ? round(($answeredCalls / $totalCalls) * 100, 2) : 0;

        return [
            'total_calls' => $totalCalls,
            'inbound_calls' => $inboundCalls,
            'outbound_calls' => $outboundCalls,
            'answered_calls' => $answeredCalls,
            'missed_calls' => $missedCalls,
            'answer_rate' => $answerRate,
            'avg_duration_seconds' => $avgDuration,
            'appointments_booked' => $appointmentsBooked,
            'booking_rate' => $bookingRate,
            'total_cost' => $calls->sum('cost'),
        ];
    }

    /**
     * Get appointment analytics
     */
    protected function getAppointmentAnalytics(Organization $organization, $dateFrom, $dateTo): array
    {
        $appointments = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [$dateFrom, $dateTo])
            ->get();

        $totalAppointments = $appointments->count();
        $confirmed = $appointments->where('status', 'confirmed')->count();
        $completed = $appointments->where('status', 'completed')->count();
        $cancelled = $appointments->where('status', 'cancelled')->count();
        $noShows = $appointments->where('status', 'no_show')->count();

        $confirmationRate = $totalAppointments > 0 ? round(($confirmed / $totalAppointments) * 100, 2) : 0;
        $completionRate = $totalAppointments > 0 ? round(($completed / $totalAppointments) * 100, 2) : 0;
        $noShowRate = $totalAppointments > 0 ? round(($noShows / $totalAppointments) * 100, 2) : 0;

        return [
            'total_appointments' => $totalAppointments,
            'confirmed' => $confirmed,
            'completed' => $completed,
            'cancelled' => $cancelled,
            'no_shows' => $noShows,
            'confirmation_rate' => $confirmationRate,
            'completion_rate' => $completionRate,
            'no_show_rate' => $noShowRate,
        ];
    }

    /**
     * Get contact analytics
     */
    protected function getContactAnalytics(Organization $organization, $dateFrom, $dateTo): array
    {
        $totalContacts = Contact::where('organization_id', $organization->id)->count();
        $newContacts = Contact::where('organization_id', $organization->id)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();

        $contactsWithAppointments = Contact::where('organization_id', $organization->id)
            ->whereHas('appointments', function ($query) use ($dateFrom, $dateTo) {
                $query->whereBetween('starts_at', [$dateFrom, $dateTo]);
            })
            ->count();

        return [
            'total_contacts' => $totalContacts,
            'new_contacts' => $newContacts,
            'contacts_with_appointments' => $contactsWithAppointments,
        ];
    }

    /**
     * Get coordinator performance metrics
     */
    protected function getCoordinatorPerformance(Organization $organization, $dateFrom, $dateTo): array
    {
        $coordinators = Coordinator::where('organization_id', $organization->id)->get();

        return $coordinators->map(function ($coordinator) use ($organization, $dateFrom, $dateTo) {
            $calls = CallLog::where('organization_id', $organization->id)
                ->where('coordinator_id', $coordinator->id)
                ->whereBetween('started_at', [$dateFrom, $dateTo])
                ->get();

            $appointments = Appointment::where('organization_id', $organization->id)
                ->where('booked_by_coordinator_id', $coordinator->id)
                ->whereBetween('starts_at', [$dateFrom, $dateTo])
                ->get();

            $totalCalls = $calls->count();
            $answeredCalls = $calls->where('status', 'completed')->count();
            $appointmentsBooked = $appointments->where('status', '!=', 'cancelled')->count();

            $answerRate = $totalCalls > 0 ? round(($answeredCalls / $totalCalls) * 100, 2) : 0;
            $bookingRate = $answeredCalls > 0 ? round(($appointmentsBooked / $answeredCalls) * 100, 2) : 0;

            return [
                'coordinator_id' => $coordinator->id,
                'coordinator_name' => $coordinator->display_name ?? 'Coordinator',
                'calls' => $totalCalls,
                'answered' => $answeredCalls,
                'appointments' => $appointmentsBooked,
                'answer_rate' => $answerRate,
                'booking_rate' => $bookingRate,
                'avg_duration' => $totalCalls > 0 ? round($calls->avg('duration_seconds')) : 0,
            ];
        })->toArray();
    }

    /**
     * Get trends over time
     */
    protected function getTrends(Organization $organization, $dateFrom, $dateTo): array
    {
        $days = Carbon::parse($dateFrom)->diffInDays(Carbon::parse($dateTo));
        $interval = $days > 30 ? 'week' : 'day';

        $callTrends = [];
        $appointmentTrends = [];

        if ($interval === 'day') {
            $current = Carbon::parse($dateFrom);
            while ($current->lte($dateTo)) {
                $dayStart = $current->copy()->startOfDay();
                $dayEnd = $current->copy()->endOfDay();

                $dayCalls = CallLog::where('organization_id', $organization->id)
                    ->whereBetween('started_at', [$dayStart, $dayEnd])
                    ->count();

                $dayAppointments = Appointment::where('organization_id', $organization->id)
                    ->whereBetween('starts_at', [$dayStart, $dayEnd])
                    ->where('status', '!=', 'cancelled')
                    ->count();

                $callTrends[] = [
                    'date' => $current->toDateString(),
                    'calls' => $dayCalls,
                ];

                $appointmentTrends[] = [
                    'date' => $current->toDateString(),
                    'appointments' => $dayAppointments,
                ];

                $current->addDay();
            }
        } else {
            $current = Carbon::parse($dateFrom)->startOfWeek();
            while ($current->lte($dateTo)) {
                $weekStart = $current->copy()->startOfWeek();
                $weekEnd = $current->copy()->endOfWeek();

                $weekCalls = CallLog::where('organization_id', $organization->id)
                    ->whereBetween('started_at', [$weekStart, $weekEnd])
                    ->count();

                $weekAppointments = Appointment::where('organization_id', $organization->id)
                    ->whereBetween('starts_at', [$weekStart, $weekEnd])
                    ->where('status', '!=', 'cancelled')
                    ->count();

                $callTrends[] = [
                    'date' => $weekStart->toDateString(),
                    'calls' => $weekCalls,
                ];

                $appointmentTrends[] = [
                    'date' => $weekStart->toDateString(),
                    'appointments' => $weekAppointments,
                ];

                $current->addWeek();
            }
        }

        return [
            'calls' => $callTrends,
            'appointments' => $appointmentTrends,
        ];
    }

    /**
     * Get top metrics for dashboard
     */
    public function getTopMetrics(Organization $organization): array
    {
        $today = Carbon::today();
        $yesterday = $today->copy()->subDay();
        $thisWeek = Carbon::now()->startOfWeek();
        $lastWeek = $thisWeek->copy()->subWeek();

        // Calls today
        $callsToday = CallLog::where('organization_id', $organization->id)
            ->whereDate('started_at', $today)
            ->count();

        $callsYesterday = CallLog::where('organization_id', $organization->id)
            ->whereDate('started_at', $yesterday)
            ->count();

        // Appointments this week
        $appointmentsThisWeek = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [$thisWeek, Carbon::now()->endOfWeek()])
            ->where('status', '!=', 'cancelled')
            ->count();

        $appointmentsLastWeek = Appointment::where('organization_id', $organization->id)
            ->whereBetween('starts_at', [$lastWeek, $thisWeek->copy()->subDay()])
            ->where('status', '!=', 'cancelled')
            ->count();

        // Booking rate
        $callsLast30Days = CallLog::where('organization_id', $organization->id)
            ->where('started_at', '>=', now()->subDays(30))
            ->get();

        $appointmentsFromCalls = $callsLast30Days->filter(function ($call) {
            return in_array($call->outcome, ['Appointment Booked', 'Appointment Scheduled']);
        })->count();

        $bookingRate = $callsLast30Days->count() > 0 
            ? round(($appointmentsFromCalls / $callsLast30Days->count()) * 100, 2) 
            : 0;

        return [
            'calls_today' => $callsToday,
            'calls_today_change' => $callsYesterday > 0 
                ? round((($callsToday - $callsYesterday) / $callsYesterday) * 100, 1) 
                : 0,
            'appointments_this_week' => $appointmentsThisWeek,
            'appointments_week_change' => $appointmentsLastWeek > 0 
                ? round((($appointmentsThisWeek - $appointmentsLastWeek) / $appointmentsLastWeek) * 100, 1) 
                : 0,
            'booking_rate' => $bookingRate,
            'total_contacts' => Contact::where('organization_id', $organization->id)->count(),
        ];
    }
}

