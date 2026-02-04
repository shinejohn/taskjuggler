import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardApi } from '@/api/dashboard';
import type { DashboardStats } from '@/types';
import { useUsageStore } from '@/stores/usage';

export const useDashboardStore = defineStore('dashboard', () => {
  const usageStore = useUsageStore();
  
  const stats = ref<DashboardStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchStats() {
    loading.value = true;
    error.value = null;
    try {
      // API automatically filters by team via X-Team-ID header
      const response = await dashboardApi.getStats();
      stats.value = response.data.data;
      
      // Fetch usage stats in parallel (fire-and-forget)
      usageStore.fetchUsage().catch(() => {
        // Error already handled in usageStore
      });
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch dashboard stats';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
});
