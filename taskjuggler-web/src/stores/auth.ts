import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import { initializeEcho } from '@/utils/echo';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isPro = computed(() => user.value?.plan && ['pro', 'business'].includes(user.value.plan));

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', response.data.token);
      initializeEcho(response.data.token);
    } finally {
      loading.value = false;
    }
  }

  async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    loading.value = true;
    try {
      const response = await api.post('/auth/register', data);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', response.data.token);
      initializeEcho(response.data.token);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await api.get('/auth/user');
      user.value = response.data;
    } catch {
      logout();
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isPro,
    login,
    register,
    fetchUser,
    logout,
  };
});
