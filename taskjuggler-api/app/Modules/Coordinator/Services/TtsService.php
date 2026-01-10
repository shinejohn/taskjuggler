<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Urpa\Services\TtsService as UrpaTtsService;

/**
 * TTS Service for Coordinator (4calls.ai)
 * Wraps the shared URPA TTS service to use ElevenLabs
 */
class TtsService
{
    public function __construct(
        private UrpaTtsService $urpaTtsService
    ) {}

    /**
     * Generate audio URL from text using ElevenLabs TTS
     * Uses caching to avoid redundant API calls
     */
    public function generateAudio(string $text, ?string $voiceId = null): string
    {
        // Use the shared URPA TTS service
        // If voiceId is provided, use it; otherwise use default
        return $this->urpaTtsService->generateAudio($text, $voiceId ?? 'default');
    }

    /**
     * Generate audio for a coordinator's voice
     */
    public function generateForCoordinator(string $text, string $coordinatorVoiceId): string
    {
        return $this->urpaTtsService->generateAudio($text, $coordinatorVoiceId);
    }

    /**
     * Batch generate audio for multiple texts
     */
    public function generateBatch(array $texts, ?string $voiceId = null): array
    {
        return $this->urpaTtsService->generateBatch($texts, $voiceId ?? 'default');
    }

    /**
     * Clear TTS cache for a specific text
     */
    public function clearCache(string $text, ?string $voiceId = null): void
    {
        $this->urpaTtsService->clearCache($text, $voiceId ?? 'default');
    }
}

