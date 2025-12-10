import { create } from 'zustand';
import api from '../utils/api';
import type { RoutingRule } from '../types';

interface RulesState {
  rules: RoutingRule[];
  currentRule: RoutingRule | null;
  loading: boolean;
  fetchRules: () => Promise<void>;
  fetchRule: (id: string) => Promise<void>;
  createRule: (data: Partial<RoutingRule>) => Promise<RoutingRule>;
  updateRule: (id: string, data: Partial<RoutingRule>) => Promise<RoutingRule>;
  deleteRule: (id: string) => Promise<void>;
}

export const useRulesStore = create<RulesState>((set) => ({
  rules: [],
  currentRule: null,
  loading: false,

  fetchRules: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/routing-rules');
      set({ rules: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchRule: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/routing-rules/${id}`);
      set({ currentRule: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createRule: async (data) => {
    const response = await api.post('/routing-rules', data);
    set((state) => ({ rules: [...state.rules, response.data] }));
    return response.data;
  },

  updateRule: async (id: string, data: Partial<RoutingRule>) => {
    const response = await api.put(`/routing-rules/${id}`, data);
    set((state) => ({
      rules: state.rules.map((r) => (r.id === id ? response.data : r)),
      currentRule: state.currentRule?.id === id ? response.data : state.currentRule,
    }));
    return response.data;
  },

  deleteRule: async (id: string) => {
    await api.delete(`/routing-rules/${id}`);
    set((state) => ({
      rules: state.rules.filter((r) => r.id !== id),
      currentRule: state.currentRule?.id === id ? null : state.currentRule,
    }));
  },
}));
