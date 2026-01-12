<?php

namespace App\Modules\Urpa\Services;

use App\Services\AI\OpenRouterService;
use App\Modules\Urpa\Models\UrpaAiSession;
use App\Modules\Urpa\Models\UrpaAiMessage;
use App\Modules\Urpa\Models\UrpaAiTask;
use App\Modules\Urpa\Models\UrpaUserProfile;
use App\Modules\Urpa\Models\UrpaContact;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AiService
{
    public function __construct(
        private OpenRouterService $openRouter,
        private ContextBuilderService $contextBuilder
    ) {}

    /**
     * Process AI chat message and generate response
     */
    public function processMessage(UrpaAiSession $session, string $userMessage, ?string $persona = null, ?UrpaContact $contact = null): string
    {
        $user = User::find($session->user_id);
        if (!$user) {
            return 'I apologize, but I encountered an error processing your request.';
        }

        $profile = UrpaUserProfile::where('user_id', $session->user_id)->first();
        $personaUsed = $persona ?? $profile->default_persona ?? 'professional';

        // Build rich context
        $context = $this->contextBuilder->buildCallContext($user, $contact);

        // Build context from session history
        $messages = UrpaAiMessage::where('session_id', $session->id)
            ->orderBy('created_at', 'asc')
            ->limit(20) // Last 20 messages for context
            ->get();

        // Build enhanced system prompt with rich context
        $systemPrompt = $this->contextBuilder->buildSystemPrompt($user, $context, $personaUsed);
        
        $chatMessages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        foreach ($messages as $msg) {
            $chatMessages[] = [
                'role' => $msg->role,
                'content' => $msg->content,
            ];
        }

        $chatMessages[] = [
            'role' => 'user',
            'content' => $userMessage,
        ];

        try {
            $response = $this->openRouter->chat(
                messages: $chatMessages,
                model: config('services.openrouter.default_model', 'openai/gpt-4o'),
                temperature: 0.7,
                maxTokens: 2000
            );

            $aiResponse = $response['choices'][0]['message']['content'] ?? 'I apologize, but I could not generate a response.';

            // Extract tasks from response if mentioned
            $this->extractTasksFromResponse($session, $aiResponse);

            // Store token usage in session metadata for tracking
            $usage = $response['usage'] ?? [];
            $session->metadata = array_merge($session->metadata ?? [], [
                'last_input_tokens' => $usage['prompt_tokens'] ?? $usage['input_tokens'] ?? 0,
                'last_output_tokens' => $usage['completion_tokens'] ?? $usage['output_tokens'] ?? 0,
            ]);
            $session->save();

            return $aiResponse;
        } catch (\Exception $e) {
            Log::error('AI service error', [
                'error' => $e->getMessage(),
                'session_id' => $session->id,
            ]);
            return 'I apologize, but I encountered an error processing your request. Please try again.';
        }
    }

    /**
     * Process call message with context (for phone calls)
     */
    public function processCallMessage(User $user, string $transcript, array $context): string
    {
        $profile = UrpaUserProfile::where('user_id', $user->id)->first();
        $personaUsed = $profile->default_persona ?? 'professional';

        // Build enhanced system prompt
        $systemPrompt = $this->contextBuilder->buildSystemPrompt($user, $context, $personaUsed);

        try {
            $response = $this->openRouter->chat(
                messages: [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $transcript],
                ],
                model: config('services.openrouter.default_model', 'openai/gpt-4o'),
                temperature: 0.5, // Lower temperature for phone calls
                maxTokens: 500, // Shorter responses for phone
            );

            return $response['choices'][0]['message']['content'] ?? 'I apologize, but I could not generate a response.';
        } catch (\Exception $e) {
            Log::error('AI call message error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
            return 'I apologize, but I encountered an error. Please try again.';
        }
    }

    /**
     * Generate artifact using AI
     */
    public function generateArtifact(
        UrpaAiSession $session,
        string $type,
        string $title,
        string $prompt,
        ?string $language = null
    ): string {
        $systemPrompt = match($type) {
            'code' => "You are an expert programmer. Generate clean, well-documented code.",
            'document' => "You are a technical writer. Generate clear, professional documentation.",
            'image' => "You are a creative designer. Generate detailed image descriptions.",
            default => "You are a helpful assistant. Generate high-quality content.",
        };

        $userPrompt = match($type) {
            'code' => "Generate {$language} code for: {$title}\n\nRequirements:\n{$prompt}",
            'document' => "Create documentation for: {$title}\n\nContent:\n{$prompt}",
            default => "Create {$type} content for: {$title}\n\nDetails:\n{$prompt}",
        };

        try {
            $response = $this->openRouter->chat(
                messages: [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
                model: config('services.openrouter.default_model', 'openai/gpt-4o'),
                temperature: 0.7,
                maxTokens: 4000
            );

            return $response['choices'][0]['message']['content'] ?? '';
        } catch (\Exception $e) {
            Log::error('AI artifact generation error', [
                'error' => $e->getMessage(),
                'session_id' => $session->id,
                'type' => $type,
            ]);
            throw $e;
        }
    }

    /**
     * Generate AI summary from transcript
     */
    public function generateCallSummary(string $transcript): string
    {
        try {
            $response = $this->openRouter->chat(
                messages: [
                    [
                        'role' => 'system',
                        'content' => 'You are a helpful assistant that summarizes phone call transcripts concisely.',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Summarize this phone call transcript:\n\n{$transcript}",
                    ],
                ],
                model: config('services.openrouter.default_model', 'openai/gpt-4o'),
                temperature: 0.3,
                maxTokens: 500
            );

            return $response['choices'][0]['message']['content'] ?? 'No summary available.';
        } catch (\Exception $e) {
            Log::error('AI summary generation error', [
                'error' => $e->getMessage(),
            ]);
            return 'Unable to generate summary.';
        }
    }

    /**
     * Extract tasks from transcript or message
     */
    public function extractTasksFromTranscript(string $userId, string $transcript, ?string $sessionId = null): array
    {
        try {
            $response = $this->openRouter->extractJson(
                messages: [
                    [
                        'role' => 'system',
                        'content' => 'Extract actionable tasks from the conversation. Return JSON array of tasks with title, description, and priority (low/medium/high/urgent).',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Extract tasks from this transcript:\n\n{$transcript}",
                    ],
                ],
                model: config('services.openrouter.extraction_model', 'openai/gpt-4o')
            );

            $tasks = $response['tasks'] ?? [];

            $createdTasks = [];
            foreach ($tasks as $taskData) {
                $task = UrpaAiTask::create([
                    'user_id' => $userId,
                    'session_id' => $sessionId,
                    'title' => $taskData['title'] ?? 'Untitled Task',
                    'description' => $taskData['description'] ?? null,
                    'priority' => $taskData['priority'] ?? 'medium',
                    'status' => 'pending',
                    'source_type' => 'call_transcript',
                    'source_id' => $sessionId,
                ]);
                $createdTasks[] = $task;
            }

            return $createdTasks;
        } catch (\Exception $e) {
            Log::error('AI task extraction error', [
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Extract tasks from AI response message
     */
    private function extractTasksFromResponse(UrpaAiSession $session, string $response): void
    {
        // Simple pattern matching for task mentions
        // Could be enhanced with AI extraction if needed
        if (preg_match_all('/\[TASK:\s*(.+?)\]/i', $response, $matches)) {
            foreach ($matches[1] as $taskTitle) {
                UrpaAiTask::create([
                    'user_id' => $session->user_id,
                    'session_id' => $session->id,
                    'title' => trim($taskTitle),
                    'status' => 'pending',
                    'source_type' => 'ai_chat',
                    'source_id' => $session->id,
                ]);
            }
        }
    }

    /**
     * Build system prompt based on persona
     * @deprecated Use ContextBuilderService::buildSystemPrompt() instead
     */
    private function buildSystemPrompt(string $persona, ?UrpaUserProfile $profile): string
    {
        // This method is kept for backward compatibility
        // New code should use ContextBuilderService::buildSystemPrompt()
        $basePrompt = "You are URPA, a Universal Remote Personal Assistant. ";

        $personaPrompts = [
            'professional' => "Maintain a professional, courteous tone. Be concise and efficient.",
            'friendly' => "Be warm, friendly, and conversational. Show genuine interest.",
            'executive' => "Be direct, strategic, and focused on high-level priorities.",
            'creative' => "Be imaginative, inspiring, and open to creative solutions.",
        ];

        $personaPrompt = $personaPrompts[$persona] ?? $personaPrompts['professional'];

        $capabilities = "You can help with: scheduling, task management, email composition, research, content creation, and general assistance.";

        return $basePrompt . $personaPrompt . " " . $capabilities;
    }
}

