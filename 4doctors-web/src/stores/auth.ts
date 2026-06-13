import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { User, LoginResponse } from '@/types/user';
import { UserRole } from '@/types/user';

// DEV MODE: Set to true to bypass authentication for local testing
const DEV_MODE = import.meta.env.DEV;

export const useAuthStore = defineStore('auth', () => {
    // Mock users for each role during development
    const mockUsers: Record<string, User> = {
        provider: {
            id: '999',
            name: 'Dr. Dev Provider',
            email: 'dev@4doctors.ai',
            role: UserRole.PROVIDER,
            roles: ['provider-admin', 'physician'],
            permissions: ['dashboard.*', 'patients.*', 'scheduling.*', 'clinical.*', 'billing.*', 'admin.*'],
            specialty: 'Internal Medicine'
        },
        staff: {
            id: '888',
            name: 'Sarah Receptionist',
            email: 'staff@4doctors.ai',
            role: UserRole.STAFF,
            specialty: 'Front Desk'
        },
        patient: {
            id: '777',
            name: 'John Patient',
            email: 'patient@4doctors.ai',
            role: UserRole.PATIENT
        },
        admin: {
            id: '666',
            name: 'Admin User',
            email: 'admin@4doctors.ai',
            role: UserRole.ADMIN,
            roles: ['provider-admin'],
            permissions: ['*']
        },
        nurse: {
            id: '555',
            name: 'Nancy Nurse',
            email: 'nurse@4doctors.ai',
            role: UserRole.NURSE,
            specialty: 'Triage'
        }
    };

    const user = ref<User | null>(DEV_MODE ? (mockUsers.provider || null) : null);
    const token = ref<string | null>(DEV_MODE ? 'dev-token' : localStorage.getItem('4doctors_token'));
    const loading = ref(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => DEV_MODE || !!token.value);

    // DEV ONLY: Switch between roles for testing
    function setDevRole(role: string) {
        if (DEV_MODE) {
            user.value = mockUsers[role] || null;
        }
    }

    async function login(email: string, password: string): Promise<LoginResponse> {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post<LoginResponse>('/auth/login', { email, password });
            const responseData = response.data as LoginResponse & { data?: LoginResponse };
            // Handle potentially wrapped/unwrapped responses from platform
            const data = responseData.data || responseData;

            token.value = data.token;
            user.value = data.user;

            if (token.value) {
                localStorage.setItem('4doctors_token', token.value);
            }

            return data;
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            error.value = axiosErr.response?.data?.message || 'Login failed';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function register(registrationData: { name: string; email: string; password: string; password_confirmation: string }): Promise<LoginResponse> {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post<LoginResponse>('/auth/register', registrationData);
            const responseData = response.data as LoginResponse & { data?: LoginResponse };
            const result = responseData.data || responseData;

            token.value = result.token;
            user.value = result.user;

            if (token.value) {
                localStorage.setItem('4doctors_token', token.value);
            }

            return result;
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            error.value = axiosErr.response?.data?.message || 'Registration failed';
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

    const isStaff = computed(() => user.value?.role === UserRole.STAFF || user.value?.role === UserRole.RECEPTIONIST);
    const isProvider = computed(() => !user.value?.role || user.value?.role === UserRole.PROVIDER || user.value?.role === UserRole.DOCTOR);
    const isAdmin = computed(() => user.value?.role === UserRole.ADMIN);
    const isPatient = computed(() => user.value?.role === UserRole.PATIENT);
    const isNurse = computed(() => user.value?.role === UserRole.NURSE || user.value?.role === UserRole.MA);

    // RBAC Helpers
    function hasRole(roleSlug: string): boolean {
        if (!user.value) return false;
        // Check primary role
        if (user.value.role === roleSlug) return true;
        // Check dynamic roles
        return user.value.roles?.includes(roleSlug) || false;
    }

    function can(permission: string): boolean {
        if (!user.value) return false;
        // Admin override
        if (isAdmin.value || hasRole('provider-admin') || user.value.permissions?.includes('*')) return true;

        const userPerms = user.value.permissions || [];
        // Check exact match
        if (userPerms.includes(permission)) return true;

        // Check wildcard match (e.g. 'patients.*')
        const parts = permission.split('.');
        if (parts.length > 1) {
            const wildcard = `${parts[0]}.*`;
            if (userPerms.includes(wildcard)) return true;
        }

        return false;
    }

    // Composite permissions
    const isClinical = computed(() => isProvider.value || isNurse.value);
    const hasPracticeAccess = computed(() => isProvider.value || isNurse.value || isStaff.value);
    const hasBusinessAccess = computed(() => isProvider.value || isAdmin.value || isStaff.value);

    return {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        isStaff,
        isProvider,
        isAdmin,
        isPatient,
        isNurse,
        isClinical,
        hasPracticeAccess,
        hasBusinessAccess,
        login,
        register,
        logout,
        fetchUser,
        setDevRole, // DEV ONLY
        can,
        hasRole
    };
});
