<?php

namespace App\Modules\Communications\Services\Contracts;

interface SmsServiceInterface
{
    /**
     * Send SMS
     */
    public function sendSms(string $to, string $message, ?string $from = null): array;

    /**
     * Send bulk SMS
     */
    public function sendBulkSms(array $recipients, string $message, ?string $from = null): array;

    /**
     * Handle inbound SMS
     */
    public function handleInboundSms(array $message): void;
}

