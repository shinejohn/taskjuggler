<?php

declare(strict_types=1);

namespace App\Modules\Urpa\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class PipecatBridgeService
{
    public function isEnabled(): bool
    {
        return (bool) config('pipecat.enabled')
            && is_string(config('pipecat.agent_url'))
            && config('pipecat.agent_url') !== '';
    }

    public function shouldReplaceVapi(): bool
    {
        return $this->isEnabled() && (bool) config('pipecat.replace_vapi');
    }

    /**
     * Start a voice session on the Pipecat agent (LiveKit room + STT/LLM/TTS pipeline).
     *
     * @param array<string, mixed> $config
     * @return array<string, mixed>
     */
    public function startVoiceSession(array $config): array
    {
        if (! $this->isEnabled()) {
            throw new \RuntimeException('Pipecat is not enabled');
        }

        $url = rtrim((string) config('pipecat.agent_url'), '/');

        $response = Http::timeout(30)
            ->withHeaders($this->authHeaders())
            ->post("{$url}/v1/sessions/start", [
                'room_name' => $config['room_name'] ?? null,
                'customer_number' => $config['customer_number'] ?? null,
                'user_id' => $config['user_id'] ?? null,
                'assistant_id' => $config['assistant_id'] ?? null,
                'metadata' => $config['metadata'] ?? [],
            ]);

        if ($response->failed()) {
            Log::error('Pipecat session start failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException('Failed to start Pipecat voice session');
        }

        return $response->json();
    }

    /**
     * @return array<string, string>
     */
    private function authHeaders(): array
    {
        $headers = ['Content-Type' => 'application/json'];
        $secret = config('pipecat.webhook_secret');
        if ($secret) {
            $headers['X-Pipecat-Secret'] = $secret;
        }

        return $headers;
    }
}
