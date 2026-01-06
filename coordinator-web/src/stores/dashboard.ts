import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardApi, type DashboardMetrics, type RecentCall, type TodayAppointment } from '@/api/dashboard';
import { useOrganizationsStore } from './organizations';

export const useDashboardStore = defineStore('dashboard', () => {
  const metrics = ref<DashboardMetrics | null>(null);
  const recentCalls = ref<RecentCall[]>([]);
  const todayAppointments = ref<TodayAppointment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboardData() {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const [metricsRes, callsRes, appointmentsRes] = await Promise.all([
        dashboardApi.getMetrics(orgStore.currentOrganization.id),
        dashboardApi.getRecentCalls(orgStore.currentOrganization.id),
        dashboardApi.getTodayAppointments(orgStore.currentOrganization.id),
      ]);

      metrics.value = metricsRes.data;
      recentCalls.value = callsRes.data.data;
      todayAppointments.value = appointmentsRes.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load dashboard data';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function refreshMetrics() {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) return;

    try {
      const response = await dashboardApi.getMetrics(orgStore.currentOrganization.id);
      metrics.value = response.data;
    } catch (err: any) {
      console.error('Failed to refresh metrics:', err);
    }
  }

  return {
    metrics,
    recentCalls,
    todayAppointments,
    loading,
    error,
    fetchDashboardData,
    refreshMetrics,
  };
});

