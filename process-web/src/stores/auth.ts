import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi, type User } from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isPro = computed(() => user.value?.plan && ['pro', 'business'].includes(user.value.plan));

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const response = await authApi.login(email, password);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('token', response.token);
    } finally {
      loading.value = false;
    }
  }

  async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    loading.value = true;
    try {
      const response = await authApi.register(data);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('token', response.token);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const userData = await authApi.getUser();
      user.value = userData;
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
