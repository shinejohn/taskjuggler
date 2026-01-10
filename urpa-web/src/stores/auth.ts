import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { User, LoginResponse, RegisterData } from '@/types/user';
import { disconnectEcho } from '@/utils/echo';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('urpa_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(email: string, password: string): Promise<LoginResponse> {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('urpa_token', token.value);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: RegisterData): Promise<LoginResponse> {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post<LoginResponse>('/auth/register', data);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('urpa_token', token.value);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout(): Promise<void> {
    disconnectEcho();
    token.value = null;
    user.value = null;
    localStorage.removeItem('urpa_token');
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) return;
    try {
      const response = await api.get<User>('/auth/user');
      user.value = response.data;
    } catch (err) {
      await logout();
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  };
});

