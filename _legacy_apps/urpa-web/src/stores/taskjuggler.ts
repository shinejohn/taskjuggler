import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { TaskJugglerLink } from '@/types/integration';

export const useTaskJugglerStore = defineStore('taskjuggler', () => {
  const linked = ref(false);
  const link = ref<TaskJugglerLink | null>(null);
  const tasks = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function checkStatus() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/integrations/taskjuggler/status');
      linked.value = (response.data.data && response.data.data.linked) || response.data.linked || false;
      link.value = (response.data.data && response.data.data.link) || response.data.link || null;
      return response.data.data || response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to check status';
      linked.value = false;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function linkAccount(data: {
    taskjuggler_user_id: string;
    sync_tasks?: boolean;
    sync_projects?: boolean;
    auto_create_tasks?: boolean;
  }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/integrations/taskjuggler/link', data);
      const result = response.data.data || response.data;
      linked.value = true;
      link.value = result;
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to link account';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function sync() {
    loading.value = true;
    error.value = null;
    try {
      await api.post('/urpa/integrations/taskjuggler/sync');
      await fetchTasks();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to sync';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/integrations/taskjuggler/tasks');
      tasks.value = response.data.data || response.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load tasks';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createTask(data: {
    title: string;
    description?: string;
    priority?: string;
    due_date?: string;
  }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/integrations/taskjuggler/tasks', data);
      const result = response.data.data || response.data;
      tasks.value.unshift(result);
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    linked,
    link,
    tasks,
    loading,
    error,
    checkStatus,
    linkAccount,
    sync,
    fetchTasks,
    createTask,
  };
});

