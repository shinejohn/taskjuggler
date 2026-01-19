<?php

namespace App\Modules\Communications\Services\Contracts;

use App\Models\User;

interface PhoneNumberServiceInterface
{
    /**
     * Provision a phone number for a user
     */
    public function provisionNumber(User $user, ?string $region = null): array;

    /**
     * Release a phone number
     */
    public function releaseNumber(string $numberId): bool;

    /**
     * Update phone number configuration
     */
    public function updateNumberConfig(string $numberId, array $config): bool;

    /**
     * Get phone number details
     */
    public function getNumber(string $numberId): ?array;
}

