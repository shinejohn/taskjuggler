<?php

declare(strict_types=1);

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Models\Subscription;
use App\Modules\Core\Models\Team;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Inbound provisioning bridge for the Command Center CRM.
 *
 * Mirrors the Multisite publishing-platform contract: the CRM calls this
 * endpoint with an X-Provisioning-Secret header after a paid order to
 * activate an AI-platform subscription. See PROVISIONING_CONTRACT.md.
 */
final class ProvisioningController extends Controller
{
    public function provisionSubscription(Request $request): JsonResponse
    {
        // Security check (shared secret)
        $configuredSecret = config('services.provisioning.secret');
        if (empty($configuredSecret)) {
            abort(500, 'Provisioning secret not configured');
        }

        $secret = $request->header('X-Provisioning-Secret');
        if (! hash_equals((string) $configuredSecret, (string) $secret)) {
            Log::warning('Unauthorized provisioning attempt', ['ip' => $request->ip()]);

            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'business_name' => 'required|string',
            'crm_order_id' => 'required|string',
            // Must be a tier known to the module-gating config
            'plan_tier' => ['required', 'string', Rule::in(array_keys(config('modules.subscriptions')))],
            'subscription_id' => 'required|string', // CRM ServiceSubscription ID
            'stripe_subscription_id' => 'nullable|string',
            'app' => 'nullable|string', // which AI app was sold (taskjuggler, projects, urpa, ...)
            'started_at' => 'required|date',
            'expires_at' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            [$user, $team, $subscription] = DB::transaction(function () use ($request) {
                // 1. Find or create the user
                $user = User::firstOrCreate(
                    ['email' => $request->email],
                    [
                        'name' => $request->business_name.' Admin',
                        'password' => Str::random(32), // hashed by the model cast; reset via email
                    ]
                );

                // 2. Find or create the team (schema-drift safe, same
                //    pattern as Api\TeamController)
                $ownerColumn = Schema::hasColumn('teams', 'owner_id') ? 'owner_id' : 'created_by';
                $team = Team::where($ownerColumn, $user->id)->first();

                if (! $team) {
                    $teamData = ['name' => $request->business_name, $ownerColumn => $user->id];
                    if (Schema::hasColumn('teams', 'slug')) {
                        $teamData['slug'] = Str::slug($request->business_name).'-'.Str::random(4);
                    }
                    if ($ownerColumn === 'owner_id' && Schema::hasColumn('teams', 'created_by')) {
                        $teamData['created_by'] = $user->id;
                    }
                    $team = Team::create($teamData);
                    $team->addMember($user, true);
                }

                if (! $user->current_team_id) {
                    $user->update(['current_team_id' => $team->id]);
                }

                // 3. Create or update the subscription
                $attributes = [
                    'plan' => $request->plan_tier,
                    'status' => 'active',
                    'stripe_subscription_id' => $request->stripe_subscription_id,
                    'current_period_start' => $request->started_at,
                    'current_period_end' => $request->expires_at,
                    'metadata' => [
                        'crm_order_id' => $request->crm_order_id,
                        'crm_subscription_id' => $request->subscription_id,
                        'app' => $request->input('app'),
                        'provisioned_via' => 'command-center',
                    ],
                ];

                $subscription = Subscription::where('team_id', $team->id)
                    ->where('status', 'active')
                    ->first();

                if ($subscription) {
                    $subscription->update($attributes);
                } else {
                    $subscription = Subscription::create(['team_id' => $team->id, ...$attributes]);
                }

                return [$user, $team, $subscription];
            });

            Log::info("Provisioned subscription for {$request->email} via CRM order {$request->crm_order_id}");

            return response()->json([
                'success' => true,
                'user_id' => $user->id,
                'team_id' => $team->id,
                'subscription_id' => $subscription->id,
                'message' => 'Subscription provisioned successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Provisioning failed: '.$e->getMessage());

            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
