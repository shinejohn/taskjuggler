import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { InboxItem } from '@/types';

export const useInboxStore = defineStore('inbox', () => {
  const inboxItems = ref<InboxItem[]>([]);
  const currentItem = ref<InboxItem | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const unprocessedItems = computed(() => 
    inboxItems.value.filter(item => item.status === 'unprocessed')
  );
  const processedItems = computed(() => 
    inboxItems.value.filter(item => item.status === 'processed')
  );

  async function fetchInboxItems(params: Record<string, any> = {}) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/inbox', { params });
      const data = response.data;
      inboxItems.value = Array.isArray(data?.data) ? data.data : data ?? [];
      pagination.value = {
        current_page: data?.current_page ?? 1,
        last_page: data?.last_page ?? 1,
        per_page: data?.per_page ?? 20,
        total: data?.total ?? 0,
      };
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch inbox';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchInboxItem(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/inbox/${id}`);
      currentItem.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch inbox item';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function processItem(id: string) {
    const response = await api.post(`/inbox/${id}/process`);
    const index = inboxItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      inboxItems.value[index] = response.data.inbox_item;
    }
    return response.data;
  }

  async function dismissItem(id: string) {
    const response = await api.post(`/inbox/${id}/dismiss`);
    const index = inboxItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      inboxItems.value[index] = response.data;
    }
    return response.data;
  }

  async function createTaskFromItem(id: string, data: { title: string; description?: string; priority?: string }) {
    const response = await api.post(`/inbox/${id}/create-task`, data);
    const index = inboxItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      inboxItems.value[index] = response.data;
    }
    return response.data;
  }

  return {
    inboxItems,
    currentItem,
    loading,
    error,
    pagination,
    unprocessedItems,
    processedItems,
    fetchInboxItems,
    fetchInboxItem,
    processItem,
    dismissItem,
    createTaskFromItem,
  };
});
