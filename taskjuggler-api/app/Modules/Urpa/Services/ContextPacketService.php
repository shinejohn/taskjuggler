<?php

namespace App\Modules\Urpa\Services;

use App\Models\User;

class ContextPacketService
{
    public function __construct(
        private ContextBuilderService $contextBuilder,
        private FunctionCallService $functionCallService,
        private VoiceResponseService $voiceResponseService
    ) {}

    /**
     * Build structured context packet for AI
     */
    public function buildPacket(User $user, string $scenario, ?\App\Modules\Urpa\Models\UrpaContact $contact = null): array
    {
        // Build context
        $context = $this->contextBuilder->buildCallContext($user, $contact);

        // Get available functions
        $functions = $this->functionCallService->getAvailableFunctions();

        // Get available pre-recorded responses
        $prerecordedResponses = $this->voiceResponseService->getAvailableResponses($scenario);

        return [
            'version' => '1.0',
            'user_id' => $user->id,
            'timestamp' => now()->toIso8601String(),
            'scenario' => $scenario, // 'phone_call', 'chat', 'sms'
            'context' => $context,
            'available_functions' => $functions,
            'pre_recorded_responses' => $prerecordedResponses,
            'metadata' => [
                'timezone' => config('app.timezone', 'UTC'),
                'locale' => config('app.locale', 'en'),
            ],
        ];
    }

    /**
     * Serialize packet to JSON string
     */
    public function serializePacket(array $packet): string
    {
        return json_encode($packet, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Deserialize packet from JSON string
     */
    public function deserializePacket(string $json): array
    {
        return json_decode($json, true);
    }
}

