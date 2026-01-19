<?php

namespace App\Modules\Core\Controllers;

use App\Modules\Core\Models\User;
use App\Modules\Core\Traits\ApiResponses;
use App\Modules\Urpa\Models\UrpaUserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends \App\Http\Controllers\Controller
{
    use ApiResponses;

    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        if (!$secret) {
            return $this->error('Stripe webhook secret not configured', 500);
        }

        try {
            $event = Webhook::constructEvent($payload, $signature, $secret);
        } catch (SignatureVerificationException $e) {
            Log::warning('Stripe webhook signature verification failed.');
            return $this->error('Invalid signature', 400);
        } catch (\Exception $e) {
            Log::warning('Stripe webhook error: ' . $e->getMessage());
            return $this->error('Invalid payload', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $this->handleCheckoutCompleted($event->data->object);
        }

        return response()->json(['received' => true]);
    }

    protected function handleCheckoutCompleted($session): void
    {
        $metadata = $session->metadata ?? [];
        $userId = $metadata->user_id ?? null;
        $appContext = $metadata->app_context ?? null;
        $planId = $metadata->plan_id ?? null;
        $billingPeriod = $metadata->billing_period ?? 'monthly';
        $addons = json_decode($metadata->addons ?? '[]', true) ?: [];
        $teamId = $metadata->team_id ?? null;

        if (!$userId || !$planId) {
            Log::warning('Stripe webhook missing metadata', ['metadata' => $metadata]);
            return;
        }

        $stripe = new StripeClient(config('services.stripe.secret'));
        $subscriptionId = $session->subscription ?? null;
        $subscription = null;

        if ($subscriptionId) {
            try {
                $subscription = $stripe->subscriptions->retrieve($subscriptionId);
            } catch (\Exception $e) {
                Log::warning('Failed to retrieve Stripe subscription: ' . $e->getMessage());
            }
        }

        $periodEnd = $subscription?->current_period_end
            ? now()->setTimestamp($subscription->current_period_end)
            : null;
        $periodStart = $subscription?->current_period_start
            ? now()->setTimestamp($subscription->current_period_start)
            : null;

        $user = User::find($userId);
        if ($user) {
            $user->update([
                'plan' => $planId,
                'plan_expires_at' => $periodEnd,
                'stripe_customer_id' => $session->customer ?? $user->stripe_customer_id,
            ]);
        }

        if ($appContext === 'urpa') {
            $profile = UrpaUserProfile::firstOrCreate(
                ['user_id' => $userId],
                ['subscription_tier' => $planId, 'subscription_status' => 'active']
            );

            $profile->update([
                'subscription_tier' => $planId,
                'subscription_status' => 'active',
                'subscription_started_at' => $periodStart,
                'subscription_ends_at' => $periodEnd,
                'has_text_assistant' => in_array('texting', $addons, true),
                'has_phone_assistant' => in_array('phone', $addons, true),
            ]);
        }

        if ($appContext === 'scanner' && $teamId) {
            DB::table('subscriptions')->updateOrInsert(
                ['team_id' => $teamId],
                [
                    'plan' => $planId,
                    'status' => 'active',
                    'stripe_subscription_id' => $subscriptionId,
                    'stripe_customer_id' => $session->customer,
                    'current_period_start' => $periodStart,
                    'current_period_end' => $periodEnd,
                    'metadata' => json_encode([
                        'billing_period' => $billingPeriod,
                        'addons' => $addons,
                    ]),
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}



