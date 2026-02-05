import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('auth_token'))

    const isAuthenticated = computed(() => !!token.value && !!user.value)

    async function login(credentials) {
        try {
            const response = await axios.post('/auth/login', credentials)
            token.value = response.data.token
            user.value = response.data.user
            localStorage.setItem('auth_token', token.value)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    async function register(data) {
        try {
            const response = await axios.post('/auth/register', data)
            token.value = response.data.token
            user.value = response.data.user
            localStorage.setItem('auth_token', token.value)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }

    async function logout() {
        try {
            await axios.post('/auth/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            token.value = null
            user.value = null
            localStorage.removeItem('auth_token')
        }
    }

    async function fetchUser() {
        if (!token.value) return

        try {
            const response = await axios.get('/auth/user')
            user.value = response.data.user
        } catch (error) {
            if (error.response?.status === 401) {
                logout()
            }
        }
    }

    // Initialize user if token exists
    if (token.value) {
        fetchUser()
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        fetchUser
    }
})


