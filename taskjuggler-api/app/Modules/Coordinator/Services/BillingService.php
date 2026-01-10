<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\Organization;
use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BillingService
{
    protected StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Get or create Stripe customer for organization
     */
    public function getOrCreateCustomer(Organization $organization): string
    {
        if ($organization->stripe_customer_id) {
            return $organization->stripe_customer_id;
        }

        try {
            $customer = $this->stripe->customers->create([
                'email' => $organization->email,
                'name' => $organization->name,
                'metadata' => [
                    'organization_id' => $organization->id,
                ],
            ]);

            $organization->update(['stripe_customer_id' => $customer->id]);

            return $customer->id;
        } catch (ApiErrorException $e) {
            Log::error('Failed to create Stripe customer: ' . $e->getMessage());
            throw new \Exception('Failed to create customer: ' . $e->getMessage());
        }
    }

    /**
     * Create or update subscription
     */
    public function createSubscription(Organization $organization, string $planId): array
    {
        try {
            $customerId = $this->getOrCreateCustomer($organization);

            // Calculate price based on coordinators
            $coordinators = $organization->coordinators()->sum('monthly_price');
            $basePrice = $this->getPlanPrice($planId);

            // Create subscription with usage-based pricing
            $subscription = $this->stripe->subscriptions->create([
                'customer' => $customerId,
                'items' => [
                    [
                        'price' => $basePrice,
                    ],
                ],
                'metadata' => [
                    'organization_id' => $organization->id,
                    'plan' => $planId,
                ],
            ]);

            $organization->update([
                'stripe_subscription_id' => $subscription->id,
                'subscription_tier' => $planId,
                'subscription_status' => $subscription->status,
            ]);

            return [
                'subscription_id' => $subscription->id,
                'status' => $subscription->status,
                'current_period_start' => Carbon::createFromTimestamp($subscription->current_period_start)->toIso8601String(),
                'current_period_end' => Carbon::createFromTimestamp($subscription->current_period_end)->toIso8601String(),
            ];
        } catch (ApiErrorException $e) {
            Log::error('Failed to create subscription: ' . $e->getMessage());
            throw new \Exception('Failed to create subscription: ' . $e->getMessage());
        }
    }

    /**
     * Update payment method
     */
    public function updatePaymentMethod(Organization $organization, string $paymentMethodId): void
    {
        try {
            $customerId = $this->getOrCreateCustomer($organization);

            $this->stripe->paymentMethods->attach($paymentMethodId, [
                'customer' => $customerId,
            ]);

            $this->stripe->customers->update($customerId, [
                'invoice_settings' => [
                    'default_payment_method' => $paymentMethodId,
                ],
            ]);

            $organization->update(['stripe_payment_method_id' => $paymentMethodId]);
        } catch (ApiErrorException $e) {
            Log::error('Failed to update payment method: ' . $e->getMessage());
            throw new \Exception('Failed to update payment method: ' . $e->getMessage());
        }
    }

    /**
     * Cancel subscription
     */
    public function cancelSubscription(Organization $organization, bool $atPeriodEnd = true): void
    {
        try {
            if (!$organization->stripe_subscription_id) {
                throw new \Exception('No active subscription found');
            }

            if ($atPeriodEnd) {
                $this->stripe->subscriptions->update($organization->stripe_subscription_id, [
                    'cancel_at_period_end' => true,
                ]);
                $organization->update(['subscription_status' => 'cancelling']);
            } else {
                $this->stripe->subscriptions->cancel($organization->stripe_subscription_id);
                $organization->update(['subscription_status' => 'cancelled']);
            }
        } catch (ApiErrorException $e) {
            Log::error('Failed to cancel subscription: ' . $e->getMessage());
            throw new \Exception('Failed to cancel subscription: ' . $e->getMessage());
        }
    }

    /**
     * Get billing history
     */
    public function getBillingHistory(Organization $organization): array
    {
        try {
            $customerId = $this->getOrCreateCustomer($organization);

            $invoices = $this->stripe->invoices->all([
                'customer' => $customerId,
                'limit' => 12,
            ]);

            return array_map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'date' => Carbon::createFromTimestamp($invoice->created)->toIso8601String(),
                    'amount' => $invoice->amount_paid / 100, // Convert from cents
                    'status' => $invoice->status,
                    'description' => $invoice->description ?? 'Monthly subscription',
                ];
            }, $invoices->data);
        } catch (ApiErrorException $e) {
            Log::error('Failed to get billing history: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get subscription details
     */
    public function getSubscription(Organization $organization): ?array
    {
        try {
            if (!$organization->stripe_subscription_id) {
                return null;
            }

            $subscription = $this->stripe->subscriptions->retrieve($organization->stripe_subscription_id);

            return [
                'plan' => $organization->subscription_tier ?? 'starter',
                'status' => $subscription->status,
                'current_period_start' => Carbon::createFromTimestamp($subscription->current_period_start)->toIso8601String(),
                'current_period_end' => Carbon::createFromTimestamp($subscription->current_period_end)->toIso8601String(),
                'cancel_at_period_end' => $subscription->cancel_at_period_end,
            ];
        } catch (ApiErrorException $e) {
            Log::error('Failed to get subscription: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get payment method details
     */
    public function getPaymentMethod(Organization $organization): ?array
    {
        try {
            if (!$organization->stripe_payment_method_id) {
                return null;
            }

            $paymentMethod = $this->stripe->paymentMethods->retrieve($organization->stripe_payment_method_id);

            return [
                'type' => $paymentMethod->type,
                'last4' => $paymentMethod->card->last4 ?? null,
                'brand' => $paymentMethod->card->brand ?? null,
                'exp_month' => $paymentMethod->card->exp_month ?? null,
                'exp_year' => $paymentMethod->card->exp_year ?? null,
            ];
        } catch (ApiErrorException $e) {
            Log::error('Failed to get payment method: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get plan price ID (would be configured in Stripe)
     */
    protected function getPlanPrice(string $planId): string
    {
        $prices = [
            'starter' => config('services.stripe.price_starter', 'price_starter'),
            'professional' => config('services.stripe.price_professional', 'price_professional'),
            'enterprise' => config('services.stripe.price_enterprise', 'price_enterprise'),
        ];

        return $prices[$planId] ?? $prices['starter'];
    }
}

