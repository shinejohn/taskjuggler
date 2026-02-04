import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { User, LoginResponse } from '@/types/user';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem('4doctors_token'));
    const loading = ref(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    async function login(email: string, password: string): Promise<LoginResponse> {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post<LoginResponse>('/auth/login', { email, password });
            const responseData: any = response.data;
            // Handle potentially wrapped/unwrapped responses from platform
            const data = responseData.data || responseData;

            token.value = data.token;
            user.value = data.user;

            if (token.value) {
                localStorage.setItem('4doctors_token', token.value);
            }

            return data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Login failed';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function register(data: any): Promise<LoginResponse> {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post<LoginResponse>('/auth/register', data);
            const responseData: any = response.data;
            const result = responseData.data || responseData;

            token.value = result.token;
            user.value = result.user;

            if (token.value) {
                localStorage.setItem('4doctors_token', token.value);
            }

            return result;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Registration failed';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function logout(): Promise<void> {
        token.value = null;
        user.value = null;
        localStorage.removeItem('4doctors_token');
    }

    async function fetchUser(): Promise<void> {
        if (!token.value) return;
        try {
            const response = await api.get('/auth/user');
            user.value = response.data.data || response.data;
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
