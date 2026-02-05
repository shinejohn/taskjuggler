import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type User, type LoginCredentials, type RegisterData } from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(credentials: LoginCredentials) {
    try {
      const response = await authApi.login(credentials)
      token.value = response.token
      user.value = response.user
      if (token.value) {
        localStorage.setItem('auth_token', token.value)
      }
      return response
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  async function register(data: RegisterData) {
    try {
      const response = await authApi.register(data)
      token.value = response.token
      user.value = response.user
      if (token.value) {
        localStorage.setItem('auth_token', token.value)
      }
      return response
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      router.push({ name: 'login' })
    }
  }

  async function fetchUser() {
    if (!token.value) return

    try {
      const userData = await authApi.getUser()
      user.value = userData
    } catch (error: any) {
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
    fetchUser,
  }
})

