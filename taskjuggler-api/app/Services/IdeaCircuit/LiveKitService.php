<?php

declare(strict_types=1);

namespace App\Services\IdeaCircuit;

use App\Models\IdeaCircuit\Meeting;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class LiveKitService
{
    public function isEnabled(): bool
    {
        return (bool) config('livekit.enabled')
            && config('livekit.url')
            && config('livekit.api_key')
            && config('livekit.api_secret');
    }

    public function roomNameForMeeting(Meeting $meeting): string
    {
        if ($meeting->livekit_room_name) {
            return $meeting->livekit_room_name;
        }

        $name = 'ideacircuit-'.str_replace('-', '', (string) $meeting->id);
        $meeting->update(['livekit_room_name' => $name]);

        return $name;
    }

    /**
     * @return array{url: string, token: string, room_name: string, identity: string}
     */
    public function joinCredentials(Meeting $meeting, User $user): array
    {
        $roomName = $this->roomNameForMeeting($meeting);
        $identity = (string) $user->id;

        return [
            'url' => (string) config('livekit.url'),
            'token' => $this->generateAccessToken($roomName, $identity, $user->name ?? 'Participant'),
            'room_name' => $roomName,
            'identity' => $identity,
        ];
    }

    /**
     * @return array{room_name: string, token: string, url: string}
     */
    public function agentJoinCredentials(string $roomName, string $identity = 'pipecat-agent'): array
    {
        return [
            'url' => (string) config('livekit.url'),
            'token' => $this->generateAccessToken($roomName, $identity, 'AI Agent', canPublish: true),
            'room_name' => $roomName,
        ];
    }

    public function deleteRoom(string $roomName): void
    {
        if (! $this->isEnabled()) {
            return;
        }

        $host = rtrim(str_replace(['wss://', 'ws://'], ['https://', 'http://'], (string) config('livekit.url')), '/');

        Http::withHeaders([
            'Authorization' => 'Bearer '.$this->generateServerAdminToken(),
        ])->post("{$host}/twirp/livekit.RoomService/DeleteRoom", [
            'room' => $roomName,
        ]);
    }

    private function generateAccessToken(
        string $roomName,
        string $identity,
        string $displayName,
        bool $canPublish = true
    ): string {
        $apiKey = (string) config('livekit.api_key');
        $apiSecret = (string) config('livekit.api_secret');
        $now = time();
        $ttl = (int) config('livekit.token_ttl', 3600);

        $payload = [
            'iss' => $apiKey,
            'sub' => $identity,
            'iat' => $now,
            'nbf' => $now,
            'exp' => $now + $ttl,
            'name' => $displayName,
            'video' => [
                'roomJoin' => true,
                'room' => $roomName,
                'canPublish' => $canPublish,
                'canSubscribe' => true,
            ],
        ];

        return $this->signJwt($payload, $apiSecret);
    }

    private function generateServerAdminToken(): string
    {
        $apiKey = (string) config('livekit.api_key');
        $apiSecret = (string) config('livekit.api_secret');
        $now = time();

        return $this->signJwt([
            'iss' => $apiKey,
            'sub' => 'server-admin',
            'iat' => $now,
            'nbf' => $now,
            'exp' => $now + 300,
            'video' => ['roomAdmin' => true, 'roomCreate' => true],
        ], $apiSecret);
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function signJwt(array $payload, string $secret): string
    {
        $header = $this->base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'], JSON_THROW_ON_ERROR));
        $body = $this->base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR));
        $signingInput = "{$header}.{$body}";
        $signature = $this->base64UrlEncode(hash_hmac('sha256', $signingInput, $secret, true));

        return "{$signingInput}.{$signature}";
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
