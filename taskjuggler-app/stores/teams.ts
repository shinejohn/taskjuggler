import { create } from 'zustand';
import api from '../utils/api';

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_by?: string;
  members_count?: number;
  tasks_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  is_admin: boolean;
  joined_at: string;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email?: string;
  phone?: string;
  invite_code: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at?: string;
  invite_url?: string;
}

interface TeamsState {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  loading: boolean;
  fetchTeams: () => Promise<void>;
  fetchTeam: (id: string) => Promise<void>;
  createTeam: (data: { name: string; description?: string }) => Promise<Team>;
  updateTeam: (id: string, data: Partial<Team>) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;
  fetchTeamMembers: (teamId: string) => Promise<void>;
  inviteToTeam: (teamId: string, data: { email?: string; phone?: string; name?: string }) => Promise<TeamInvitation>;
  removeMember: (teamId: string, userId: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
  fetchTeamTasks: (teamId: string) => Promise<any>;
  getInvitation: (inviteCode: string) => Promise<any>;
  acceptInvitation: (inviteCode: string) => Promise<void>;
}

export const useTeamsStore = create<TeamsState>((set, get) => ({
  teams: [],
  currentTeam: null,
  teamMembers: [],
  loading: false,

  fetchTeams: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/teams');
      set({ teams: response.data.teams || [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchTeam: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/teams/${id}`);
      set({ currentTeam: response.data.team, loading: false });
      return response.data.team;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createTeam: async (data) => {
    const response = await api.post('/teams', data);
    set((state) => ({ teams: [...state.teams, response.data.team] }));
    return response.data.team;
  },

  updateTeam: async (id: string, data: Partial<Team>) => {
    const response = await api.put(`/teams/${id}`, data);
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? response.data.team : t)),
      currentTeam: state.currentTeam?.id === id ? response.data.team : state.currentTeam,
    }));
    return response.data.team;
  },

  deleteTeam: async (id: string) => {
    await api.delete(`/teams/${id}`);
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      currentTeam: state.currentTeam?.id === id ? null : state.currentTeam,
    }));
  },

  fetchTeamMembers: async (teamId: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      set({ teamMembers: response.data.members || [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  inviteToTeam: async (teamId: string, data) => {
    const response = await api.post(`/teams/${teamId}/invite`, data);
    return response.data.invitation;
  },

  removeMember: async (teamId: string, userId: string) => {
    await api.delete(`/teams/${teamId}/members/${userId}`);
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.id !== userId),
    }));
  },

  leaveTeam: async (teamId: string) => {
    await api.post(`/teams/${teamId}/leave`);
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== teamId),
      currentTeam: state.currentTeam?.id === teamId ? null : state.currentTeam,
    }));
  },

  fetchTeamTasks: async (teamId: string) => {
    const response = await api.get(`/teams/${teamId}/tasks`);
    return response.data;
  },

  getInvitation: async (inviteCode: string) => {
    const response = await api.get(`/teams/invite/${inviteCode}`);
    return response.data;
  },

  acceptInvitation: async (inviteCode: string) => {
    await api.post(`/teams/join/${inviteCode}`);
    await get().fetchTeams(); // Refresh teams list
  },
}));
