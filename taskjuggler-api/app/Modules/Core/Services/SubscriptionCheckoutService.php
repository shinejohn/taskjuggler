<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Models\User;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

class SubscriptionCheckoutService
{
    protected StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    public function createCheckoutSession(
        User $user,
        string $appContext,
        string $planId,
        string $billingPeriod,
        array $addons,
        string $origin,
        ?string $teamId = null
    ): array {
        $prices = config("subscriptions.apps.{$appContext}");
        if (!$prices) {
            throw new \Exception('Unsupported app context.');
        }

        $planPriceId = $prices['plans'][$planId][$billingPeriod] ?? null;
        if (!$planPriceId) {
            throw new \Exception('Invalid plan or billing period.');
        }

        $lineItems = [
            [
                'price' => $planPriceId,
                'quantity' => 1,
            ],
        ];

        if (!empty($addons)) {
            foreach ($addons as $addon) {
                $addonPriceId = $prices['addons'][$addon] ?? null;
                if (!$addonPriceId) {
                    throw new \Exception("Invalid add-on: {$addon}");
                }
                $lineItems[] = [
                    'price' => $addonPriceId,
                    'quantity' => 1,
                ];
            }
        }

        $customerId = $this->getOrCreateCustomer($user);

        $metadata = [
            'user_id' => $user->id,
            'app_context' => $appContext,
            'plan_id' => $planId,
            'billing_period' => $billingPeriod,
            'addons' => json_encode($addons),
        ];

        if ($teamId) {
            $metadata['team_id'] = $teamId;
        }

        try {
            $session = $this->stripe->checkout->sessions->create([
                'mode' => 'subscription',
                'customer' => $customerId,
                'line_items' => $lineItems,
                'success_url' => rtrim($origin, '/') . '/subscribe?success=1&session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => rtrim($origin, '/') . '/subscribe?canceled=1',
                'metadata' => $metadata,
                'subscription_data' => [
                    'metadata' => $metadata,
                ],
                'allow_promotion_codes' => true,
            ]);

            return [
                'checkout_url' => $session->url,
                'session_id' => $session->id,
            ];
        } catch (ApiErrorException $e) {
            Log::error('Stripe checkout session failed: ' . $e->getMessage());
            throw new \Exception('Failed to create checkout session.');
        }
    }

    protected function getOrCreateCustomer(User $user): string
    {
        if ($user->stripe_customer_id) {
            return $user->stripe_customer_id;
        }

        try {
            $customer = $this->stripe->customers->create([
                'email' => $user->email,
                'name' => $user->name,
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);

            $user->update(['stripe_customer_id' => $customer->id]);

            return $customer->id;
        } catch (ApiErrorException $e) {
            Log::error('Failed to create Stripe customer: ' . $e->getMessage());
            throw new \Exception('Failed to create customer.');
        }
    }
}

