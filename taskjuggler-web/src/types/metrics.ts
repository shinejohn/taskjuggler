// Type definitions for the admin business-metrics dashboard.
// Mirrors the GET /api/admin/metrics/summary contract exactly.

export interface SignupByDay {
  date: string;
  count: number;
}

export interface GrowthMetrics {
  total_users: number;
  new_users_30d: number;
  new_users_7d: number;
  active_users_30d: number;
  signups_by_day: SignupByDay[];
}

export interface RevenueByType {
  type: string;
  amount: number;
  count: number;
}

export interface RevenueByDay {
  date: string;
  amount: number;
}

export interface RevenueMetrics {
  mrr: number;
  total_revenue_30d: number;
  total_revenue_all: number;
  revenue_by_type: RevenueByType[];
  revenue_by_day: RevenueByDay[];
}

export interface AiServiceMetrics {
  service: string;
  vendor: string;
  model: string;
  executions: number;
  cost: number;
  revenue: number;
  margin: number;
  success_rate: number;
}

export interface AiCostMetrics {
  total_cost_30d: number;
  total_cost_all: number;
  total_tokens_30d: number;
  executions_30d: number;
  by_service: AiServiceMetrics[];
}

export interface SubscriptionByPlan {
  plan: string;
  count: number;
}

export interface ConversionMetrics {
  free_users: number;
  paid_users: number;
  free_to_paid_rate: number;
  active_subscriptions: number;
  subscriptions_by_plan: SubscriptionByPlan[];
}

export interface UnitEconomicsMetrics {
  total_revenue_30d: number;
  total_ai_cost_30d: number;
  gross_margin_30d: number;
  gross_margin_pct: number;
}

export interface MetricsSummary {
  generated_at: string;
  growth: GrowthMetrics;
  revenue: RevenueMetrics;
  ai_costs: AiCostMetrics;
  conversion: ConversionMetrics;
  unit_economics: UnitEconomicsMetrics;
}
