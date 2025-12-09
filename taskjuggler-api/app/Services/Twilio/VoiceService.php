<?php

namespace App\Services\Twilio;

use Twilio\Rest\Client;
use App\Models\AssistantChannel;

class VoiceService
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
    }

    public function initiateCall(AssistantChannel $channel, string $to, string $from = null): string
    {
        $from = $from ?? $channel->phone_number;

        $call = $this->client->calls->create(
            $to,
            $from,
            [
                'url' => route('webhooks.twilio.voice', ['user' => $channel->user_id]),
                'method' => 'POST',
            ]
        );

        return $call->sid;
    }

    public function getRecording(string $recordingSid): array
    {
        $recording = $this->client->recordings($recordingSid)->fetch();
        
        return [
            'sid' => $recording->sid,
            'duration' => $recording->duration,
            'url' => $recording->uri,
        ];
    }

    public function getTranscription(string $transcriptionSid): string
    {
        $transcription = $this->client->transcriptions($transcriptionSid)->fetch();
        return $transcription->transcriptionText;
    }
}
