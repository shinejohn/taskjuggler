<template>
  <AppLayout>
    <div class="w-full">
      <!-- Header -->
      <div class="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Business Metrics</h1>
          <p v-if="summary?.generated_at" class="text-sm text-muted-foreground mt-1">
            Generated {{ formatDateTime(summary.generated_at) }}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          aria-label="Refresh metrics"
          :disabled="loading"
          @click="refresh"
        >
          <RefreshCw class="w-4 h-4 mr-2" :class="loading && 'animate-spin'" />
          Refresh
        </Button>
      </div>

      <!-- Error -->
      <Alert v-if="error" variant="destructive" class="mb-6">
        <AlertTitle>Could not load metrics</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- Loading skeleton -->
      <div v-if="loading && !summary" class="space-y-6">
        <Skeleton class="h-40 w-full" />
        <Skeleton class="h-40 w-full" />
        <Skeleton class="h-40 w-full" />
      </div>

      <div v-else-if="summary" class="space-y-6">
        <!-- Unit Economics (most important) -->
        <Card>
          <CardHeader>
            <CardTitle>Unit Economics</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Total Revenue (30d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">
                  {{ formatMoney(summary.unit_economics.total_revenue_30d) }}
                </p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">AI Cost (30d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">
                  {{ formatMoney(summary.unit_economics.total_ai_cost_30d) }}
                </p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Gross Margin (30d)</p>
                <p
                  class="text-2xl font-bold mt-1"
                  :class="summary.unit_economics.gross_margin_30d >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatMoney(summary.unit_economics.gross_margin_30d) }}
                </p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Margin %</p>
                <p
                  class="text-2xl font-bold mt-1"
                  :class="summary.unit_economics.gross_margin_pct >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatPercent(summary.unit_economics.gross_margin_pct) }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Growth -->
        <Card>
          <CardHeader>
            <CardTitle>Growth</CardTitle>
            <CardDescription>User acquisition and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Total Users</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.growth.total_users) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">New Users (30d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.growth.new_users_30d) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">New Users (7d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.growth.new_users_7d) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Active Users (30d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.growth.active_users_30d) }}</p>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-foreground mb-3">Signups by day</h3>
              <div
                v-if="summary.growth.signups_by_day.length"
                class="flex items-end gap-1 h-32"
                role="img"
                aria-label="Daily signups trend"
              >
                <div
                  v-for="day in summary.growth.signups_by_day"
                  :key="day.date"
                  class="flex-1 bg-primary/70 rounded-t min-h-[2px]"
                  :style="{ height: barHeight(day.count, maxSignups) }"
                  :title="`${day.date}: ${day.count} signups`"
                  :aria-label="`${day.date}: ${day.count} signups`"
                ></div>
              </div>
              <p v-else class="text-sm text-muted-foreground">No signup data available.</p>
            </div>
          </CardContent>
        </Card>

        <!-- Revenue -->
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Recurring and one-time revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">MRR</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatMoney(summary.revenue.mrr) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Revenue (30d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatMoney(summary.revenue.total_revenue_30d) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Revenue (all time)</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatMoney(summary.revenue.total_revenue_all) }}</p>
              </div>
            </div>

            <h3 class="text-sm font-medium text-foreground mb-3">Revenue by type</h3>
            <Table class="mb-6">
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead class="text-right">Count</TableHead>
                  <TableHead class="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableEmpty v-if="!summary.revenue.revenue_by_type.length" :colspan="3">
                  No revenue recorded yet.
                </TableEmpty>
                <TableRow v-for="row in summary.revenue.revenue_by_type" :key="row.type">
                  <TableCell class="font-medium">{{ row.type }}</TableCell>
                  <TableCell class="text-right">{{ formatNumber(row.count) }}</TableCell>
                  <TableCell class="text-right">{{ formatMoney(row.amount) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h3 class="text-sm font-medium text-foreground mb-3">Revenue by day</h3>
            <div
              v-if="summary.revenue.revenue_by_day.length"
              class="flex items-end gap-1 h-32"
              role="img"
              aria-label="Daily revenue trend"
            >
              <div
                v-for="day in summary.revenue.revenue_by_day"
                :key="day.date"
                class="flex-1 bg-green-500/70 rounded-t min-h-[2px]"
                :style="{ height: barHeight(day.amount, maxRevenue) }"
                :title="`${day.date}: ${formatMoney(day.amount)}`"
                :aria-label="`${day.date}: ${formatMoney(day.amount)}`"
              ></div>
            </div>
            <p v-else class="text-sm text-muted-foreground">No revenue data available.</p>
          </CardContent>
        </Card>

        <!-- AI Costs / per-service unit economics -->
        <Card>
          <CardHeader>
            <CardTitle>AI Costs</CardTitle>
            <CardDescription>Per-service unit economics, last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Total Cost (30d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatMoney(summary.ai_costs.total_cost_30d) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Tokens (30d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.ai_costs.total_tokens_30d) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Executions (30d)</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.ai_costs.executions_30d) }}</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead class="text-right">Executions</TableHead>
                  <TableHead class="text-right">Cost</TableHead>
                  <TableHead class="text-right">Revenue</TableHead>
                  <TableHead class="text-right">Margin</TableHead>
                  <TableHead class="text-right">Success %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableEmpty v-if="!summary.ai_costs.by_service.length" :colspan="6">
                  No AI service executions recorded in the last 30 days.
                </TableEmpty>
                <TableRow v-for="row in summary.ai_costs.by_service" :key="`${row.service}-${row.model}`">
                  <TableCell>
                    <div class="font-medium">{{ row.service }}</div>
                    <div class="text-xs text-muted-foreground">{{ row.vendor }} · {{ row.model }}</div>
                  </TableCell>
                  <TableCell class="text-right">{{ formatNumber(row.executions) }}</TableCell>
                  <TableCell class="text-right">{{ formatMoney(row.cost) }}</TableCell>
                  <TableCell class="text-right">{{ formatMoney(row.revenue) }}</TableCell>
                  <TableCell class="text-right">
                    <Badge :variant="row.margin < 0 ? 'destructive' : 'secondary'">
                      {{ formatMoney(row.margin) }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-right">{{ formatPercent(row.success_rate) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <!-- Conversion -->
        <Card>
          <CardHeader>
            <CardTitle>Conversion</CardTitle>
            <CardDescription>Free to paid funnel</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Free Users</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.conversion.free_users) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Paid Users</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.conversion.paid_users) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Free → Paid Rate</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatPercent(summary.conversion.free_to_paid_rate) }}</p>
              </div>
              <div class="rounded-lg border border-border p-5">
                <p class="text-sm text-muted-foreground">Active Subscriptions</p>
                <p class="text-2xl font-bold text-foreground mt-1">{{ formatNumber(summary.conversion.active_subscriptions) }}</p>
              </div>
            </div>

            <h3 class="text-sm font-medium text-foreground mb-3">Subscriptions by plan</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead class="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableEmpty v-if="!summary.conversion.subscriptions_by_plan.length" :colspan="2">
                  No active subscriptions.
                </TableEmpty>
                <TableRow v-for="row in summary.conversion.subscriptions_by_plan" :key="row.plan">
                  <TableCell class="font-medium">{{ row.plan }}</TableCell>
                  <TableCell class="text-right">{{ formatNumber(row.count) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { RefreshCw } from 'lucide-vue-next';
import AppLayout from '@/components/layout/AppLayout.vue';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableEmpty,
  Skeleton,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@taskjuggler/ui';
import { useAdminMetricsStore } from '@/stores/adminMetrics';

const store = useAdminMetricsStore();
const { summary, loading, error } = storeToRefs(store);

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-US');

function formatMoney(value: number): string {
  return moneyFormatter.format(value ?? 0);
}

function formatNumber(value: number): string {
  return numberFormatter.format(value ?? 0);
}

function formatPercent(value: number): string {
  return `${(value ?? 0).toFixed(1)}%`;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

const maxSignups = computed(() =>
  Math.max(1, ...(summary.value?.growth.signups_by_day.map((d) => d.count) ?? [0]))
);

const maxRevenue = computed(() =>
  Math.max(1, ...(summary.value?.revenue.revenue_by_day.map((d) => d.amount) ?? [0]))
);

function barHeight(value: number, max: number): string {
  const pct = max > 0 ? Math.max(0, (value / max) * 100) : 0;
  return `${pct}%`;
}

function refresh(): void {
  store.fetchSummary();
}

onMounted(() => {
  store.fetchSummary();
});
</script>
