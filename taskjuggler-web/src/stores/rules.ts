import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { RoutingRule } from '@/types';

export const useRulesStore = defineStore('rules', () => {
  const rules = ref<RoutingRule[]>([]);
  const currentRule = ref<RoutingRule | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRules() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/routing-rules');
      const data = response.data;
      rules.value = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch rules';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createRule(data: Partial<RoutingRule>) {
    error.value = null;
    try {
      const response = await api.post('/routing-rules', data);
      rules.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to create rule';
      throw err;
    }
  }

  async function updateRule(id: string, data: Partial<RoutingRule>) {
    error.value = null;
    try {
      const response = await api.put(`/routing-rules/${id}`, data);
      const index = rules.value.findIndex(r => r.id === id);
      if (index !== -1) {
        rules.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to update rule';
      throw err;
    }
  }

  async function deleteRule(id: string) {
    error.value = null;
    try {
      await api.delete(`/routing-rules/${id}`);
      rules.value = rules.value.filter(r => r.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Failed to delete rule';
      throw err;
    }
  }

  return {
    rules,
    currentRule,
    loading,
    error,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
  };
});
