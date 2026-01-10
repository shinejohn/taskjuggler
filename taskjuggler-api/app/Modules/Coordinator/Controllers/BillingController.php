<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Services\BillingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BillingController extends Controller
{
    /**
     * Get billing information for organization
     * GET /api/coordinator/organizations/{orgId}/billing
     */
    public function index(Request $request, string $orgId): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $billingService = app(BillingService::class);

            // Get subscription info from Stripe
            $subscription = $billingService->getSubscription($organization) ?? [
                'plan' => $organization->subscription_tier ?? 'starter',
                'status' => 'inactive',
                'current_period_start' => now()->startOfMonth()->toIso8601String(),
                'current_period_end' => now()->endOfMonth()->toIso8601String(),
                'cancel_at_period_end' => false,
            ];

            // Calculate current usage
            $coordinators = $organization->coordinators()->count();
            $monthlyCost = $organization->coordinators()->sum('monthly_price');

            // Get payment method from Stripe
            $paymentMethod = $billingService->getPaymentMethod($organization) ?? [
                'type' => null,
                'last4' => null,
                'brand' => null,
                'exp_month' => null,
                'exp_year' => null,
            ];

            return response()->json([
                'subscription' => $subscription,
                'usage' => [
                    'coordinators' => $coordinators,
                    'monthly_cost' => $monthlyCost,
                ],
                'payment_method' => $paymentMethod,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Organization not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Failed to get billing info: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve billing information'], 500);
        }
    }

    /**
     * Get billing history
     * GET /api/coordinator/organizations/{orgId}/billing/history
     */
    public function getHistory(Request $request, string $orgId): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $billingService = app(BillingService::class);
            $history = $billingService->getBillingHistory($organization);

            return response()->json(['data' => $history]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Organization not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Failed to get billing history: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve billing history'], 500);
        }
    }

    /**
     * Update payment method
     * PUT /api/coordinator/organizations/{orgId}/billing/payment-method
     */
    public function updatePaymentMethod(Request $request, string $orgId): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $validated = $request->validate([
                'payment_method_id' => 'required|string',
            ]);

            $billingService = app(BillingService::class);
            $billingService->updatePaymentMethod($organization, $validated['payment_method_id']);

            return response()->json(['message' => 'Payment method updated successfully']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Organization not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Failed to update payment method: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update payment method'], 500);
        }
    }

    /**
     * Cancel subscription
     * POST /api/coordinator/organizations/{orgId}/billing/cancel
     */
    public function cancel(Request $request, string $orgId): JsonResponse
    {
        try {
            $organization = Organization::where('id', $orgId)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $validated = $request->validate([
                'cancel_immediately' => 'sometimes|boolean',
            ]);

            $billingService = app(BillingService::class);
            $cancelImmediately = $validated['cancel_immediately'] ?? false;
            
            $billingService->cancelSubscription($organization, !$cancelImmediately);

            $message = $cancelImmediately 
                ? 'Subscription cancelled immediately' 
                : 'Subscription will be cancelled at the end of the billing period';

            return response()->json(['message' => $message]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Organization not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Failed to cancel subscription: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to cancel subscription'], 500);
        }
    }
}

