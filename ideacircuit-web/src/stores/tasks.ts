import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  due_date?: string;
  meeting_id?: string;
  created_at: string;
  updated_at: string;
}

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

  async function fetchTasks(params: Record<string, any> = {}) {
    loading.value = true;
    try {
      const response = await api.get('/tasks', { params });
      const fetchedTasks = response.data.data || response.data;
      tasks.value = Array.isArray(fetchedTasks) ? fetchedTasks : [];
      pagination.value = response.data.pagination || pagination.value;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTask(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/tasks/${id}`);
      const task = response.data.data || response.data;
      currentTask.value = task;
      return task;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function createTask(data: Partial<Task>) {
    const response = await api.post('/tasks', data);
    const task = response.data.data || response.data;
    tasks.value = [task, ...tasks.value];
    return task;
  }

  async function updateTask(id: string, data: Partial<Task>) {
    const response = await api.put(`/tasks/${id}`, data);
    const updatedTask = response.data.data || response.data;
    tasks.value = tasks.value.map((t) => (t.id === id ? updatedTask : t));
    if (currentTask.value?.id === id) {
      currentTask.value = updatedTask;
    }
    return updatedTask;
  }

  async function completeTask(id: string) {
    const response = await api.post(`/tasks/${id}/complete`);
    const completedTask = response.data.data || response.data;
    tasks.value = tasks.value.map((t) => (t.id === id ? completedTask : t));
    if (currentTask.value?.id === id) {
      currentTask.value = completedTask;
    }
    return completedTask;
  }

  async function deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
    tasks.value = tasks.value.filter((t) => t.id !== id);
    if (currentTask.value?.id === id) {
      currentTask.value = null;
    }
  }

  async function createTaskFromMeeting(meetingId: string, data: Partial<Task>) {
    const response = await api.post(`/ideacircuit/meetings/${meetingId}/tasks`, data);
    const task = response.data.data || response.data;
    tasks.value = [task, ...tasks.value];
    return task;
  }

  async function getMeetingTasks(meetingId: string) {
    const response = await api.get(`/ideacircuit/meetings/${meetingId}/tasks`);
    const fetchedTasks = response.data.data || response.data;
    return Array.isArray(fetchedTasks) ? fetchedTasks : [];
  }

  return {
    tasks,
    currentTask,
    loading,
    pagination,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    createTaskFromMeeting,
    getMeetingTasks,
  };
});

