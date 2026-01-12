import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', { email, password });
      const responseData = response.data.data || response.data;
      const newToken = responseData.token;
      const newUser = responseData.user;

      if (!newToken) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', newToken);
      token.value = newToken;
      user.value = newUser;
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
      const newToken = responseData.token;
      const newUser = responseData.user;

      if (!newToken) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', newToken);
      token.value = newToken;
      user.value = newUser;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    token.value = null;
    user.value = null;
  }

  async function fetchUser() {
    if (!token.value) return;

    try {
      const response = await api.get('/auth/user');
      const responseUser = response.data.data || response.data;
      user.value = responseUser;
    } catch (error) {
      logout();
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

