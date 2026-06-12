import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { TeamMember } from '@/types';

/** Map API member shape to TeamMember */
function mapApiMember(m: { id: string; name: string; email?: string; avatar_url?: string; is_admin?: boolean; joined_at?: string }) {
  return {
    id: m.id,
    owner_id: '',
    name: m.name,
    email: m.email,
    phone: undefined,
    role: m.is_admin ? 'Admin' : 'Member',
    can_receive_tasks: true,
    user: { id: m.id, name: m.name, email: m.email || '', phone: undefined, timezone: '', plan: 'free' as const, settings: {} },
    created_at: m.joined_at || '',
    updated_at: m.joined_at || '',
  } as TeamMember;
}

export const useTeamStore = defineStore('team', () => {
  const teamMembers = ref<TeamMember[]>([]);
  const currentMember = ref<TeamMember | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentTeamId = ref<string | null>(null);

  async function fetchTeamMembers() {
    loading.value = true;
    error.value = null;
    try {
      const teamsRes = await api.get('/teams');
      const teams = teamsRes.data?.teams ?? teamsRes.data?.data ?? [];
      if (teams.length === 0) {
        teamMembers.value = [];
        currentTeamId.value = null;
        return;
      }
      const teamId = teams[0].id;
      currentTeamId.value = teamId;
      const membersRes = await api.get(`/teams/${teamId}/members`);
      const members = membersRes.data?.members ?? [];
      teamMembers.value = members.map(mapApiMember);
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to load team members';
      teamMembers.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchTeamMember(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const member = teamMembers.value.find(m => m.id === id);
      if (member) {
        currentMember.value = member;
        return member;
      }
      if (currentTeamId.value) {
        const membersRes = await api.get(`/teams/${currentTeamId.value}/members`);
        const members = membersRes.data?.members ?? [];
        const found = members.find((m: any) => m.id === id);
        if (found) {
          currentMember.value = mapApiMember(found);
          return currentMember.value;
        }
      }
      return null;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to load member';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createTeamMember(data: Partial<TeamMember>) {
    error.value = null;
    if (!currentTeamId.value) throw new Error('No team selected');
    if (!data.email && !data.phone) throw new Error('Email or phone required to invite');
    const response = await api.post(`/teams/${currentTeamId.value}/invite`, {
      email: data.email,
      phone: data.phone,
      name: data.name,
    });
    await fetchTeamMembers();
    return response.data;
  }

  async function updateTeamMember(_id: string, _data: Partial<TeamMember>) {
    error.value = null;
    await fetchTeamMembers();
  }

  async function deleteTeamMember(id: string) {
    error.value = null;
    if (!currentTeamId.value) throw new Error('No team selected');
    await api.delete(`/teams/${currentTeamId.value}/members/${id}`);
    teamMembers.value = teamMembers.value.filter(m => m.id !== id);
    if (currentMember.value?.id === id) currentMember.value = null;
  }

  return {
    teamMembers,
    currentMember,
    loading,
    error,
    currentTeamId,
    fetchTeamMembers,
    fetchTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
});
