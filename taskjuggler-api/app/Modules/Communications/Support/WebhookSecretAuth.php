<?php

declare(strict_types=1);

namespace App\Modules\Communications\Support;

use Illuminate\Http\Request;

final class WebhookSecretAuth
{
    /**
     * @param  non-empty-string  $configKey  e.g. pipecat.webhook_secret
     */
    public static function authorized(Request $request, string $configKey, string $headerName): bool
    {
        $secret = config($configKey);
        if (! is_string($secret) || $secret === '') {
            return ! app()->isProduction();
        }

        return hash_equals($secret, (string) $request->header($headerName, ''));
    }
}
