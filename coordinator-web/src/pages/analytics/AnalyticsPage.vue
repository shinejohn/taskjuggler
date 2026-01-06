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
          <div class="flex justify-center gap-6 mt-4 text-xs text-slate-500">
            <span>Last 14 days</span>
          </div>
        </div>

        <!-- Appointment Conversion -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-[#1B4F72] mb-4">Appointment Conversion</h3>
          <div class="h-64 flex items-center justify-center">
            <div class="text-center">
              <div class="text-4xl font-bold text-[#1B4F72] mb-2">68%</div>
              <p class="text-slate-500 text-sm">Calls → Appointments</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Coordinator Performance Table -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h3 class="text-lg font-bold text-[#1B4F72]">Coordinator Performance</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th class="px-6 py-3">Coordinator</th>
                <th class="px-6 py-3">Calls</th>
                <th class="px-6 py-3">Appointments</th>
                <th class="px-6 py-3">Conversion</th>
                <th class="px-6 py-3">Avg Duration</th>
                <th class="px-6 py-3">Satisfaction</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(perf, i) in coordinatorPerformance"
                :key="i"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 font-medium text-slate-900">{{ perf.name }}</td>
                <td class="px-6 py-4 text-slate-600">{{ perf.calls }}</td>
                <td class="px-6 py-4 text-slate-600">{{ perf.appointments }}</td>
                <td class="px-6 py-4">
                  <span class="font-semibold text-green-600">{{ perf.conversion }}%</span>
                </td>
                <td class="px-6 py-4 text-slate-600 font-mono text-xs">{{ perf.avgDuration }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-1">
                    <Star
                      v-for="j in 5"
                      :key="j"
                      :size="14"
                      :fill="j <= perf.rating ? '#F59E0B' : 'none'"
                      class="text-[#F59E0B]"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
} from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { useCallsStore } from '@/stores/calls';
import { useAppointmentsStore } from '@/stores/appointments';
import { useCoordinatorsStore } from '@/stores/coordinators';
import { useOrganizationsStore } from '@/stores/organizations';
import { formatDurationSeconds } from '@/utils/format';

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
      value: stats?.total_calls || 0,
      change: '+12%',
      trend: 'up' as const,
      icon: Phone,
    },
    {
      label: 'Appointments',
      value: appointmentsStore.appointments.length || 0,
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
      value: formatDuration(stats?.avg_duration || 0),
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

const coordinatorPerformance = computed(() => {
  // Would calculate from real data
  return coordinatorsStore.coordinators.map(coord => ({
    name: coord.display_name || coord.role_template?.name || 'Coordinator',
    calls: 0,
    appointments: 0,
    conversion: 0,
    avgDuration: '0:00',
    rating: 4,
  }));
});

// Use utility function for duration formatting
const formatDuration = formatDurationSeconds;

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

