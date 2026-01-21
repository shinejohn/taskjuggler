import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('coordinator_token'));
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', { email, password });
      const responseData = response.data.data || response.data;
      token.value = responseData.token;
      user.value = responseData.user;
      if (token.value) {
        localStorage.setItem('coordinator_token', token.value as string);
      }
      return response.data;
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
        localStorage.setItem('coordinator_token', token.value as string);
      }
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('coordinator_token');
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await api.get('/auth/user');
      user.value = response.data;
    } catch (error) {
      await logout();
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  };
});

