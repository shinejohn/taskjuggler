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
      // Handle both response formats: { data: { token, user } } or { token, user }
      const responseData = response.data.data || response.data;
      token.value = responseData.token;
      user.value = responseData.user;
      if (token.value) {
        localStorage.setItem('token', token.value);
        initializeEcho(token.value);
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      // Re-throw to let the component handle it
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    loading.value = true;
    try {
      const response = await api.post('/auth/register', data);
      // Handle both response formats: { data: { token, user } } or { token, user }
      const responseData = response.data.data || response.data;
      token.value = responseData.token;
      user.value = responseData.user;
      if (token.value) {
        localStorage.setItem('token', token.value);
        initializeEcho(token.value);
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      // Re-throw to let the component handle it
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await api.get('/auth/user');
      // Handle both response formats: { data: { ... } } or { ... }
      user.value = response.data.data || response.data;
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
