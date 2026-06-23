<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

final class AdminMetricsController extends Controller
{
    /**
     * Business-metrics summary for the admin dashboard.
     *
     * All aggregation is intentionally DB-agnostic (works on sqlite and
     * postgres): only SUM/COUNT/AVG/GROUP BY plus Carbon date bounds are used.
     * Per-day series are built in PHP to avoid postgres-only date functions.
     */
    public function summary(Request $request): JsonResponse
    {
        $now = now();
        $since30 = $now->copy()->subDays(30);
        $since7 = $now->copy()->subDays(7);

        return response()->json([
            'generated_at' => $now->toIso8601String(),
            'growth' => $this->growth($since30, $since7),
            'revenue' => $this->revenue($since30),
            'ai_costs' => $this->aiCosts($since30),
            'conversion' => $this->conversion(),
            'unit_economics' => $this->unitEconomics($since30),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function growth(\Carbon\CarbonInterface $since30, \Carbon\CarbonInterface $since7): array
    {
        $totalUsers = (int) DB::table('users')->count();
        $newUsers30 = (int) DB::table('users')->where('created_at', '>=', $since30)->count();
        $newUsers7 = (int) DB::table('users')->where('created_at', '>=', $since7)->count();

        // Signups by day (last 30d) — fetch and group in PHP for DB-agnosticism.
        $signupRows = DB::table('users')
            ->where('created_at', '>=', $since30)
            ->whereNotNull('created_at')
            ->pluck('created_at');

        $signupsByDay = [];
        foreach ($signupRows as $createdAt) {
            $day = \Carbon\Carbon::parse($createdAt)->toDateString();
            $signupsByDay[$day] = ($signupsByDay[$day] ?? 0) + 1;
        }
        ksort($signupsByDay);
        $signupsByDaySeries = [];
        foreach ($signupsByDay as $date => $count) {
            $signupsByDaySeries[] = ['date' => $date, 'count' => (int) $count];
        }

        // Active users in last 30d: union of distinct ids from
        // transactions.user_id, tasks.requestor_id, and executions->tasks.
        $activeIds = [];

        foreach (DB::table('transactions')->where('created_at', '>=', $since30)->whereNotNull('user_id')->distinct()->pluck('user_id') as $id) {
            $activeIds[$id] = true;
        }

        foreach (DB::table('tasks')->where('created_at', '>=', $since30)->whereNotNull('requestor_id')->distinct()->pluck('requestor_id') as $id) {
            $activeIds[$id] = true;
        }

        $execRequestorIds = DB::table('ai_tool_executions')
            ->join('tasks', 'ai_tool_executions.task_id', '=', 'tasks.id')
            ->where('ai_tool_executions.created_at', '>=', $since30)
            ->whereNotNull('tasks.requestor_id')
            ->distinct()
            ->pluck('tasks.requestor_id');
        foreach ($execRequestorIds as $id) {
            $activeIds[$id] = true;
        }

        return [
            'total_users' => $totalUsers,
            'new_users_30d' => $newUsers30,
            'new_users_7d' => $newUsers7,
            'active_users_30d' => count($activeIds),
            'signups_by_day' => $signupsByDaySeries,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function revenue(\Carbon\CarbonInterface $since30): array
    {
        $completed = DB::table('transactions')->where('status', 'completed');

        $totalAll = (float) (clone $completed)->sum('amount');
        $total30 = (float) (clone $completed)->where('created_at', '>=', $since30)->sum('amount');

        // mrr: sum of completed subscription transactions in last 30d.
        // NOTE: approximation — treats trailing-30d subscription revenue as MRR.
        $mrr = (float) (clone $completed)
            ->where('type', 'subscription')
            ->where('created_at', '>=', $since30)
            ->sum('amount');

        // Revenue by type (all time, completed). GROUP BY raw column is safe.
        $byTypeRows = (clone $completed)
            ->select('type', DB::raw('SUM(amount) as amount'), DB::raw('COUNT(*) as cnt'))
            ->groupBy('type')
            ->get();
        $revenueByType = [];
        foreach ($byTypeRows as $row) {
            $revenueByType[] = [
                'type' => (string) $row->type,
                'amount' => round((float) $row->amount, 2),
                'count' => (int) $row->cnt,
            ];
        }

        // Revenue by day (last 30d) — group in PHP.
        $dayRows = (clone $completed)
            ->where('created_at', '>=', $since30)
            ->whereNotNull('created_at')
            ->select('created_at', 'amount')
            ->get();
        $byDay = [];
        foreach ($dayRows as $row) {
            $day = \Carbon\Carbon::parse($row->created_at)->toDateString();
            $byDay[$day] = ($byDay[$day] ?? 0) + (float) $row->amount;
        }
        ksort($byDay);
        $revenueByDay = [];
        foreach ($byDay as $date => $amount) {
            $revenueByDay[] = ['date' => $date, 'amount' => round((float) $amount, 2)];
        }

        return [
            'mrr' => round($mrr, 2),
            'total_revenue_30d' => round($total30, 2),
            'total_revenue_all' => round($totalAll, 2),
            'revenue_by_type' => $revenueByType,
            'revenue_by_day' => $revenueByDay,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function aiCosts(\Carbon\CarbonInterface $since30): array
    {
        $execs = DB::table('ai_tool_executions');

        $totalCostAll = (float) (clone $execs)->sum('cost');
        $totalCost30 = (float) (clone $execs)->where('created_at', '>=', $since30)->sum('cost');
        $totalTokens30 = (int) (clone $execs)->where('created_at', '>=', $since30)->sum('tokens_used');
        $executions30 = (int) (clone $execs)->where('created_at', '>=', $since30)->count();

        // Per-service breakdown. Fetch joined rows and group in PHP by config_id
        // to avoid any postgres GROUP BY/alias pitfalls.
        $rows = DB::table('ai_tool_executions as e')
            ->leftJoin('ai_tool_configs as c', 'e.config_id', '=', 'c.id')
            ->leftJoin('marketplace_vendors as v', 'e.vendor_id', '=', 'v.id')
            ->select([
                'e.id as exec_id',
                'e.config_id as config_id',
                'e.status as status',
                'e.cost as cost',
                'c.model as model',
                'v.name as vendor_name',
            ])
            ->get();

        // Revenue per execution from ai_tool transactions keyed by execution_id.
        $revenueByExecution = [];
        $txnRows = DB::table('transactions')
            ->where('type', 'ai_tool')
            ->where('status', 'completed')
            ->whereNotNull('execution_id')
            ->select('execution_id', 'amount')
            ->get();
        foreach ($txnRows as $txn) {
            $revenueByExecution[$txn->execution_id] = ($revenueByExecution[$txn->execution_id] ?? 0) + (float) $txn->amount;
        }

        $groups = [];
        foreach ($rows as $row) {
            $key = $row->config_id ?? ('novendor:' . ($row->vendor_name ?? '') . ':' . ($row->model ?? ''));
            if (! isset($groups[$key])) {
                $groups[$key] = [
                    'vendor' => (string) ($row->vendor_name ?? ''),
                    'model' => (string) ($row->model ?? ''),
                    'executions' => 0,
                    'cost' => 0.0,
                    'revenue' => 0.0,
                    'completed' => 0,
                ];
            }
            $groups[$key]['executions']++;
            $groups[$key]['cost'] += (float) ($row->cost ?? 0);
            $groups[$key]['revenue'] += (float) ($revenueByExecution[$row->exec_id] ?? 0);
            if ($row->status === 'completed') {
                $groups[$key]['completed']++;
            }
        }

        $byService = [];
        foreach ($groups as $g) {
            $cost = round($g['cost'], 2);
            $revenue = round($g['revenue'], 2);
            $byService[] = [
                'service' => trim(($g['vendor'] !== '' ? $g['vendor'] : 'unknown') . ' / ' . ($g['model'] !== '' ? $g['model'] : 'unknown')),
                'vendor' => $g['vendor'],
                'model' => $g['model'],
                'executions' => (int) $g['executions'],
                'cost' => $cost,
                'revenue' => $revenue,
                'margin' => round($revenue - $cost, 2),
                'success_rate' => $g['executions'] > 0 ? round($g['completed'] / $g['executions'], 4) : 0,
            ];
        }

        return [
            'total_cost_30d' => round($totalCost30, 2),
            'total_cost_all' => round($totalCostAll, 2),
            'total_tokens_30d' => $totalTokens30,
            'executions_30d' => $executions30,
            'by_service' => $byService,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function conversion(): array
    {
        $totalUsers = (int) DB::table('users')->count();
        $freeUsers = (int) DB::table('users')
            ->where(function ($q): void {
                $q->where('plan', 'free')->orWhereNull('plan');
            })
            ->count();
        $paidUsers = max(0, $totalUsers - $freeUsers);

        $activeSubscriptions = (int) DB::table('subscriptions')->where('status', 'active')->count();

        $planRows = DB::table('subscriptions')
            ->select('plan', DB::raw('COUNT(*) as cnt'))
            ->groupBy('plan')
            ->get();
        $subscriptionsByPlan = [];
        foreach ($planRows as $row) {
            $subscriptionsByPlan[] = [
                'plan' => (string) ($row->plan ?? ''),
                'count' => (int) $row->cnt,
            ];
        }

        return [
            'free_users' => $freeUsers,
            'paid_users' => $paidUsers,
            'free_to_paid_rate' => $totalUsers > 0 ? round($paidUsers / $totalUsers, 4) : 0,
            'active_subscriptions' => $activeSubscriptions,
            'subscriptions_by_plan' => $subscriptionsByPlan,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function unitEconomics(\Carbon\CarbonInterface $since30): array
    {
        $revenue30 = (float) DB::table('transactions')
            ->where('status', 'completed')
            ->where('created_at', '>=', $since30)
            ->sum('amount');

        $cost30 = (float) DB::table('ai_tool_executions')
            ->where('created_at', '>=', $since30)
            ->sum('cost');

        $margin = round($revenue30 - $cost30, 2);
        $revenue30 = round($revenue30, 2);
        $cost30 = round($cost30, 2);

        return [
            'total_revenue_30d' => $revenue30,
            'total_ai_cost_30d' => $cost30,
            'gross_margin_30d' => $margin,
            'gross_margin_pct' => $revenue30 > 0 ? round($margin / $revenue30 * 100, 2) : 0,
        ];
    }
}
