<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
            Command Center
          </h1>
          <p class="text-slate-500 mt-1">
            Welcome back! Here's what's happening in your ecosystem.
          </p>
        </div>
        <Button variant="default" class="bg-[#F59E0B] hover:bg-[#D97706] text-white" as-child>
          <router-link to="/coordinators" class="flex items-center gap-2">
            Manage Ecosystem
            <ArrowRight :size="18" />
          </router-link>
        </Button>
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
            label="Calls Today"
            :value="dashboardStore.metrics?.calls_today || 0"
            :icon="Phone"
            :trend="dashboardStore.metrics?.calls_today_trend"
          />
          <MetricCard
            label="Appointments This Week"
            :value="dashboardStore.metrics?.appointments_this_week || 0"
            :icon="Calendar"
            :trend="dashboardStore.metrics?.appointments_trend"
          />
          <MetricCard
            label="Total Contacts"
            :value="formatNumber(dashboardStore.metrics?.total_contacts || 0)"
            :icon="Users"
            :sub-stat="`+${newContactsThisWeek} new this week`"
          />
          <MetricCard
            label="No-Show Rate"
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
                  Active AI Coordinators
                </h2>
                <router-link to="/coordinators" class="text-sm font-medium text-[#1B4F72] hover:underline">
                  View All
                </router-link>
              </div>
              <div v-if="coordinatorsStore.loading" class="text-slate-500 text-center py-8">
                Loading 4 Calls...
              </div>
              <div v-else-if="activeCoordinators.length === 0" class="text-slate-500 text-center py-8">
                No active 4 Calls. <router-link to="/coordinators" class="text-[#1B4F72] hover:underline">Add one</router-link> to get started.
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CoordinatorCard
                  v-for="coord in activeCoordinators.slice(0, 3)"
                  :key="coord.id"
                  :id="coord.id"
                  :name="coord.display_name || coord.role_template?.name || 'AI Coordinator'"
                  :role="coord.role_template?.name || 'Unknown Role'"
                  :status="coord.status === 'active' ? 'active' : 'paused'"
                  :compact="true"
                  :compact-stats="`Active`"
                />

                <!-- Add Coordinator Card -->
                <Card
                  class="border-2 border-dashed border-slate-300 hover:border-[#1B4F72] hover:bg-blue-50/50 transition-all duration-200 flex flex-col items-center justify-center p-6 group cursor-pointer h-full min-h-[200px] bg-slate-50"
                  as-child
                >
                  <router-link to="/coordinators" class="flex flex-col items-center justify-center w-full h-full">
                    <div class="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#1B4F72] group-hover:border-[#1B4F72] mb-3 transition-colors shadow-sm">
                      <Plus :size="24" />
                    </div>
                    <span class="font-medium text-slate-600 group-hover:text-[#1B4F72]">
                      Add AI Coordinator
                    </span>
                  </router-link>
                </Card>
              </div>
            </section>

            <!-- Recent Calls Section -->
            <Card class="overflow-hidden">
              <CardHeader class="flex flex-row items-center justify-between">
                <CardTitle class="text-xl font-bold text-[#1B4F72]">Recent Calls</CardTitle>
                <Button variant="ghost" size="sm" as-child>
                  <router-link to="/calls">View All</router-link>
                </Button>
              </CardHeader>
              <CardContent>
                <div class="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>4 Call</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Outcome</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow
                        v-for="call in dashboardStore.recentCalls"
                        :key="call.id"
                        class="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <TableCell class="text-slate-500">{{ call.time }}</TableCell>
                        <TableCell class="font-medium text-slate-900">
                          {{ call.contact_name }}
                        </TableCell>
                        <TableCell class="text-slate-600">{{ call.coordinator_name }}</TableCell>
                        <TableCell class="text-slate-500 font-mono text-xs">
                          {{ call.duration }}
                        </TableCell>
                        <TableCell>
                          <Badge
                            :variant="call.status === 'success' ? 'default' : call.status === 'error' ? 'destructive' : 'secondary'"
                            :class="call.status === 'success' ? 'bg-green-50 text-green-700' : call.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'"
                          >
                            {{ call.outcome }}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow v-if="dashboardStore.recentCalls.length === 0">
                        <TableCell colspan="5" class="text-center text-slate-500 py-8">
                          No recent calls
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right Column (Appointments + Quick Actions) -->
          <div class="space-y-8">
            <!-- Today's Appointments -->
            <Card>
              <CardHeader class="flex flex-row items-center justify-between">
                <CardTitle class="text-xl font-bold text-[#1B4F72]">
                  Today's Appointments
                </CardTitle>
                <Button variant="ghost" size="sm" as-child>
                  <router-link to="/appointments">View Calendar</router-link>
                </Button>
              </CardHeader>
              <CardContent>

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
              </CardContent>
            </Card>

            <!-- Quick Actions -->
            <Card>
              <CardHeader>
                <CardTitle class="text-xl font-bold text-[#1B4F72]">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  <Button variant="outline" class="w-full justify-start h-auto p-3">
                    <Download :size="18" class="mr-3" />
                    Import Contacts
                  </Button>

                  <Button variant="outline" class="w-full justify-start h-auto p-3">
                    <Megaphone :size="18" class="mr-3" />
                    Create Campaign
                  </Button>

                  <Button variant="outline" class="w-full justify-start h-auto p-3">
                    <BarChart3 :size="18" class="mr-3" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
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
import { Card, CardHeader, CardTitle, CardContent, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from '@taskjuggler/ui';
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
