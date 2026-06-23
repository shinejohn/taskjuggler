import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { MetricsSummary } from '@/types/metrics';

export const useAdminMetricsStore = defineStore('adminMetrics', () => {
  const summary = ref<MetricsSummary | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSummary() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/admin/metrics/summary');
      summary.value = response.data.data ?? response.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      error.value = e.response?.data?.message ?? e.message ?? 'Failed to load metrics';
    } finally {
      loading.value = false;
    }
  }

  return {
    summary,
    loading,
    error,
    fetchSummary,
  };
});
