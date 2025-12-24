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

    /**
     * Send SMS without channel (for notifications)
     */
    public function send(string $to, string $message, string $from = null): bool
    {
        try {
            $from = $from ?? config('services.twilio.from_number');
            
            if (!$from) {
                \Log::error('No Twilio from number configured');
                return false;
            }

            $this->client->messages->create(
                $to,
                [
                    'from' => $from,
                    'body' => $message,
                ]
            );

            return true;
        } catch (\Exception $e) {
            \Log::error('SMS send failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
