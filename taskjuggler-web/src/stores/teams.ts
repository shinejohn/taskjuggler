import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';

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

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([]);
  const currentTeam = ref<Team | null>(null);
  const teamMembers = ref<TeamMember[]>([]);
  const teamInvitations = ref<TeamInvitation[]>([]);
  const loading = ref(false);

  async function fetchTeams() {
    loading.value = true;
    try {
      const response = await api.get('/teams');
      teams.value = response.data.teams || [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchTeam(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/teams/${id}`);
      currentTeam.value = response.data.team;
      return response.data.team;
    } finally {
      loading.value = false;
    }
  }

  async function createTeam(data: { name: string; description?: string }) {
    const response = await api.post('/teams', data);
    teams.value.push(response.data.team);
    return response.data.team;
  }

  async function updateTeam(id: string, data: Partial<Team>) {
    const response = await api.put(`/teams/${id}`, data);
    const index = teams.value.findIndex(t => t.id === id);
    if (index !== -1) {
      teams.value[index] = response.data.team;
    }
    if (currentTeam.value?.id === id) {
      currentTeam.value = response.data.team;
    }
    return response.data.team;
  }

  async function deleteTeam(id: string) {
    await api.delete(`/teams/${id}`);
    teams.value = teams.value.filter(t => t.id !== id);
    if (currentTeam.value?.id === id) {
      currentTeam.value = null;
    }
  }

  async function fetchTeamMembers(teamId: string) {
    loading.value = true;
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      teamMembers.value = response.data.members || [];
    } finally {
      loading.value = false;
    }
  }

  async function inviteToTeam(teamId: string, data: { email?: string; phone?: string; name?: string }) {
    const response = await api.post(`/teams/${teamId}/invite`, data);
    return response.data.invitation;
  }

  async function removeMember(teamId: string, userId: string) {
    await api.delete(`/teams/${teamId}/members/${userId}`);
    teamMembers.value = teamMembers.value.filter(m => m.id !== userId);
  }

  async function leaveTeam(teamId: string) {
    await api.post(`/teams/${teamId}/leave`);
    teams.value = teams.value.filter(t => t.id !== teamId);
    if (currentTeam.value?.id === teamId) {
      currentTeam.value = null;
    }
  }

  async function fetchTeamTasks(teamId: string, params: Record<string, any> = {}) {
    loading.value = true;
    try {
      const response = await api.get(`/teams/${teamId}/tasks`, { params });
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function getInvitation(inviteCode: string) {
    const response = await api.get(`/teams/invite/${inviteCode}`);
    return response.data;
  }

  async function acceptInvitation(inviteCode: string) {
    const response = await api.post(`/teams/join/${inviteCode}`);
    await fetchTeams(); // Refresh teams list
    return response.data;
  }

  return {
    teams,
    currentTeam,
    teamMembers,
    teamInvitations,
    loading,
    fetchTeams,
    fetchTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    fetchTeamMembers,
    inviteToTeam,
    removeMember,
    leaveTeam,
    fetchTeamTasks,
    getInvitation,
    acceptInvitation,
  };
});
