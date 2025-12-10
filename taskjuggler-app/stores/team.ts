import { create } from 'zustand';
import api from '../utils/api';
import type { TeamMember } from '../types';

interface TeamState {
  teamMembers: TeamMember[];
  currentMember: TeamMember | null;
  loading: boolean;
  fetchTeamMembers: () => Promise<void>;
  fetchTeamMember: (id: string) => Promise<void>;
  createTeamMember: (data: Partial<TeamMember>) => Promise<TeamMember>;
  updateTeamMember: (id: string, data: Partial<TeamMember>) => Promise<TeamMember>;
  deleteTeamMember: (id: string) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
  teamMembers: [],
  currentMember: null,
  loading: false,

  fetchTeamMembers: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/team');
      set({ teamMembers: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchTeamMember: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/team/${id}`);
      set({ currentMember: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createTeamMember: async (data) => {
    const response = await api.post('/team', data);
    set((state) => ({ teamMembers: [...state.teamMembers, response.data] }));
    return response.data;
  },

  updateTeamMember: async (id: string, data: Partial<TeamMember>) => {
    const response = await api.put(`/team/${id}`, data);
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => (m.id === id ? response.data : m)),
      currentMember: state.currentMember?.id === id ? response.data : state.currentMember,
    }));
    return response.data;
  },

  deleteTeamMember: async (id: string) => {
    await api.delete(`/team/${id}`);
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.id !== id),
      currentMember: state.currentMember?.id === id ? null : state.currentMember,
    }));
  },
}));
