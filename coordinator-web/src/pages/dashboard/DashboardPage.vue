<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
            Dashboard
          </h1>
          <p class="text-slate-500 mt-1">
            Welcome back! Here's what's happening with your Coordinators.
          </p>
        </div>
        <router-link
          to="/coordinators"
          class="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          Manage Coordinators
          <ArrowRight :size="18" />
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="dashboardStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F72]"></div>
        <p class="mt-4 text-slate-500">Loading dashboard data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="dashboardStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ dashboardStore.error }}
      </div>

      <!-- Dashboard Content -->
      <template v-else>
        <!-- Key Metrics Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Calls Today"
            :value="dashboardStore.metrics?.calls_today || 0"
            :icon="Phone"
            :trend="dashboardStore.metrics?.calls_today_trend"
          />
          <MetricCard
            title="Appointments This Week"
            :value="dashboardStore.metrics?.appointments_this_week || 0"
            :icon="Calendar"
            :trend="dashboardStore.metrics?.appointments_trend"
          />
          <MetricCard
            title="Total Contacts"
            :value="formatNumber(dashboardStore.metrics?.total_contacts || 0)"
            :icon="Users"
            :sub-stat="`+${newContactsThisWeek} new this week`"
          />
          <MetricCard
            title="No-Show Rate"
            :value="`${dashboardStore.metrics?.no_show_rate || 0}%`"
            :icon="Target"
            :trend="dashboardStore.metrics?.no_show_trend"
          />
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column (Active Coordinators + Recent Calls) -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Active Coordinators Section -->
            <section>
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-[#1B4F72]">
                  Active Coordinators
                </h2>
                <router-link to="/coordinators" class="text-sm font-medium text-[#1B4F72] hover:underline">
                  View All
                </router-link>
              </div>
              <div v-if="coordinatorsStore.loading" class="text-slate-500 text-center py-8">
                Loading coordinators...
              </div>
              <div v-else-if="activeCoordinators.length === 0" class="text-slate-500 text-center py-8">
                No active coordinators. <router-link to="/coordinators" class="text-[#1B4F72] hover:underline">Add one</router-link> to get started.
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CoordinatorCard
                  v-for="coord in activeCoordinators.slice(0, 3)"
                  :key="coord.id"
                  :id="coord.id"
                  :name="coord.display_name || coord.role_template?.name || 'Coordinator'"
                  :role="coord.role_template?.name || 'Unknown Role'"
                  :status="coord.status === 'active' ? 'active' : 'paused'"
                  :compact="true"
                  :compact-stats="`15 calls`"
                />

                <!-- Add Coordinator Card -->
                <router-link
                  to="/coordinators"
                  class="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1B4F72] hover:bg-blue-50/50 transition-all duration-200 flex flex-col items-center justify-center p-6 group cursor-pointer h-full min-h-[200px]"
                >
                  <div class="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#1B4F72] group-hover:border-[#1B4F72] mb-3 transition-colors shadow-sm">
                    <Plus :size="24" />
                  </div>
                  <span class="font-medium text-slate-600 group-hover:text-[#1B4F72]">
                    Add Coordinator
                  </span>
                </router-link>
              </div>
            </section>

            <!-- Recent Calls Section -->
            <section class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 class="text-xl font-bold text-[#1B4F72]">Recent Calls</h2>
                <router-link to="/calls" class="text-sm font-medium text-[#1B4F72] hover:underline">
                  View All
                </router-link>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                  <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                      <th class="px-6 py-3">Time</th>
                      <th class="px-6 py-3">Contact</th>
                      <th class="px-6 py-3">Coordinator</th>
                      <th class="px-6 py-3">Duration</th>
                      <th class="px-6 py-3">Outcome</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr
                      v-for="call in dashboardStore.recentCalls"
                      :key="call.id"
                      class="hover:bg-slate-50 transition-colors"
                    >
                      <td class="px-6 py-4 text-slate-500">{{ call.time }}</td>
                      <td class="px-6 py-4 font-medium text-slate-900">
                        {{ call.contact_name }}
                      </td>
                      <td class="px-6 py-4 text-slate-600">{{ call.coordinator_name }}</td>
                      <td class="px-6 py-4 text-slate-500 font-mono text-xs">
                        {{ call.duration }}
                      </td>
                      <td class="px-6 py-4">
                        <span
                          :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            call.status === 'success' ? 'bg-green-50 text-green-700' : call.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                          ]"
                        >
                          {{ call.outcome }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="dashboardStore.recentCalls.length === 0">
                      <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                        No recent calls
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <!-- Right Column (Appointments + Quick Actions) -->
          <div class="space-y-8">
            <!-- Today's Appointments -->
            <section class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-[#1B4F72]">
                  Today's Appointments
                </h2>
                <router-link to="/appointments" class="text-sm font-medium text-[#1B4F72] hover:underline">
                  View Calendar
                </router-link>
              </div>

              <div v-if="dashboardStore.todayAppointments.length === 0" class="text-slate-500 text-center py-8">
                No appointments today
              </div>
              <div v-else class="relative pl-4 border-l-2 border-slate-100 space-y-8">
                <div
                  v-for="appt in dashboardStore.todayAppointments"
                  :key="appt.id"
                  class="relative"
                >
                  <div
                    :class="[
                      'absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm',
                      appt.status === 'confirmed' ? 'bg-green-500' : appt.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                    ]"
                  />
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-slate-400 mb-1">
                      {{ appt.time }}
                    </span>
                    <h4 class="font-semibold text-slate-900">
                      {{ appt.contact_name }}
                    </h4>
                    <p class="text-sm text-slate-500">{{ appt.type }}</p>
                    <div class="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <span>via {{ appt.coordinator_name }}</span>
                      <CheckCircle2 v-if="appt.status === 'confirmed'" :size="12" class="text-green-500 ml-1" />
                      <XCircle v-if="appt.status === 'cancelled'" :size="12" class="text-red-500 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Quick Actions -->
            <section class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-xl font-bold text-[#1B4F72] mb-4">
                Quick Actions
              </h2>
              <div class="space-y-3">
                <button class="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#1B4F72] hover:bg-blue-50 transition-all text-left group">
                  <div class="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-white group-hover:text-[#1B4F72]">
                    <Download :size="18" />
                  </div>
                  <span class="font-medium text-slate-700 group-hover:text-[#1B4F72]">
                    Import Contacts
                  </span>
                </button>

                <button class="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#1B4F72] hover:bg-blue-50 transition-all text-left group">
                  <div class="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-white group-hover:text-[#1B4F72]">
                    <Megaphone :size="18" />
                  </div>
                  <span class="font-medium text-slate-700 group-hover:text-[#1B4F72]">
                    Create Campaign
                  </span>
                </button>

                <button class="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#1B4F72] hover:bg-blue-50 transition-all text-left group">
                  <div class="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-white group-hover:text-[#1B4F72]">
                    <BarChart3 :size="18" />
                  </div>
                  <span class="font-medium text-slate-700 group-hover:text-[#1B4F72]">
                    View Analytics
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  Phone,
  Calendar,
  Users,
  Target,
  Plus,
  ArrowRight,
  Download,
  Megaphone,
  BarChart3,
  CheckCircle2,
  XCircle,
} from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import MetricCard from '@/components/dashboard/MetricCard.vue';
import CoordinatorCard from '@/components/dashboard/CoordinatorCard.vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useCoordinatorsStore } from '@/stores/coordinators';
import { useOrganizationsStore } from '@/stores/organizations';
import { formatNumber } from '@/utils/format';

const dashboardStore = useDashboardStore();
const coordinatorsStore = useCoordinatorsStore();
const organizationsStore = useOrganizationsStore();

const activeCoordinators = computed(() => {
  return coordinatorsStore.coordinators.filter(c => c.status === 'active' || c.status === 'activated');
});

const newContactsThisWeek = computed(() => {
  // TODO: Add new_contacts_this_week to DashboardMetrics API response
  // For now, return 0 until the backend endpoint is updated
  return (dashboardStore.metrics as any)?.new_contacts_this_week ?? 0;
});

onMounted(async () => {
  try {
    // Ensure we have an organization selected
    if (!organizationsStore.currentOrganization) {
      await organizationsStore.fetchOrganizations();
      if (organizationsStore.organizations.length > 0) {
        organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
      }
    }

    // Load dashboard data and coordinators
    if (organizationsStore.currentOrganization?.id) {
      await Promise.all([
        dashboardStore.fetchDashboardData(),
        coordinatorsStore.fetchCoordinators(),
      ]);
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
});
</script>
