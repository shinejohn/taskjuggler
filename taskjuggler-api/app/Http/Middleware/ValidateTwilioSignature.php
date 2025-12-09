<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateTwilioSignature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip validation if disabled in config
        if (!config('services.twilio.verify_signature', true)) {
            return $next($request);
        }

        $authToken = config('services.twilio.token');
        $url = $request->fullUrl();
        $params = $request->all();
        
        // Remove signature from params for validation
        $signature = $params['Signature'] ?? '';
        unset($params['Signature']);

        // Sort parameters
        ksort($params);

        // Build signature string
        $data = $url;
        foreach ($params as $key => $value) {
            $data .= $key . $value;
        }

        // Generate expected signature
        $expectedSignature = base64_encode(hash_hmac('sha1', $data, $authToken, true));

        // Compare signatures
        if (!hash_equals($expectedSignature, $signature)) {
            return response('Invalid signature', 403);
        }

        return $next($request);
    }
}
