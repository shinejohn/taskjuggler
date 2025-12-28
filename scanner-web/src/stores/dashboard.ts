import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardApi } from '@/api/dashboard';
import type { DashboardStats } from '@/types';

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref<DashboardStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchStats() {
    loading.value = true;
    error.value = null;
    try {
      const response = await dashboardApi.getStats();
      stats.value = response.data.data;
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
