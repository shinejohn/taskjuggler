<?php

namespace App\Modules\Urpa\Services;

use App\Models\User;
use App\Modules\Urpa\Models\UrpaContact;
use App\Modules\Urpa\Models\UrpaIntegration;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VapiAssistantService
{
    private string $apiKey;
    private string $apiUrl = 'https://api.vapi.ai';

    public function __construct(
        private ContextBuilderService $contextBuilder,
        private FunctionCallService $functionCallService,
        private VoiceResponseService $voiceResponseService
    ) {
        $this->apiKey = config('services.vapi.api_key', env('VAPI_API_KEY'));
    }

    /**
     * Create or update Vapi assistant for a user
     */
    public function createOrUpdateAssistant(User $user, array $config = []): string
    {
        // Build rich context
        $context = $this->contextBuilder->buildCallContext($user);
        
        // Build enhanced system prompt
        $systemPrompt = $this->contextBuilder->buildSystemPrompt(
            $user,
            $context,
            $config['persona'] ?? 'professional'
        );

        // Get available functions
        $functions = $this->functionCallService->getAvailableFunctions();

        // Get available pre-recorded responses
        $prerecordedResponses = $this->voiceResponseService->getAvailableResponses('phone_call');

        // Build assistant configuration
        $assistantConfig = [
            'name' => $config['name'] ?? "URPA Assistant for {$user->name}",
            'model' => [
                'provider' => 'openai',
                'model' => $config['model'] ?? 'gpt-4o',
                'temperature' => $config['temperature'] ?? 0.3,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->enhanceSystemPromptWithResponses($systemPrompt, $prerecordedResponses),
                    ],
                ],
            ],
            'voice' => [
                'provider' => $config['voice_provider'] ?? '11labs',
                'voiceId' => $config['voice_id'] ?? '21m00Tcm4TlvDq8ikWAM', // Default voice
            ],
            'firstMessage' => $this->getFirstMessage($prerecordedResponses),
            'functions' => $this->formatFunctionsForVapi($functions),
            'serverUrl' => config('app.url') . '/api/urpa/voice/vapi/webhook',
            'serverUrlSecret' => config('services.vapi.webhook_secret', env('VAPI_WEBHOOK_SECRET')),
        ];

        // Check if assistant already exists
        $existingAssistantId = $this->getExistingAssistantId($user);
        
        if ($existingAssistantId) {
            return $this->updateAssistant($existingAssistantId, $assistantConfig);
        }

        return $this->createAssistant($assistantConfig);
    }

    /**
     * Configure assistant for a specific call
     */
    public function configureForCall(User $user, ?UrpaContact $contact = null): array
    {
        // Build call-specific context
        $context = $this->contextBuilder->buildCallContext($user, $contact);
        
        // Build enhanced system prompt with call context
        $systemPrompt = $this->contextBuilder->buildSystemPrompt(
            $user,
            $context,
            'professional'
        );

        // Get available pre-recorded responses
        $prerecordedResponses = $this->voiceResponseService->getAvailableResponses('phone_call');

        return [
            'systemPrompt' => $this->enhanceSystemPromptWithResponses($systemPrompt, $prerecordedResponses),
            'firstMessage' => $this->getFirstMessage($prerecordedResponses, $contact),
            'context' => $context,
        ];
    }

    /**
     * Enhance system prompt with pre-recorded response hints
     */
    private function enhanceSystemPromptWithResponses(string $systemPrompt, array $responses): string
    {
        if (empty($responses)) {
            return $systemPrompt;
        }

        $responseHints = "\n\nPRE-RECORDED RESPONSES AVAILABLE:\n";
        $responseHints .= "You have access to pre-recorded audio responses. Use these when possible to save costs and provide more natural-sounding responses.\n";
        $responseHints .= "Available response categories: " . implode(', ', array_unique(array_column($responses, 'category'))) . "\n";
        $responseHints .= "When a user's input matches a pre-recorded response intent or trigger phrase, indicate you're using a pre-recorded response.\n";
        $responseHints .= "Pre-recorded responses are preferred over generating new TTS when the match confidence is high (>70%).\n";

        return $systemPrompt . $responseHints;
    }

    /**
     * Get first message (greeting) - prefer pre-recorded
     */
    private function getFirstMessage(array $prerecordedResponses, ?UrpaContact $contact = null): string
    {
        // Try to find a greeting response
        $greetingResponses = array_filter($prerecordedResponses, fn($r) => $r['category'] === 'greeting');
        
        if (!empty($greetingResponses)) {
            $timeOfDay = $this->getTimeOfDay();
            $timeSpecificGreeting = array_filter($greetingResponses, function($r) use ($timeOfDay) {
                return isset($r['intent']) && str_contains($r['intent'], $timeOfDay);
            });
            
            if (!empty($timeSpecificGreeting)) {
                $greeting = reset($timeSpecificGreeting);
                return $greeting['text_content'] ?? "Hello! How can I help you today?";
            }
            
            $generalGreeting = reset($greetingResponses);
            return $generalGreeting['text_content'] ?? "Hello! How can I help you today?";
        }

        // Fallback to generic greeting
        if ($contact && $contact->first_name) {
            $user = \App\Models\User::find($contact->user_id);
            $userName = $user ? $user->name : 'your';
            return "Hello {$contact->first_name}! This is {$userName}'s assistant. How can I help you today?";
        }

        return "Hello! This is URPA, your personal assistant. How can I help you today?";
    }

    /**
     * Format functions for Vapi API
     */
    private function formatFunctionsForVapi(array $functions): array
    {
        $formatted = [];

        foreach ($functions as $name => $config) {
            $formatted[] = [
                'name' => $name,
                'description' => $config['description'],
                'parameters' => [
                    'type' => 'object',
                    'properties' => $this->formatParameters($config['parameters']),
                    'required' => array_keys(array_filter($config['parameters'], fn($p) => $p['required'] ?? false)),
                ],
                'async' => false,
            ];
        }

        return $formatted;
    }

    /**
     * Format function parameters
     */
    private function formatParameters(array $parameters): array
    {
        $formatted = [];

        foreach ($parameters as $name => $config) {
            $formatted[$name] = [
                'type' => $config['type'],
                'description' => $config['description'],
            ];
        }

        return $formatted;
    }

    /**
     * Create assistant via Vapi API
     */
    private function createAssistant(array $config): string
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/assistant', $config);

            if ($response->failed()) {
                Log::error('Vapi assistant creation failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new \Exception('Failed to create Vapi assistant');
            }

            $assistant = $response->json();
            return $assistant['id'] ?? '';
        } catch (\Exception $e) {
            Log::error('Vapi assistant creation error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Update assistant via Vapi API
     */
    private function updateAssistant(string $assistantId, array $config): string
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->put($this->apiUrl . '/assistant/' . $assistantId, $config);

            if ($response->failed()) {
                Log::error('Vapi assistant update failed', [
                    'assistant_id' => $assistantId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new \Exception('Failed to update Vapi assistant');
            }

            return $assistantId;
        } catch (\Exception $e) {
            Log::error('Vapi assistant update error', [
                'assistant_id' => $assistantId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get existing assistant ID for user (stored in integration or user profile)
     */
    private function getExistingAssistantId(User $user): ?string
    {
        // Check if stored in integration config
        $integration = UrpaIntegration::where('user_id', $user->id)
            ->where('integration_type', 'phone')
            ->where('provider', 'vapi')
            ->first();

        if ($integration && isset($integration->config['vapi_assistant_id'])) {
            return $integration->config['vapi_assistant_id'];
        }

        return null;
    }

    /**
     * Get time of day
     */
    private function getTimeOfDay(): string
    {
        $hour = (int) now()->format('H');
        
        if ($hour >= 5 && $hour < 12) {
            return 'morning';
        } elseif ($hour >= 12 && $hour < 17) {
            return 'afternoon';
        } elseif ($hour >= 17 && $hour < 21) {
            return 'evening';
        } else {
            return 'night';
        }
    }

    /**
     * Get assistant configuration
     */
    public function getAssistantConfig(string $assistantId): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->apiUrl . '/assistant/' . $assistantId);

            if ($response->failed()) {
                return null;
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Failed to get Vapi assistant config', [
                'assistant_id' => $assistantId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}

