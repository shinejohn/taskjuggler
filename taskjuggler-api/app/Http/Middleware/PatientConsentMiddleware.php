<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Modules\Doctors\Services\ConsentService;

class PatientConsentMiddleware
{
    public function __construct(private ConsentService $consentService) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|null  $specialty
     */
    public function handle(Request $request, Closure $next, ?string $specialty = null): Response
    {
        // Try to find patient ID in route or body
        $patientId = $request->route('patient') ?? $request->input('patient_id');
        
        // If no patient ID is involved, skip check
        if (!$patientId) {
            return $next($request);
        }

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check consent
        if (!$this->consentService->canAccessPatient($patientId, $user->id, $specialty)) {
            return response()->json([
                'success' => false,
                'message' => 'HIPAA Access Restricted: You do not have active consent to view this patient\'s records.',
                'code' => 'CONSENT_REQUIRED',
                'patient_id' => $patientId
            ], 403);
        }

        return $next($request);
    }
}
