<?php

namespace App\Http\Controllers\IdeaCircuit;

use App\Http\Controllers\Controller;
use App\Models\IdeaCircuit\Meeting;
use App\Models\IdeaCircuit\MeetingMessage;
use App\Services\AI\OpenRouterService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    use AuthorizesRequests;

    protected OpenRouterService $openRouterService;

    public function __construct(OpenRouterService $openRouterService)
    {
        $this->openRouterService = $openRouterService;
    }

    /**
     * AI chat endpoint for meeting context
     */
    public function chat(Request $request)
    {
        $validated = $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:system,user,assistant',
            'messages.*.content' => 'required|string',
            'model' => 'nullable|string',
            'meeting_id' => 'nullable|uuid|exists:ideacircuit_meetings,id',
            'temperature' => 'nullable|numeric|min:0|max:2',
            'max_tokens' => 'nullable|integer|min:1|max:8000',
        ]);

        try {
            // Build messages array
            $messages = $validated['messages'];
            
            // If meeting_id is provided, add meeting context
            if (isset($validated['meeting_id'])) {
                $meeting = Meeting::with(['participants', 'messages', 'notes'])
                    ->findOrFail($validated['meeting_id']);

                // Check authorization
                if ($meeting->user_id !== Auth::id() && 
                    !$meeting->participants->contains('user_id', Auth::id())) {
                    abort(403, 'Unauthorized');
                }

                // Add meeting context as system message if not already present
                $hasSystemMessage = collect($messages)->contains(fn($msg) => $msg['role'] === 'system');
                if (!$hasSystemMessage) {
                    $context = $this->buildMeetingContext($meeting);
                    array_unshift($messages, [
                        'role' => 'system',
                        'content' => $context
                    ]);
                }
            }

            // Call OpenRouter API
            $response = $this->openRouterService->chat(
                messages: $messages,
                model: $validated['model'] ?? null,
                temperature: $validated['temperature'] ?? 0.7,
                maxTokens: $validated['max_tokens'] ?? 4000
            );

            // Extract response
            $aiMessage = $response['choices'][0]['message']['content'] ?? '';
            $model = $response['model'] ?? ($validated['model'] ?? 'unknown');
            $usage = $response['usage'] ?? null;

            // If meeting_id provided, optionally save AI response as message
            if (isset($validated['meeting_id']) && $request->boolean('save_response', false)) {
                $meeting = Meeting::findOrFail($validated['meeting_id']);
                MeetingMessage::create([
                    'meeting_id' => $meeting->id,
                    'user_id' => Auth::id(),
                    'message_text' => $aiMessage,
                    'message_type' => 'ai_response',
                    'is_ai_generated' => true,
                    'metadata' => [
                        'model' => $model,
                        'usage' => $usage,
                    ],
                ]);
            }

            return response()->json([
                'data' => [
                    'message' => $aiMessage,
                    'model' => $model,
                    'usage' => $usage,
                    'full_response' => $response,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('AI Chat Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to process AI request',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Build meeting context for AI
     */
    private function buildMeetingContext(Meeting $meeting): string
    {
        $context = "You are an AI assistant helping with a meeting.\n\n";
        $context .= "Meeting: {$meeting->title}\n";
        
        if ($meeting->description) {
            $context .= "Description: {$meeting->description}\n";
        }

        $context .= "Status: {$meeting->status}\n";
        $context .= "Type: {$meeting->meeting_type}\n\n";

        // Add participants
        if ($meeting->participants->isNotEmpty()) {
            $context .= "Participants:\n";
            foreach ($meeting->participants as $participant) {
                $context .= "- {$participant->name} ({$participant->role})\n";
            }
            $context .= "\n";
        }

        // Add recent messages (last 10)
        if ($meeting->messages->isNotEmpty()) {
            $context .= "Recent Messages:\n";
            $recentMessages = $meeting->messages->take(10);
            foreach ($recentMessages as $message) {
                $sender = $message->user ? $message->user->name : ($message->participant ? $message->participant->name : 'Unknown');
                $context .= "{$sender}: {$message->message_text}\n";
            }
            $context .= "\n";
        }

        // Add notes summary
        if ($meeting->notes->isNotEmpty()) {
            $context .= "Meeting Notes:\n";
            foreach ($meeting->notes as $note) {
                $context .= "- [{$note->category}] {$note->content}\n";
            }
            $context .= "\n";
        }

        $context .= "Please provide helpful, contextual responses based on this meeting information.";

        return $context;
    }
}



