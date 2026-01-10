import { create } from 'zustand';
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

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  fetchTasks: (params?: Record<string, any>) => Promise<void>;
  fetchTask: (id: string) => Promise<Task>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>;
  completeTask: (id: string) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  createTaskFromMeeting: (meetingId: string, data: Partial<Task>) => Promise<Task>;
  getMeetingTasks: (meetingId: string) => Promise<Task[]>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  },

  fetchTasks: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/tasks', { params });
      const tasks = response.data.data || response.data;
      set({
        tasks: Array.isArray(tasks) ? tasks : [],
        pagination: response.data.pagination || get().pagination,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchTask: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/tasks/${id}`);
      const task = response.data.data || response.data;
      set({ currentTask: task, loading: false });
      return task;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    const task = response.data.data || response.data;
    set((state) => ({ tasks: [task, ...state.tasks] }));
    return task;
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await api.put(`/tasks/${id}`, data);
    const updatedTask = response.data.data || response.data;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
    }));
    return updatedTask;
  },

  completeTask: async (id: string) => {
    const response = await api.post(`/tasks/${id}/complete`);
    const completedTask = response.data.data || response.data;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? completedTask : t)),
      currentTask: state.currentTask?.id === id ? completedTask : state.currentTask,
    }));
    return completedTask;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      currentTask: state.currentTask?.id === id ? null : state.currentTask,
    }));
  },

  createTaskFromMeeting: async (meetingId: string, data: Partial<Task>) => {
    const response = await api.post(`/ideacircuit/meetings/${meetingId}/tasks`, data);
    const task = response.data.data || response.data;
    set((state) => ({ tasks: [task, ...state.tasks] }));
    return task;
  },

  getMeetingTasks: async (meetingId: string) => {
    const response = await api.get(`/ideacircuit/meetings/${meetingId}/tasks`);
    const tasks = response.data.data || response.data;
    return Array.isArray(tasks) ? tasks : [];
  },
}));

