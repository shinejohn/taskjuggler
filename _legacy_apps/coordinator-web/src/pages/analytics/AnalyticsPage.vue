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
              @click="dateRange = range.id"
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
          <button
            @click="exportAnalytics"
            class="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download :size="18" />
            Export
          </button>
        </div>
      </div>

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
          <div class="flex items-end justify-between">
            <div class="text-2xl font-bold text-slate-900">
              {{ metric.value }}
            </div>
            <div
              :class="[
                'flex items-center gap-1 text-xs font-medium',
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              ]"
            >
              <TrendingUp v-if="metric.trend === 'up'" :size="12" />
              <TrendingDown v-else :size="12" />
              {{ metric.change }}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Call Volume Chart -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-[#1B4F72] mb-4">Call Volume</h3>
          <div class="h-64 flex items-end justify-between gap-2">
            <div
              v-for="(height, i) in callVolumeData"
              :key="i"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <div
                class="w-full bg-gradient-to-t from-[#1B4F72] to-blue-400 rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer"
                :style="{ height: `${height}%` }"
                :title="`Day ${i + 1}: ${Math.round(height * 1.5)} calls`"
              />
              <span v-if="i % 2 === 0" class="text-[10px] text-slate-400">{{ i + 1 }}</span>
            </div>
          </div>
          <div class="flex justify-center gap-6 mt-4 text-xs">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-[#1B4F72]"></div>
              <span class="text-slate-600">Total</span>
            </div>
          </div>
        </div>

        <!-- Outcomes Breakdown -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-[#1B4F72] mb-4">
            Outcomes Breakdown
          </h3>
          <div class="flex items-center justify-center h-64">
            <div class="relative w-48 h-48">
              <!-- Simple donut chart using conic-gradient -->
              <div
                class="w-full h-full rounded-full"
                :style="{
                  background: `conic-gradient(
                    from 0deg,
                    #10B981 0% 32%,
                    #3B82F6 32% 60%,
                    #F59E0B 60% 75%,
                    #94A3B8 75% 87%,
                    #64748B 87% 95%,
                    #E2E8F0 95% 100%
                  )`
                }"
              >
                <div class="absolute inset-0 m-auto w-28 h-28 bg-white rounded-full flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-slate-900">
                      2,847
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
              <div :class="['w-2 h-2 rounded-full', item.color]"></div>
              <span class="text-slate-600">
                {{ item.label }}:
                <span class="font-medium text-slate-900">
                  {{ item.value }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Calls by Hour -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-[#1B4F72] mb-4">
            Calls by Hour
          </h3>
          <div class="h-64 flex items-end justify-between gap-1">
            <div
              v-for="(height, i) in callsByHourData"
              :key="i"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <div
                class="w-full bg-[#F59E0B] rounded-t hover:bg-[#D97706] transition-colors cursor-pointer"
                :style="{ height: `${height}%` }"
                :title="`${8 + i}:00 - ${Math.round(height * 1.2)} calls`"
              />
              <span class="text-[10px] text-slate-400 -rotate-45 origin-top-left mt-2">
                {{ 8 + i }}
              </span>
            </div>
          </div>
          <div class="text-center mt-6 text-xs text-slate-500">
            Peak hours: 10-11 AM
          </div>
        </div>

        <!-- Coordinator Performance -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-[#1B4F72] mb-4">
            4 Call Performance
          </h3>
          <div class="space-y-4">
            <div
              v-for="(coord, i) in coordinatorPerformanceData"
              :key="i"
            >
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center text-xs font-bold">
                    {{ coord.name.charAt(0) }}
                  </div>
                  <span class="font-medium text-slate-900">
                    {{ coord.name }}
                  </span>
                </div>
                <div class="text-sm text-slate-500">
                  {{ coord.calls }} calls •
                  <span class="font-medium text-green-600">
                    {{ coord.success }}%
                  </span>
                </div>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  :class="['h-full rounded-full', coord.color]"
                  :style="{ width: `${coord.success}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performing Days -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-[#1B4F72] mb-4">
            Top Performing Days
          </h3>
          <div class="space-y-3">
            <div
              v-for="(day, i) in topPerformingDays"
              :key="i"
              class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div>
                <div class="font-medium text-slate-900">{{ day.date }}</div>
                <div class="text-xs text-slate-500">
                  {{ day.calls }} calls • {{ day.booked }} booked
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

        <!-- Recent Trends -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-[#1B4F72] mb-4 flex items-center gap-2">
            <Lightbulb :size="20" class="text-amber-500" />
            Recent Trends
          </h3>
          <div class="space-y-4">
            <div
              v-for="(trend, i) in recentTrends"
              :key="i"
              class="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100"
            >
              <div
                :class="[
                  'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                  trend.type === 'positive' ? 'bg-green-500' : 'bg-blue-500'
                ]"
              />
              <p class="text-sm text-slate-700">{{ trend.insight }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Phone,
  CheckCircle,
  Clock,
  Star,
  Lightbulb,
} from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { useCallsStore } from '@/stores/calls';
import { useAppointmentsStore } from '@/stores/appointments';
import { useCoordinatorsStore } from '@/stores/coordinators';
import { useOrganizationsStore } from '@/stores/organizations';

const callsStore = useCallsStore();
const appointmentsStore = useAppointmentsStore();
const coordinatorsStore = useCoordinatorsStore();
const organizationsStore = useOrganizationsStore();

const dateRange = ref('30days');

const dateRanges = [
  { id: '7days', label: '7 Days' },
  { id: '30days', label: '30 Days' },
  { id: '90days', label: '90 Days' },
];

const topMetrics = computed(() => {
  const stats = callsStore.stats;
  return [
    {
      label: 'Total Calls',
      value: stats?.total_calls || '2,847',
      change: '+12%',
      trend: 'up' as const,
      icon: Phone,
    },
    {
      label: 'Appointments',
      value: appointmentsStore.appointments.length || '892',
      change: '+8%',
      trend: 'up' as const,
      icon: CheckCircle,
    },
    {
      label: 'Answer Rate',
      value: '94%',
      change: '+2%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
    {
      label: 'Avg Duration',
      value: '2:34',
      change: '-0:15',
      trend: 'down' as const,
      icon: Clock,
    },
    {
      label: 'Satisfaction',
      value: '4.7/5',
      change: '+0.2',
      trend: 'up' as const,
      icon: Star,
    },
  ];
});

const callVolumeData = [45, 52, 48, 65, 58, 72, 68, 55, 62, 70, 65, 58, 63, 75];

const outcomesBreakdown = [
  { label: 'Appt Booked', value: '32%', color: 'bg-green-500' },
  { label: 'Info Provided', value: '28%', color: 'bg-blue-500' },
  { label: 'Transferred', value: '15%', color: 'bg-amber-500' },
  { label: 'Voicemail', value: '12%', color: 'bg-slate-400' },
  { label: 'No Answer', value: '8%', color: 'bg-slate-500' },
  { label: 'Other', value: '5%', color: 'bg-slate-300' },
];

const callsByHourData = [20, 35, 55, 75, 85, 90, 80, 70, 60, 50, 40, 30];

const coordinatorPerformanceData = [
  { name: 'Sally', calls: 1247, success: 89, color: 'bg-blue-500' },
  { name: 'Ed', calls: 892, success: 94, color: 'bg-green-500' },
  { name: 'Marcus', calls: 456, success: 87, color: 'bg-purple-500' },
];

const topPerformingDays = [
  { date: 'Monday, Dec 15', calls: 247, booked: 89, rate: 36 },
  { date: 'Wednesday, Dec 17', calls: 235, booked: 82, rate: 35 },
  { date: 'Friday, Dec 19', calls: 228, booked: 75, rate: 33 },
  { date: 'Tuesday, Dec 16', calls: 215, booked: 68, rate: 32 },
];

const recentTrends = [
  { insight: 'Call volume up 15% on Mondays', type: 'positive' },
  { insight: 'Ed has highest confirmation rate at 94%', type: 'positive' },
  { insight: 'Peak hours shifted to 10-11 AM', type: 'neutral' },
  { insight: 'Answer rate improved 2% this week', type: 'positive' },
];

function exportAnalytics() {
  // TODO: Implement export functionality
  // await analyticsApi.exportAnalytics(filters);
}

onMounted(async () => {
  try {
    if (!organizationsStore.currentOrganization) {
      await organizationsStore.fetchOrganizations();
      if (organizationsStore.organizations.length > 0) {
        organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
      }
    }
    if (organizationsStore.currentOrganization?.id) {
      await Promise.all([
        callsStore.fetchStats(),
        appointmentsStore.fetchAppointments(),
        coordinatorsStore.fetchCoordinators(),
      ]);
    }
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
});
</script>

