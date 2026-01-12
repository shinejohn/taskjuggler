<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaVoiceResponse;
use App\Modules\Urpa\Models\UrpaPhoneCall;
use App\Modules\Urpa\Services\VoiceResponseService;
use App\Modules\Urpa\Services\AiService;
use App\Modules\Urpa\Services\FunctionCallService;
use App\Modules\Urpa\Services\ContextBuilderService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class VoiceController extends Controller
{
    public function __construct(
        private VoiceResponseService $voiceResponseService,
        private AiService $aiService,
        private FunctionCallService $functionCallService,
        private ContextBuilderService $contextBuilder
    ) {}

    /**
     * Get pre-recorded responses
     * GET /api/urpa/voice/prerecorded
     */
    public function getPrerecordedResponses(Request $request): JsonResponse
    {
        $query = UrpaVoiceResponse::active();

        if ($request->has('category')) {
            $query->byCategory($request->query('category'));
        }

        if ($request->has('intent')) {
            $query->byIntent($request->query('intent'));
        }

        $responses = $query->orderBy('usage_count', 'desc')->get();

        return response()->json(['data' => $responses]);
    }

    /**
     * Find response for input
     * POST /api/urpa/voice/find-response
     */
    public function findResponse(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_input' => 'required|string',
            'detected_intent' => 'nullable|string',
            'business_id' => 'nullable|uuid',
            'industry' => 'nullable|string',
            'time_of_day' => 'nullable|string|in:morning,afternoon,evening',
            'call_state' => 'nullable|string|in:greeting,conversation,closing',
            'previous_responses' => 'nullable|array',
        ]);

        $response = $this->voiceResponseService->selectResponse([
            'userInput' => $validated['user_input'],
            'detectedIntent' => $validated['detected_intent'] ?? null,
            'businessId' => $validated['business_id'] ?? null,
            'industry' => $validated['industry'] ?? null,
            'timeOfDay' => $validated['time_of_day'] ?? null,
            'callState' => $validated['call_state'] ?? null,
            'previousResponses' => $validated['previous_responses'] ?? [],
        ]);

        if ($response) {
            $response->incrementUsage();
        }

        return response()->json([
            'response' => $response,
            'found' => $response !== null,
        ]);
    }

    /**
     * Bulk create pre-recorded responses
     * POST /api/urpa/voice/prerecorded/bulk
     */
    public function bulkCreateResponses(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'responses' => 'required|array',
            'responses.*.category' => 'required|string|max:50',
            'responses.*.intent' => 'nullable|string|max:100',
            'responses.*.text_content' => 'required|string',
            'responses.*.audio_url' => 'nullable|url',
            'responses.*.trigger_phrases' => 'nullable|array',
            'responses.*.context_requirements' => 'nullable|array',
            'responses.*.personalization_slots' => 'nullable|array',
        ]);

        $created = 0;
        foreach ($validated['responses'] as $responseData) {
            UrpaVoiceResponse::updateOrCreate(
                [
                    'category' => $responseData['category'],
                    'intent' => $responseData['intent'] ?? null,
                ],
                [
                    'text_content' => $responseData['text_content'],
                    'audio_url' => $responseData['audio_url'] ?? null,
                    'trigger_phrases' => $responseData['trigger_phrases'] ?? [],
                    'context_requirements' => $responseData['context_requirements'] ?? [],
                    'has_personalization' => !empty($responseData['personalization_slots']),
                    'personalization_slots' => $responseData['personalization_slots'] ?? [],
                    'is_active' => true,
                ]
            );
            $created++;
        }

        return response()->json(['created' => $created]);
    }

    /**
     * Log response usage
     * POST /api/urpa/voice/prerecorded/{id}/used
     */
    public function logUsage(Request $request, string $id): JsonResponse
    {
        $response = UrpaVoiceResponse::findOrFail($id);
        $response->incrementUsage();

        return response()->json(['success' => true]);
    }

    /**
     * Vapi webhook handler
     * POST /api/urpa/voice/vapi/webhook
     */
    public function vapiWebhook(Request $request): JsonResponse
    {
        $event = $request->all();
        Log::info('Vapi webhook received', ['event' => $event]);

        $eventType = $event['type'] ?? $event['message']['type'] ?? null;
        
        // Handle different Vapi event types
        switch ($eventType) {
            case 'call-started':
            case 'call.started':
                $this->handleCallStarted($event);
                break;
            case 'call-ended':
            case 'call.ended':
                $this->handleCallEnded($event);
                break;
            case 'transcript-complete':
            case 'transcript.complete':
                $this->handleTranscriptComplete($event);
                break;
            case 'function-call':
            case 'function.call':
                $this->handleFunctionCall($event);
                break;
            case 'message':
            case 'message.created':
                $this->handleMessageEvent($event);
                break;
            default:
                Log::info("Unhandled Vapi event type: {$eventType}");
        }

        return response()->json(['received' => true]);
    }

    /**
     * Handle call started event
     */
    private function handleCallStarted(array $event): void
    {
        $call = $event['call'] ?? $event['message']['call'] ?? [];
        $userId = $event['metadata']['user_id'] ?? null;

        if (!$userId) {
            Log::warning('Call started event missing user_id');
            return;
        }

        // Create phone call record
        UrpaPhoneCall::create([
            'user_id' => $userId,
            'direction' => $call['direction'] ?? 'inbound',
            'caller_number' => $call['customer']['number'] ?? null,
            'callee_number' => $call['phoneNumber']['number'] ?? null,
            'status' => 'in_progress',
            'handled_by_ai' => true,
            'vapi_call_id' => $call['id'],
            'vapi_assistant_id' => $call['assistantId'] ?? null,
            'started_at' => now(),
        ]);
    }

    /**
     * Handle call ended event
     */
    private function handleCallEnded(array $event): void
    {
        $call = $event['call'] ?? $event['message']['call'] ?? [];
        $callId = $call['id'] ?? null;

        if (!$callId) {
            return;
        }

        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)->first();
        if (!$phoneCall) {
            Log::warning("Call ended event for unknown call: {$callId}");
            return;
        }

        $startedAt = $call['startedAt'] ?? $phoneCall->started_at;
        $endedAt = $call['endedAt'] ?? now();
        $duration = $startedAt && $endedAt
            ? (strtotime($endedAt) - strtotime($startedAt))
            : 0;

        $phoneCall->update([
            'status' => 'completed',
            'duration_seconds' => $duration,
            'ended_at' => $endedAt,
            'recording_url' => $call['recordingUrl'] ?? null,
        ]);
    }

    /**
     * Handle transcript complete event
     */
    private function handleTranscriptComplete(array $event): void
    {
        $call = $event['call'] ?? $event['message']['call'] ?? [];
        $transcript = $event['transcript'] ?? $event['message']['transcript'] ?? [];
        $callId = $call['id'] ?? null;

        if (!$callId) {
            return;
        }

        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)->first();
        if (!$phoneCall) {
            return;
        }

        $user = User::find($phoneCall->user_id);
        if (!$user) {
            return;
        }

        // Combine transcript messages
        $transcriptText = collect($transcript)->map(function ($message) {
            $role = $message['role'] ?? 'unknown';
            $content = $message['content'] ?? '';
            return "[{$role}]: {$content}";
        })->join("\n");

        $phoneCall->update([
            'transcript' => $transcriptText,
        ]);

        // Build context for summary generation
        $contact = $phoneCall->contact_id ? \App\Modules\Urpa\Models\UrpaContact::find($phoneCall->contact_id) : null;
        $context = $this->contextBuilder->buildCallContext($user, $contact);

        // Generate AI summary with context
        $summary = $this->aiService->generateCallSummary($transcriptText);
        $phoneCall->update([
            'ai_summary' => $summary,
        ]);

        // Extract tasks from transcript
        $tasks = $this->aiService->extractTasksFromTranscript(
            $phoneCall->user_id,
            $transcriptText,
            null
        );

        // Update actions taken if tasks were created
        if (!empty($tasks)) {
            $actions = $phoneCall->actions_taken ?? [];
            foreach ($tasks as $task) {
                $actions[] = "Created task: {$task->title}";
            }
            $phoneCall->update([
                'actions_taken' => $actions,
            ]);
        }
    }

    /**
     * Handle message event (check if response matches pre-recorded)
     */
    private function handleMessageEvent(array $event): void
    {
        $message = $event['message'] ?? $event;
        $callId = $message['callId'] ?? $event['call']['id'] ?? null;
        $content = $message['content'] ?? null;
        $role = $message['role'] ?? null;

        if (!$callId || !$content || $role !== 'assistant') {
            return;
        }

        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)->first();
        if (!$phoneCall) {
            return;
        }

        // Check if response matches a pre-recorded response
        $matchedResponse = $this->voiceResponseService->selectResponse([
            'userInput' => $content,
            'callState' => 'conversation',
        ]);

        if ($matchedResponse) {
            // Log usage for analytics
            $matchedResponse->incrementUsage();
            
            Log::info('Pre-recorded response matched', [
                'call_id' => $callId,
                'response_id' => $matchedResponse->id,
                'response_category' => $matchedResponse->category,
            ]);
        }
    }

    /**
     * Handle function call event
     */
    private function handleFunctionCall(array $event): void
    {
        $functionCall = $event['functionCall'] ?? $event['message']['functionCall'] ?? [];
        $callId = $event['call']['id'] ?? null;

        if (!$callId) {
            return;
        }

        $phoneCall = UrpaPhoneCall::where('vapi_call_id', $callId)->first();
        if (!$phoneCall) {
            return;
        }

        $user = User::find($phoneCall->user_id);
        if (!$user) {
            return;
        }

        $functionName = $functionCall['name'] ?? null;
        $functionParams = $functionCall['parameters'] ?? [];

        if (!$functionName) {
            return;
        }

        try {
            // Execute function
            $result = $this->functionCallService->executeFunction($functionName, $functionParams, $user);

            // Track actions taken
            $actions = $phoneCall->actions_taken ?? [];
            $actionDescription = $functionName;
            if (isset($result['message'])) {
                $actionDescription .= ': ' . $result['message'];
            }
            $actions[] = $actionDescription;
            
            $phoneCall->update([
                'actions_taken' => $actions,
            ]);

            Log::info('Function call executed', [
                'call_id' => $callId,
                'function' => $functionName,
                'result' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('Function call execution failed', [
                'call_id' => $callId,
                'function' => $functionName,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

