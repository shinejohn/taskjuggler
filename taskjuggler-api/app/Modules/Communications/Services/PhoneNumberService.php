<?php

namespace App\Modules\Communications\Services;

use App\Modules\Communications\Services\Contracts\PhoneNumberServiceInterface;
use App\Models\User;

/**
 * Abstract phone number service factory
 * Selects provider based on configuration
 */
class PhoneNumberService
{
    private PhoneNumberServiceInterface $provider;

    public function __construct()
    {
        $providerType = config('services.phone_number.provider', 'twilio');
        
        $this->provider = match($providerType) {
            'twilio' => app(TwilioPhoneNumberService::class),
            'aws' => app(AwsPhoneNumberService::class),
            default => app(TwilioPhoneNumberService::class),
        };
    }

    /**
     * Provision a phone number
     */
    public function provisionNumber(User $user, ?string $region = null): array
    {
        return $this->provider->provisionNumber($user, $region);
    }

    /**
     * Release a phone number
     */
    public function releaseNumber(string $numberId): bool
    {
        return $this->provider->releaseNumber($numberId);
    }

    /**
     * Update phone number configuration
     */
    public function updateNumberConfig(string $numberId, array $config): bool
    {
        return $this->provider->updateNumberConfig($numberId, $config);
    }

    /**
     * Get phone number details
     */
    public function getNumber(string $numberId): ?array
    {
        return $this->provider->getNumber($numberId);
    }
}

