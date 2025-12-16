<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateSendGridSignature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // SendGrid webhook signature validation
        // Note: SendGrid uses different signature validation methods
        // For inbound parse webhooks, signature validation is optional
        // but recommended for production
        
        // For now, we'll validate based on configured secret if available
        $secret = config('services.sendgrid.webhook_secret');
        
        if ($secret) {
            $signature = $request->header('X-Twilio-Email-Event-Webhook-Signature');
            $timestamp = $request->header('X-Twilio-Email-Event-Webhook-Timestamp');
            $body = $request->getContent();
            
            // Validate timestamp (prevent replay attacks)
            if ($timestamp && abs(time() - (int)$timestamp) > 600) {
                return response('Request too old', 403);
            }
            
            // Generate expected signature
            $payload = $timestamp . $body;
            $expectedSignature = hash_hmac('sha256', $payload, $secret);
            
            // Compare signatures
            if ($signature && !hash_equals($expectedSignature, $signature)) {
                return response('Invalid signature', 403);
            }
        }

        return $next($request);
    }
}
