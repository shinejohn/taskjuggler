<?php

namespace App\Modules\Communications\Services;

use App\Modules\Communications\Services\Contracts\PhoneNumberServiceInterface;
use App\Models\User;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class TwilioPhoneNumberService implements PhoneNumberServiceInterface
{
    private Client $client;
    private string $countryCode;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
        $this->countryCode = config('services.twilio.country_code', 'US');
    }

    /**
     * Provision a phone number from Twilio
     */
    public function provisionNumber(User $user, ?string $region = null): array
    {
        try {
            $country = $region ?? $this->countryCode;

            // Search for available phone numbers
            $availableNumbers = $this->client->availablePhoneNumbers($country)
                ->local
                ->read(['limit' => 1]);

            if (empty($availableNumbers)) {
                throw new \Exception('No available phone numbers in region: ' . $country);
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
                'number_id' => $incomingPhoneNumber->sid,
                'provider' => 'twilio',
                'region' => $country,
            ];
        } catch (\Exception $e) {
            Log::error('Twilio phone provisioning failed', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
            throw $e;
        }
    }

    /**
     * Release a phone number
     */
    public function releaseNumber(string $numberId): bool
    {
        try {
            $this->client->incomingPhoneNumbers($numberId)->delete();
            return true;
        } catch (\Exception $e) {
            Log::error('Twilio phone release failed', [
                'error' => $e->getMessage(),
                'number_id' => $numberId,
            ]);
            return false;
        }
    }

    /**
     * Update phone number configuration
     */
    public function updateNumberConfig(string $numberId, array $config): bool
    {
        try {
            $updateParams = [];

            if (isset($config['voice_url'])) {
                $updateParams['voiceUrl'] = $config['voice_url'];
            }
            if (isset($config['voice_method'])) {
                $updateParams['voiceMethod'] = $config['voice_method'];
            }
            if (isset($config['status_callback'])) {
                $updateParams['statusCallback'] = $config['status_callback'];
            }
            if (isset($config['status_callback_method'])) {
                $updateParams['statusCallbackMethod'] = $config['status_callback_method'];
            }

            if (!empty($updateParams)) {
                $this->client->incomingPhoneNumbers($numberId)->update($updateParams);
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Twilio phone config update failed', [
                'error' => $e->getMessage(),
                'number_id' => $numberId,
            ]);
            return false;
        }
    }

    /**
     * Get phone number details
     */
    public function getNumber(string $numberId): ?array
    {
        try {
            $number = $this->client->incomingPhoneNumbers($numberId)->fetch();

            return [
                'number_id' => $number->sid,
                'phone_number' => $number->phoneNumber,
                'voice_url' => $number->voiceUrl,
                'voice_method' => $number->voiceMethod,
                'status_callback' => $number->statusCallback,
                'provider' => 'twilio',
            ];
        } catch (\Exception $e) {
            Log::error('Twilio get number failed', [
                'error' => $e->getMessage(),
                'number_id' => $numberId,
            ]);
            return null;
        }
    }
}

