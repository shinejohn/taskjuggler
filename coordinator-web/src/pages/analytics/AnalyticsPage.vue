<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
          Analytics
        </h1>
        <div class="flex gap-3">
          <div class="flex bg-slate-100 p-1 rounded-lg">
            <button
              v-for="range in dateRanges"
              :key="range.id"
              type="button"
              @click="setDateRange(range.id)"
              :class="[
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                dateRange === range.id
                  ? 'bg-white text-[#1B4F72] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              ]"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F72]"></div>
        <p class="mt-4 text-slate-500">Loading analytics...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <template v-else-if="analytics">
        <!-- Top Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            v-for="(metric, i) in topMetrics"
            :key="i"
            class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
          >
            <div class="flex items-center gap-2 mb-3">
              <div class="p-1.5 bg-blue-50 text-[#1B4F72] rounded-lg">
                <component :is="metric.icon" :size="16" />
              </div>
              <span class="text-xs font-medium text-slate-500">
                {{ metric.label }}
              </span>
            </div>
            <div class="text-2xl font-bold text-slate-900">
              {{ metric.value }}
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Call Volume Chart -->
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-[#1B4F72] mb-4">Call Volume</h3>
            <div v-if="callVolume.length === 0" class="h-64 flex items-center justify-center text-slate-500 text-sm">
              No call data for this period
            </div>
            <div v-else class="h-64 flex items-end justify-between gap-1">
              <div
                v-for="(point, i) in callVolume"
                :key="i"
                class="flex-1 flex flex-col items-center gap-1 min-w-0"
              >
                <div
                  class="w-full bg-gradient-to-t from-[#1B4F72] to-blue-400 rounded-t-sm hover:opacity-80 transition-opacity"
                  :style="{ height: `${point.height}%` }"
                  :title="`${point.label}: ${point.calls} calls`"
                />
                <span v-if="i % labelStep === 0" class="text-[10px] text-slate-400 truncate w-full text-center">
                  {{ point.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Outcomes Breakdown -->
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-[#1B4F72] mb-4">
              Outcomes Breakdown
            </h3>
            <div v-if="outcomesBreakdown.length === 0" class="h-64 flex items-center justify-center text-slate-500 text-sm">
              No outcomes for this period
            </div>
            <template v-else>
              <div class="flex items-center justify-center h-64">
                <div class="relative w-48 h-48">
                  <div
                    class="w-full h-full rounded-full"
                    :style="{ background: donutGradient }"
                  >
                    <div class="absolute inset-0 m-auto w-28 h-28 bg-white rounded-full flex items-center justify-center">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-slate-900">
                          {{ formatNumber(analytics.calls.total_calls) }}
                        </div>
                        <div class="text-xs text-slate-500">Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs mt-4">
                <div
                  v-for="(item, i) in outcomesBreakdown"
                  :key="i"
                  class="flex items-center gap-2"
                >
                  <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }"></div>
                  <span class="text-slate-600">
                    {{ item.label }}:
                    <span class="font-medium text-slate-900">{{ item.percent }}%</span>
                  </span>
                </div>
              </div>
            </template>
          </div>

          <!-- Calls by Hour -->
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-[#1B4F72] mb-4">
              Calls by Hour
            </h3>
            <div v-if="maxHourCalls === 0" class="h-64 flex items-center justify-center text-slate-500 text-sm">
              No call data for this period
            </div>
            <template v-else>
              <div class="h-64 flex items-end justify-between gap-1">
                <div
                  v-for="(count, hour) in analytics.calls.by_hour"
                  :key="hour"
                  class="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    class="w-full bg-[#F59E0B] rounded-t hover:bg-[#D97706] transition-colors"
                    :style="{ height: `${maxHourCalls > 0 ? (count / maxHourCalls) * 100 : 0}%` }"
                    :title="`${hour}:00 — ${count} calls`"
                  />
                  <span v-if="hour % 4 === 0" class="text-[10px] text-slate-400">
                    {{ hour }}
                  </span>
                </div>
              </div>
              <div v-if="peakHour !== null" class="text-center mt-6 text-xs text-slate-500">
                Peak hour: {{ peakHour }}:00
              </div>
            </template>
          </div>

          <!-- Coordinator Performance -->
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-[#1B4F72] mb-4">
              4 Call Performance
            </h3>
            <div v-if="analytics.coordinators.length === 0" class="text-slate-500 text-sm text-center py-8">
              No AI coordinators yet
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="coord in analytics.coordinators"
                :key="coord.coordinator_id"
              >
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center text-xs font-bold">
                      {{ coord.coordinator_name.charAt(0) }}
                    </div>
                    <span class="font-medium text-slate-900">
                      {{ coord.coordinator_name }}
                    </span>
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ coord.calls }} calls •
                    <span class="font-medium text-green-600">
                      {{ coord.booking_rate }}%
                    </span>
                  </div>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full bg-blue-500"
                    :style="{ width: `${Math.min(coord.booking_rate, 100)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performing Days -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-[#1B4F72] mb-4">
            Top Performing Days
          </h3>
          <div v-if="topPerformingDays.length === 0" class="text-slate-500 text-sm text-center py-8">
            No call activity for this period
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(day, i) in topPerformingDays"
              :key="i"
              class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div>
                <div class="font-medium text-slate-900">{{ day.date }}</div>
                <div class="text-xs text-slate-500">
                  {{ day.calls }} calls • {{ day.appointments }} appointments
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-green-600">
                  {{ day.rate }}%
                </div>
                <div class="text-xs text-slate-500">booking rate</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  TrendingUp,
  Phone,
  CheckCircle,
  Clock,
  Calendar,
} from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { useOrganizationsStore } from '@/stores/organizations';
import { analyticsApi, type Analytics } from '@/api/analytics';
import { formatNumber, formatDurationSeconds } from '@/utils/format';

const organizationsStore = useOrganizationsStore();

const analytics = ref<Analytics | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const dateRange = ref('30days');

const dateRanges = [
  { id: '7days', label: '7 Days', days: 7 },
  { id: '30days', label: '30 Days', days: 30 },
  { id: '90days', label: '90 Days', days: 90 },
];

const OUTCOME_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#94A3B8', '#64748B', '#E2E8F0'];

const topMetrics = computed(() => {
  if (!analytics.value) return [];
  const a = analytics.value;
  return [
    { label: 'Total Calls', value: formatNumber(a.calls.total_calls), icon: Phone },
    { label: 'Appointments', value: formatNumber(a.appointments.total_appointments), icon: Calendar },
    { label: 'Answer Rate', value: `${a.calls.answer_rate}%`, icon: TrendingUp },
    { label: 'Avg Duration', value: formatDurationSeconds(a.calls.avg_duration_seconds), icon: Clock },
    { label: 'Booking Rate', value: `${a.calls.booking_rate}%`, icon: CheckCircle },
  ];
});

const callVolume = computed(() => {
  const points = analytics.value?.trends.calls ?? [];
  const max = Math.max(...points.map(p => p.calls ?? 0), 1);
  return points.map(p => ({
    label: new Date(`${p.date}T00:00:00`).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
    calls: p.calls ?? 0,
    height: ((p.calls ?? 0) / max) * 100,
  }));
});

const labelStep = computed(() => Math.max(1, Math.ceil(callVolume.value.length / 10)));

const outcomesBreakdown = computed(() => {
  const outcomes = analytics.value?.calls.outcomes ?? {};
  const total = Object.values(outcomes).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];
  const entries = Object.entries(outcomes);
  const top = entries.slice(0, 5);
  const otherCount = entries.slice(5).reduce((sum, [, n]) => sum + n, 0);
  const items = top.map(([label, count], i) => ({
    label,
    count,
    percent: Math.round((count / total) * 100),
    color: OUTCOME_COLORS[i],
  }));
  if (otherCount > 0) {
    items.push({
      label: 'Other',
      count: otherCount,
      percent: Math.round((otherCount / total) * 100),
      color: OUTCOME_COLORS[5],
    });
  }
  return items;
});

const donutGradient = computed(() => {
  let acc = 0;
  const stops = outcomesBreakdown.value.map(item => {
    const start = acc;
    acc += item.percent;
    return `${item.color} ${start}% ${Math.min(acc, 100)}%`;
  });
  return `conic-gradient(from 0deg, ${stops.join(', ')})`;
});

const maxHourCalls = computed(() => {
  return Math.max(...(analytics.value?.calls.by_hour ?? [0]));
});

const peakHour = computed(() => {
  const byHour = analytics.value?.calls.by_hour ?? [];
  if (maxHourCalls.value === 0) return null;
  return byHour.indexOf(maxHourCalls.value);
});

const topPerformingDays = computed(() => {
  const calls = analytics.value?.trends.calls ?? [];
  const appointments = analytics.value?.trends.appointments ?? [];
  const apptByDate = new Map(appointments.map(p => [p.date, p.appointments ?? 0]));
  return calls
    .filter(p => (p.calls ?? 0) > 0)
    .map(p => {
      const dayCalls = p.calls ?? 0;
      const dayAppts = apptByDate.get(p.date) ?? 0;
      return {
        date: new Date(`${p.date}T00:00:00`).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
        calls: dayCalls,
        appointments: dayAppts,
        rate: Math.round((dayAppts / dayCalls) * 100),
      };
    })
    .sort((a, b) => b.rate - a.rate || b.calls - a.calls)
    .slice(0, 4);
});

function setDateRange(id: string) {
  dateRange.value = id;
  fetchAnalytics();
}

async function fetchAnalytics() {
  const orgId = organizationsStore.currentOrganization?.id;
  if (!orgId) return;
  loading.value = true;
  errorMessage.value = '';
  const days = dateRanges.find(r => r.id === dateRange.value)?.days ?? 30;
  const from = new Date();
  from.setDate(from.getDate() - days);
  try {
    const response = await analyticsApi.get(orgId, {
      date_from: from.toISOString().slice(0, 10),
      date_to: new Date().toISOString().slice(0, 10),
    });
    analytics.value = response.data;
  } catch (err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    errorMessage.value = axiosErr.response?.data?.message || 'Failed to load analytics';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!organizationsStore.currentOrganization) {
    await organizationsStore.fetchOrganizations();
    if (organizationsStore.organizations.length > 0) {
      organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
    }
  }
  await fetchAnalytics();
});
</script>
