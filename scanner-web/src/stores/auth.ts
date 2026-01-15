import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { User, Team } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const currentTeam = ref<Team | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  // Initialize currentTeam from localStorage if available (will be set after fetchUser)
  const savedTeamId = localStorage.getItem('currentTeamId');

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', { email, password });
      const responseData = response.data.data || response.data;
      token.value = responseData.token;
      user.value = responseData.user;
      if (token.value) {
        localStorage.setItem('token', token.value);
        // Set default team if user has teams
        if (user.value?.teams && user.value.teams.length > 0) {
          const firstTeam = user.value.teams[0];
          if (firstTeam) {
            setCurrentTeam(firstTeam);
          }
        }
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    loading.value = true;
    try {
      const response = await api.post('/auth/register', data);
      const responseData = response.data.data || response.data;
      token.value = responseData.token;
      user.value = responseData.user;
      if (token.value) {
        localStorage.setItem('token', token.value);
        // Set default team if user has teams
        if (user.value?.teams && user.value.teams.length > 0) {
          const firstTeam = user.value.teams[0];
          if (firstTeam) {
            setCurrentTeam(firstTeam);
          }
        }
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await api.get('/auth/user');
      user.value = response.data.data || response.data;
      // Set current team from saved preference or default to first team
      if (user.value?.teams && user.value.teams.length > 0) {
        const firstTeam = user.value.teams[0];
        if (savedTeamId && firstTeam) {
          const team = user.value.teams.find(t => t.id.toString() === savedTeamId);
          if (team) {
            currentTeam.value = team;
          } else if (firstTeam) {
            // Saved team ID not found, set to first team
            setCurrentTeam(firstTeam);
          }
        } else if (firstTeam) {
          // No saved team, set to first team
          setCurrentTeam(firstTeam);
        }
      }
    } catch {
      logout();
    }
  }

  function setCurrentTeam(team: Team) {
    currentTeam.value = team;
    localStorage.setItem('currentTeamId', team.id.toString());
  }

  function hasPermission(permission: string): boolean {
    if (!user.value?.permissions) return false;
    return user.value.permissions.includes(permission);
  }

  function hasTeamRole(role: string): boolean {
    if (!currentTeam.value || !currentTeam.value.pivot) return false;
    return currentTeam.value.pivot.role === role;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue with logout even if API call fails
    } finally {
      user.value = null;
      token.value = null;
      currentTeam.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('currentTeamId');
    }
  }

  return {
    user,
    token,
    currentTeam,
    loading,
    isAuthenticated,
    login,
    register,
    fetchUser,
    setCurrentTeam,
    hasPermission,
    hasTeamRole,
    logout,
  };
});
