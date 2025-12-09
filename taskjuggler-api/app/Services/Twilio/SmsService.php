<?php

namespace App\Services\Twilio;

use Twilio\Rest\Client;
use App\Models\AssistantChannel;

class SmsService
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
    }

    public function sendSms(AssistantChannel $channel, string $to, string $message, string $from = null): string
    {
        $from = $from ?? $channel->phone_number;

        $message = $this->client->messages->create(
            $to,
            [
                'from' => $from,
                'body' => $message,
            ]
        );

        return $message->sid;
    }

    public function sendAutoResponse(AssistantChannel $channel, string $to, string $message): string
    {
        return $this->sendSms($channel, $to, $message);
    }
}
