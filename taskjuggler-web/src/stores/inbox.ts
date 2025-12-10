import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { InboxItem } from '@/types';

export const useInboxStore = defineStore('inbox', () => {
  const inboxItems = ref<InboxItem[]>([]);
  const currentItem = ref<InboxItem | null>(null);
  const loading = ref(false);
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
    try {
      const response = await api.get('/inbox', { params });
      inboxItems.value = response.data.data;
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      };
    } finally {
      loading.value = false;
    }
  }

  async function fetchInboxItem(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/inbox/${id}`);
      currentItem.value = response.data;
      return response.data;
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
