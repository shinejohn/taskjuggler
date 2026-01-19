<?php

namespace App\Modules\Core\Controllers;

use App\Modules\Core\Traits\ApiResponses;
use App\Modules\Core\Services\SubscriptionCheckoutService;
use Illuminate\Http\Request;

class SubscriptionController extends \App\Http\Controllers\Controller
{
    use ApiResponses;

    public function checkout(Request $request, SubscriptionCheckoutService $service)
    {
        $request->validate([
            'plan_id' => 'required|string',
            'billing_period' => 'nullable|in:monthly,annual',
            'addons' => 'array',
            'addons.*' => 'string',
        ]);

        $user = $request->user();
        $appContext = $request->header('X-App-Context');
        $planId = $request->input('plan_id');
        $billingPeriod = $request->input('billing_period', 'monthly');
        $addons = $request->input('addons', []);

        if (!$appContext) {
            return $this->error('X-App-Context header is required', 400);
        }

        if (!config("subscriptions.apps.{$appContext}")) {
            return $this->error('Unsupported app context', 400);
        }

        $origin = $request->headers->get('origin')
            ?? $request->headers->get('referer')
            ?? config('app.url');

        $teamId = $request->header('X-Team-ID') ?? $user->current_team_id;

        try {
            $session = $service->createCheckoutSession(
                $user,
                $appContext,
                $planId,
                $billingPeriod,
                $addons,
                $origin,
                $teamId
            );

            return $this->success($session, 'Checkout session created');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}



