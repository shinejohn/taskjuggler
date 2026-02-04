<?php

namespace App\Modules\Doctors\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Doctors\Services\PatientPortalService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PatientPortalController extends Controller
{
    public function __construct(
        private PatientPortalService $portalService,
        private \App\Modules\Doctors\Services\IntakeService $intakeService
    ) {}

    /**
     * Get patient portal dashboard summary
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $summary = $this->portalService->getDashboardSummary($user->id);

        if (!$summary) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        // Add sharing code to dashboard
        $summary['sharing_code'] = $this->intakeService->getSharingCode($user->id);

        return response()->json($summary);
    }

    /**
     * Submit multi-step intake form
     */
    public function storeIntake(Request $request): JsonResponse
    {
        $user = $request->user();
        $patient = $this->intakeService->submitIntake($user->id, $request->all());

        return response()->json([
            'success' => true,
            'patient' => $patient,
            'sharing_code' => $patient->universal_health_id
        ]);
    }

    /**
     * Get active consents
     */
    public function getConsents(Request $request): JsonResponse
    {
        $user = $request->user();
        $patient = \App\Modules\Doctors\Models\Patient::where('user_id', $user->id)->first();
        
        if (!$patient) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        $consents = \App\Modules\Doctors\Models\PatientConsent::where('patient_id', $patient->id)
            ->where('is_active', true)
            ->get();

        return response()->json($consents);
    }

    /**
     * Mark a notification as read
     */
    public function markRead(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $success = $this->portalService->markNotificationRead($id, $user->id);

        return response()->json(['success' => $success]);
    }

    /**
     * Handle HealthBot chat queries
     */
    public function chat(Request $request): JsonResponse
    {
        $request->validate(['message' => 'required|string']);
        
        $user = $request->user();
        $patient = \App\Modules\Doctors\Models\Patient::where('user_id', $user->id)->first();
        
        if (!$patient) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        $response = $this->portalService->handleBotQuery($patient->id, $request->message);
        return response()->json($response);
    }

    /**
     * Get patient appointments
     */
    public function getAppointments(Request $request): JsonResponse
    {
        $user = $request->user();
        $appointments = $this->portalService->getPatientAppointments($user->id);
        return response()->json($appointments);
    }

    /**
     * Get patient labs
     */
    public function getLabs(Request $request): JsonResponse
    {
        $user = $request->user();
        $labs = $this->portalService->getPatientLabs($user->id);
        return response()->json($labs);
    }

    /**
     * Get patient prior auths
     */
    public function getPriorAuths(Request $request): JsonResponse
    {
        $user = $request->user();
        $auths = $this->portalService->getPatientPriorAuths($user->id);
        return response()->json($auths);
    }

    /**
     * Get portal messages
     */
    public function getMessages(Request $request): JsonResponse
    {
        $user = $request->user();
        $messages = $this->portalService->getPortalMessages($user->id);
        return response()->json($messages);
    }

    /**
     * Send a portal message
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'recipient_id' => 'required|uuid',
            'content' => 'required|string'
        ]);

        $user = $request->user();
        $message = $this->portalService->sendPortalMessage(
            $user->id, 
            $request->input('recipient_id'), 
            $request->input('content')
        );

        return response()->json($message);
    }
}
