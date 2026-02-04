import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { TeamMember } from '@/types';

export const useTeamStore = defineStore('team', () => {
  const teamMembers = ref<TeamMember[]>([]);
  const currentMember = ref<TeamMember | null>(null);
  const loading = ref(false);

  async function fetchTeamMembers() {
    loading.value = true;
    try {
      const response = await api.get('/team');
      teamMembers.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTeamMember(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/team/${id}`);
      currentMember.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createTeamMember(data: Partial<TeamMember>) {
    const response = await api.post('/team', data);
    teamMembers.value.push(response.data);
    return response.data;
  }

  async function updateTeamMember(id: string, data: Partial<TeamMember>) {
    const response = await api.put(`/team/${id}`, data);
    const index = teamMembers.value.findIndex(m => m.id === id);
    if (index !== -1) {
      teamMembers.value[index] = response.data;
    }
    if (currentMember.value?.id === id) {
      currentMember.value = response.data;
    }
    return response.data;
  }

  async function deleteTeamMember(id: string) {
    await api.delete(`/team/${id}`);
    teamMembers.value = teamMembers.value.filter(m => m.id !== id);
  }

  return {
    teamMembers,
    currentMember,
    loading,
    fetchTeamMembers,
    fetchTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
});
