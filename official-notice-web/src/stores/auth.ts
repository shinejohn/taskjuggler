import { ref, computed } from 'vue'
import { authApi } from '../services/api'
import type { User } from '../types'

const user = ref<User | null>(null)
const token = ref<string | null>(null)
const loading = ref(false)

// Initialize from localStorage
const storedToken = localStorage.getItem('auth_token')
const storedUser = localStorage.getItem('user')
if (storedToken) token.value = storedToken
if (storedUser) {
    try {
        user.value = JSON.parse(storedUser)
    } catch (e) {
        localStorage.removeItem('user')
    }
}

export function useAuthStore() {
    const isAuthenticated = computed(() => !!token.value && !!user.value)

    const login = async (email: string, password: string) => {
        loading.value = true
        try {
            const response = await authApi.login(email, password)
            token.value = response.token
            user.value = response.user
            localStorage.setItem('auth_token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))
            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            }
        } finally {
            loading.value = false
        }
    }

    const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
        loading.value = true
        try {
            const response = await authApi.register(name, email, password, passwordConfirmation)
            token.value = response.token
            user.value = response.user
            localStorage.setItem('auth_token', response.token)
            localStorage.setItem('user', JSON.stringify(response.user))
            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            }
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        try {
            await authApi.logout()
        } catch (e) {
            // Ignore errors
        }
        token.value = null
        user.value = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
    }

    const checkAuth = async () => {
        if (!token.value) return false
        try {
            const userData = await authApi.me()
            user.value = userData
            localStorage.setItem('user', JSON.stringify(userData))
            return true
        } catch (e) {
            token.value = null
            user.value = null
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            return false
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
        checkAuth
    }
}
