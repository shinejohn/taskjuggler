import { create } from 'zustand';
import api from '../utils/api';
import type { Task } from '../types';

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  fetchTasks: (params?: Record<string, any>) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>;
  completeTask: (id: string) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  currentTask: null,
  loading: false,

  fetchTasks: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/tasks', { params });
      set({ tasks: response.data.data || response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchTask: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/tasks/${id}`);
      set({ currentTask: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    set((state) => ({ tasks: [response.data, ...state.tasks] }));
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await api.put(`/tasks/${id}`, data);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
      currentTask: state.currentTask?.id === id ? response.data : state.currentTask,
    }));
    return response.data;
  },

  completeTask: async (id: string) => {
    const response = await api.post(`/tasks/${id}/complete`);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
      currentTask: state.currentTask?.id === id ? response.data : state.currentTask,
    }));
    return response.data;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      currentTask: state.currentTask?.id === id ? null : state.currentTask,
    }));
  },
}));
