import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { Task } from '@/types';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const loading = ref(false);
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const pendingTasks = computed(() => tasks.value.filter(t => t.status === 'pending'));
  const activeTasks = computed(() => tasks.value.filter(t => ['accepted', 'in_progress'].includes(t.status)));
  const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed'));

  async function fetchTasks(params: Record<string, any> = {}) {
    loading.value = true;
    try {
      const response = await api.get('/tasks', { params });
      tasks.value = response.data.data;
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

  async function fetchTask(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/tasks/${id}`);
      currentTask.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createTask(data: Partial<Task>) {
    const response = await api.post('/tasks', data);
    tasks.value.unshift(response.data);
    return response.data;
  }

  async function updateTask(id: string, data: Partial<Task>) {
    const response = await api.put(`/tasks/${id}`, data);
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
    if (currentTask.value?.id === id) {
      currentTask.value = response.data;
    }
    return response.data;
  }

  async function completeTask(id: string) {
    const response = await api.post(`/tasks/${id}/complete`);
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
    return response.data;
  }

  async function deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
    tasks.value = tasks.value.filter((t: Task) => t.id !== id);
  }

  async function createInvitation(taskId: string, data: { email?: string; phone?: string; name?: string; role?: string }) {
    const response = await api.post(`/tasks/${taskId}/invite`, data);
    return response.data;
  }

  async function exportTef(taskId: string) {
    const response = await api.get(`/tasks/${taskId}/export/tef`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async function importTef(tefData: any) {
    const response = await api.post('/tasks/import/tef', { tef: tefData });
    tasks.value.unshift(response.data.task);
    return response.data.task;
  }

  return {
    tasks,
    currentTask,
    loading,
    pagination,
    pendingTasks,
    activeTasks,
    completedTasks,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    createInvitation,
    exportTef,
    importTef,
  };
});
