<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class CheckScannerLimits
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $team = app('current_team');
        
        if (!$team) {
            return response()->json(['error' => 'No team context'], 400);
        }
        
        // Get subscription for team
        $subscription = DB::table('subscriptions')
            ->where('team_id', $team->id)
            ->where('status', 'active')
            ->first();
        
        // Default limits if no subscription
        $limits = [
            'sites' => 3,
            'scans_per_month' => 10,
        ];
        
        // Get limits from subscription metadata if available
        if ($subscription && $subscription->metadata) {
            $metadata = json_decode($subscription->metadata, true);
            if (isset($metadata['limits'])) {
                $limits = array_merge($limits, $metadata['limits']);
            } else {
                // Fallback to plan-based limits
                $planLimits = $this->getPlanLimits($subscription->plan);
                $limits = array_merge($limits, $planLimits);
            }
        }
        
        // Check site limits
        if ($request->routeIs('scanner.sites.store')) {
            $limit = $limits['sites'] ?? 3;
            
            // -1 means unlimited
            if ($limit !== -1) {
                $currentSites = DB::table('scanner_sites')
                    ->where('team_id', $team->id)
                    ->count();
                
                if ($currentSites >= $limit) {
                    return response()->json([
                        'error' => 'Site limit reached',
                        'limit' => $limit,
                        'current' => $currentSites,
                        'upgrade_url' => '/settings/billing',
                    ], 403);
                }
            }
        }
        
        // Check scan limits
        if ($request->routeIs('scanner.sites.scan')) {
            $limit = $limits['scans_per_month'] ?? 10;
            
            // -1 means unlimited
            if ($limit !== -1) {
                $scansThisMonth = DB::table('scanner_scans')
                    ->where('team_id', $team->id)
                    ->where('created_at', '>=', now()->startOfMonth())
                    ->count();
                
                if ($scansThisMonth >= $limit) {
                    return response()->json([
                        'error' => 'Monthly scan limit reached',
                        'limit' => $limit,
                        'current' => $scansThisMonth,
                        'resets_at' => now()->endOfMonth()->toISOString(),
                        'upgrade_url' => '/settings/billing',
                    ], 403);
                }
            }
        }
        
        return $next($request);
    }
    
    /**
     * Get plan-based limits
     */
    private function getPlanLimits(string $plan): array
    {
        return match($plan) {
            'free' => [
                'sites' => 3,
                'scans_per_month' => 10,
            ],
            'pro' => [
                'sites' => 10,
                'scans_per_month' => 100,
            ],
            'business' => [
                'sites' => 50,
                'scans_per_month' => 500,
            ],
            'enterprise' => [
                'sites' => -1, // unlimited
                'scans_per_month' => -1, // unlimited
            ],
            default => [
                'sites' => 3,
                'scans_per_month' => 10,
            ],
        };
    }
}

