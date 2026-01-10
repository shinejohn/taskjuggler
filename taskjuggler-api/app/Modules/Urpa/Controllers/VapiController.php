<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use App\Modules\Urpa\Services\VapiService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VapiController extends Controller
{
    public function __construct(
        private VapiService $vapiService
    ) {}

    /**
     * Initiate a Vapi call
     * POST /api/urpa/voice/vapi/call
     */
    public function startCall(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'assistant_id' => 'required|string',
            'customer_number' => 'required|string',
            'phone_number_id' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $user = $request->user();
        
        // Add user_id to metadata
        $metadata = array_merge($validated['metadata'] ?? [], [
            'user_id' => $user->id,
        ]);

        $response = $this->vapiService->initiateCall([
            'assistant_id' => $validated['assistant_id'],
            'customer_number' => $validated['customer_number'],
            'phone_number_id' => $validated['phone_number_id'] ?? null,
            'metadata' => $metadata,
        ]);

        return response()->json($response);
    }

    /**
     * End a Vapi call
     * POST /api/urpa/voice/vapi/call/{callId}/end
     */
    public function endCall(Request $request, string $callId): JsonResponse
    {
        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Call Vapi API to end the call
        $apiUrl = 'https://api.vapi.ai';
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.vapi.api_key'),
            'Content-Type' => 'application/json',
        ])->post($apiUrl . '/call/' . $callId . '/end');

        if ($response->failed()) {
            Log::error('Vapi call end failed', [
                'call_id' => $callId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return response()->json(['error' => 'Failed to end call'], 500);
        }

        // Update phone call status
        $phoneCall->update([
            'status' => 'completed',
            'ended_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Get call status
     * GET /api/urpa/voice/vapi/call/{callId}
     */
    public function getCallStatus(Request $request, string $callId): JsonResponse
    {
        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json($phoneCall);
    }
}

