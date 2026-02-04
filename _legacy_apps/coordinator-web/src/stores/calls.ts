import { defineStore } from 'pinia';
import { ref } from 'vue';
import { callsApi, type CallLog, type CallFilters } from '@/api/calls';
import { useOrganizationsStore } from './organizations';

export const useCallsStore = defineStore('calls', () => {
  const calls = ref<CallLog[]>([]);
  const currentCall = ref<CallLog | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(1);
  const perPage = ref(15);
  const stats = ref<{
    calls_today: number;
    avg_duration: number;
    booking_rate: number;
    total_calls: number;
  } | null>(null);

  async function fetchCalls(filters?: CallFilters) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await callsApi.getHistory(orgStore.currentOrganization.id, {
        ...filters,
        page: filters?.page || page.value,
        per_page: filters?.per_page || perPage.value,
      });
      calls.value = response.data.data;
      total.value = response.data.total;
      page.value = response.data.page;
      perPage.value = response.data.per_page;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load calls';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCall(id: string) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await callsApi.getById(orgStore.currentOrganization.id, id);
      const data = (response.data as any).data || response.data;
      currentCall.value = data;
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load call';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchStats(filters?: CallFilters) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    try {
      const response = await callsApi.getStats(orgStore.currentOrganization.id, filters);
      stats.value = response.data;
    } catch (err: any) {
      console.error('Failed to load call stats:', err);
    }
  }

  return {
    calls,
    currentCall,
    loading,
    error,
    total,
    page,
    perPage,
    stats,
    fetchCalls,
    fetchCall,
    fetchStats,
  };
});




