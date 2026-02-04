import { create } from 'zustand';
import api from '../utils/api';
import type { InboxItem } from '../types';

interface InboxState {
  inboxItems: InboxItem[];
  currentItem: InboxItem | null;
  loading: boolean;
  fetchInboxItems: (params?: Record<string, any>) => Promise<void>;
  fetchInboxItem: (id: string) => Promise<void>;
  processItem: (id: string) => Promise<void>;
  dismissItem: (id: string) => Promise<void>;
  createTaskFromItem: (id: string, data: { title: string; description?: string; priority?: string }) => Promise<void>;
}

export const useInboxStore = create<InboxState>((set) => ({
  inboxItems: [],
  currentItem: null,
  loading: false,

  fetchInboxItems: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/inbox', { params });
      set({ inboxItems: response.data.data || response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchInboxItem: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/inbox/${id}`);
      set({ currentItem: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  processItem: async (id: string) => {
    const response = await api.post(`/inbox/${id}/process`);
    set((state) => ({
      inboxItems: state.inboxItems.map((item) =>
        item.id === id ? response.data.inbox_item : item
      ),
    }));
  },

  dismissItem: async (id: string) => {
    const response = await api.post(`/inbox/${id}/dismiss`);
    set((state) => ({
      inboxItems: state.inboxItems.map((item) => (item.id === id ? response.data : item)),
    }));
  },

  createTaskFromItem: async (id: string, data: { title: string; description?: string; priority?: string }) => {
    await api.post(`/inbox/${id}/create-task`, data);
    set((state) => ({
      inboxItems: state.inboxItems.map((item) =>
        item.id === id ? { ...item, status: 'processed' as const } : item
      ),
    }));
  },
}));
