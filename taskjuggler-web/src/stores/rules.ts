import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { RoutingRule } from '@/types';

export const useRulesStore = defineStore('rules', () => {
  const rules = ref<RoutingRule[]>([]);
  const currentRule = ref<RoutingRule | null>(null);
  const loading = ref(false);

  async function fetchRules() {
    loading.value = true;
    try {
      const response = await api.get('/routing-rules');
      rules.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createRule(data: Partial<RoutingRule>) {
    const response = await api.post('/routing-rules', data);
    rules.value.push(response.data);
    return response.data;
  }

  async function updateRule(id: string, data: Partial<RoutingRule>) {
    const response = await api.put(`/routing-rules/${id}`, data);
    const index = rules.value.findIndex(r => r.id === id);
    if (index !== -1) {
      rules.value[index] = response.data;
    }
    return response.data;
  }

  async function deleteRule(id: string) {
    await api.delete(`/routing-rules/${id}`);
    rules.value = rules.value.filter(r => r.id !== id);
  }

  return {
    rules,
    currentRule,
    loading,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
  };
});
