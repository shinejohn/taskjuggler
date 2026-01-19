<?php

namespace App\Modules\Communications\Services\Contracts;

interface CallServiceInterface
{
    /**
     * Initiate an outbound call
     */
    public function initiateCall(string $from, string $to, array $config = []): array;

    /**
     * Handle an inbound call
     */
    public function handleInboundCall(string $contactId, string $callerNumber): array;

    /**
     * Transfer a call
     */
    public function transferCall(string $contactId, string $destination): bool;

    /**
     * End a call
     */
    public function endCall(string $contactId): bool;

    /**
     * Get call status
     */
    public function getCallStatus(string $contactId): ?array;
}

