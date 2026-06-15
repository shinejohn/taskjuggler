<?php

declare(strict_types=1);

namespace App\Modules\Core\Services;

use App\Modules\Core\Models\User;

final class ModuleEntitlementService
{
    /**
     * Module IDs the user may access in the mobile app, derived from plan + config.
     *
     * @return list<string>
     */
    public function getEnabledMobileModuleIds(User $user): array
    {
        $plan = $this->resolvePlan($user);
        $entitlements = config('modules.mobile_entitlements', []);
        $enabled = [];

        foreach ($entitlements as $moduleId => $plans) {
            if (in_array($plan, $plans, true)) {
                $enabled[] = $moduleId;
            }
        }

        return $enabled;
    }

    private function resolvePlan(User $user): string
    {
        $team = $user->currentTeam ?? null;
        if ($team && $team->subscription?->plan) {
            return (string) $team->subscription->plan;
        }

        return (string) ($user->plan ?? 'free');
    }
}
