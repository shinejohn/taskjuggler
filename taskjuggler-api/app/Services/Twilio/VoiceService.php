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

    /**
     * Provision a new phone number from Twilio
     */
    public function provisionPhoneNumber(\App\Models\User $user): array
    {
        try {
            // Search for available phone numbers
            $availableNumbers = $this->client->availablePhoneNumbers(config('services.twilio.country_code', 'US'))
                ->local
                ->read(['limit' => 1]);

            if (empty($availableNumbers)) {
                throw new \Exception('No available phone numbers');
            }

            $phoneNumber = $availableNumbers[0]->phoneNumber;

            // Purchase the phone number
            $incomingPhoneNumber = $this->client->incomingPhoneNumbers->create([
                'phoneNumber' => $phoneNumber,
                'voiceUrl' => route('webhooks.twilio.voice', ['user' => $user->id]),
                'voiceMethod' => 'POST',
                'statusCallback' => route('webhooks.twilio.recording', ['user' => $user->id]),
                'statusCallbackMethod' => 'POST',
            ]);

            return [
                'phone_number' => $phoneNumber,
                'sid' => $incomingPhoneNumber->sid,
            ];
        } catch (\Exception $e) {
            \Log::error('Twilio phone provisioning failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
