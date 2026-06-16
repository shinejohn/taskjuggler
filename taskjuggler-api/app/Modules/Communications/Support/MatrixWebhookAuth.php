<?php

declare(strict_types=1);

namespace App\Modules\Communications\Support;

use Illuminate\Http\Request;

final class MatrixWebhookAuth
{
    /**
     * Validate Application Service bearer token (Dendrite → Laravel transactions).
     */
    public static function appserviceAuthorized(Request $request): bool
    {
        $token = config('matrix.appservice_token');
        if (! is_string($token) || $token === '') {
            return ! self::secretsRequired() && ! app()->isProduction();
        }

        $auth = $request->header('Authorization', '');

        return hash_equals("Bearer {$token}", $auth);
    }

    /**
     * Validate legacy custom webhook (X-Matrix-Webhook-Secret header).
     */
    public static function legacyWebhookAuthorized(Request $request): bool
    {
        $secret = config('matrix.webhook_secret');
        if (! is_string($secret) || $secret === '') {
            return ! self::secretsRequired() && ! app()->isProduction();
        }

        return hash_equals($secret, (string) $request->header('X-Matrix-Webhook-Secret', ''));
    }

    /**
     * When Matrix is enabled in production, at least one inbound auth secret must be configured.
     */
    public static function secretsRequired(): bool
    {
        return (bool) config('matrix.enabled') && app()->isProduction();
    }

    public static function missingProductionSecrets(): bool
    {
        if (! self::secretsRequired()) {
            return false;
        }

        $asToken = config('matrix.appservice_token');
        $webhookSecret = config('matrix.webhook_secret');

        return (! is_string($asToken) || $asToken === '')
            && (! is_string($webhookSecret) || $webhookSecret === '');
    }
}
