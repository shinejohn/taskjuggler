import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { Integration } from '@/types/integration';

export const useIntegrationsStore = defineStore('integrations', () => {
  const integrations = ref<Integration[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchIntegrations() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/integrations');
      integrations.value = response.data.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load integrations';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function connectIntegration(data: {
    integration_type: string;
    provider: string;
    config?: Record<string, any>;
  }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/integrations', data);
      integrations.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to connect integration';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function disconnectIntegration(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/urpa/integrations/${id}`);
      integrations.value = integrations.value.filter(i => i.id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to disconnect integration';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function syncIntegration(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await api.post(`/urpa/integrations/${id}/sync`);
      // Refresh integrations to get updated sync status
      await fetchIntegrations();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to sync integration';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    integrations,
    loading,
    error,
    fetchIntegrations,
    connectIntegration,
    disconnectIntegration,
    syncIntegration,
  };
});

