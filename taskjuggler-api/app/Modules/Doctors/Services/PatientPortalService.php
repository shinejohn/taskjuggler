<?php

namespace App\Modules\Doctors\Services;

use App\Modules\Doctors\Models\Patient;
use App\Modules\Doctors\Models\PatientNotification;
use App\Modules\Doctors\Models\PatientVisitItem;
use App\Modules\Doctors\Models\PatientConsent;
use App\Modules\Doctors\Models\Appointment;
use Illuminate\Support\Facades\DB;

class PatientPortalService
{
    /**
     * Get dashboard summary for a patient
     */
    public function getDashboardSummary(string $userId)
    {
        /** @var Patient $patient */
        $patient = Patient::where('user_id', $userId)->first();
        
        if (!$patient) {
            return null;
        }

        return [
            'patient' => $patient,
            'recent_notifications' => $patient->notifications()->where('is_read', false)->limit(10)->get(),
            'recent_visit_items' => $patient->visitItems()->limit(15)->get(),
            'status' => $patient->portal_status,
        ];
    }

    /**
     * Mark notification as read
     */
    public function markNotificationRead(string $notificationId, string $userId): bool
    {
        /** @var Patient $patient */
        $patient = Patient::where('user_id', $userId)->first();
        if (!$patient) return false;

        $notification = $patient->notifications()->find($notificationId);
        if (!$notification) return false;

        return $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Simulate AI HealthBot Interaction
     * In production, this would integrate with an AI agent.
     */
    public function handleBotQuery(string $patientId, string $message): array
    {
        // For Phase 5, we provide a structured mock response
        // In the next turn, we can connect this to a real AI service
        return [
            'reply' => "I understand you're asking about '{$message}'. As your HealthBot assistant, I can see your last visit was focused on respiratory health. Would you like me to check if your prescription was sent to the pharmacy?",
            'suggested_actions' => [
                ['label' => 'Check Prescription Status', 'action' => 'check_rx'],
                ['label' => 'Book Follow-up', 'action' => 'book_appt']
            ]
        ];
    }

    /**
     * Get patient appointments from clinical table
     */
    public function getPatientAppointments(string $userId)
    {
        $patient = Patient::where('user_id', $userId)->first();
        if (!$patient) return [];

        return Appointment::where('patient_id', $patient->id)
            ->with(['provider', 'type'])
            ->orderBy('start_time', 'desc')
            ->get();
    }

    /**
     * Get patient labs from visit items
     */
    public function getPatientLabs(string $userId)
    {
        $patient = Patient::where('user_id', $userId)->first();
        if (!$patient) return [];

        return PatientVisitItem::where('patient_id', $patient->id)
            ->where('item_type', 'test')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get patient prior auth requests from visit items
     */
    public function getPatientPriorAuths(string $userId)
    {
        $patient = Patient::where('user_id', $userId)->first();
        if (!$patient) return [];

        return PatientVisitItem::where('patient_id', $patient->id)
            ->where('item_type', 'prior_auth')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get messages between patient and clinic
     */
    public function getPortalMessages(string $userId)
    {
        return \App\Models\DirectMessage::where('sender_id', $userId)
            ->orWhere('recipient_id', $userId)
            ->with(['sender', 'recipient'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Send message from patient portal
     */
    public function sendPortalMessage(string $senderId, string $recipientId, string $content)
    {
        return \App\Models\DirectMessage::create([
            'sender_id' => $senderId,
            'recipient_id' => $recipientId,
            'content' => $content
        ]);
    }
}
