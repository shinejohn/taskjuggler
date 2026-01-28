<?php

namespace App\Modules\OfficialNotice\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\OfficialNotice\Services\IdentityVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IdentityController extends Controller
{
    public function __construct(
        private IdentityVerificationService $identityService
    ) {
    }

    public function startVerification(Request $request)
    {
        $user = Auth::user();
        $result = $this->identityService->startVerification($user);

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        // Verify Stripe signature in real app
        $this->identityService->handleWebhook($payload);

        return response()->json(['received' => true]);
    }

    public function status(Request $request)
    {
        $user = Auth::user();
        $verification = $this->identityService->getVerification($user); // Returns verified only? 
        // Or check method `isVerified`.
        // Let's implement a fuller status check if needed, or just return basic info.

        $isVerified = $this->identityService->isVerified($user);

        // Return latest verification even if pending?
        // Service has `getVerification` which returns 'verified' one.
        // We probably want pending status too for UI.

        // Custom logic to get latest regardless of status
        $latest = \App\Modules\OfficialNotice\Models\IdentityVerification::where('user_id', $user->id)
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'is_verified' => $isVerified,
                'status' => $latest ? $latest->status : 'none',
                'verification' => $latest,
            ]
        ]);
    }

    public function refresh(Request $request)
    {
        // Logic to clear old/expired and start new? 
        // Or just `startVerification` handles new session.
        return $this->startVerification($request);
    }
}
