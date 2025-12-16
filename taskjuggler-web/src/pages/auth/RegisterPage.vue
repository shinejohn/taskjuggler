<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="label">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="input"
              placeholder="Your name"
            />
          </div>
          <div>
            <label for="email" class="label">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input"
              placeholder="Password"
            />
          </div>
          <div>
            <label for="password_confirmation" class="label">Confirm Password</label>
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              type="password"
              required
              class="input"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating account...
            </span>
            <span v-else>Create account</span>
          </button>
        </div>
      </form>

      <!-- Google SSO -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div class="mt-6">
          <button
            type="button"
            :disabled="loading || googleLoading"
            @click="handleGoogleLogin"
            class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            <span v-if="googleLoading">Connecting...</span>
            <span v-else>Sign up with Google</span>
          </button>
        </div>
      </div>

      <div class="mt-6 text-center">
        <router-link
          to="/login"
          class="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Already have an account? Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/api'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const googleLoading = ref(false)

async function handleRegister() {
  loading.value = true
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    if ((window as any).$toast) {
      (window as any).$toast.success('Registration successful')
    }
    router.push('/dashboard')
  } catch (error) {
    // Error handled by API interceptor
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  googleLoading.value = true
  try {
    // Get Google OAuth URL from API
    const redirectUri = `${window.location.origin}/auth/google/callback`
    const response = await api.get('/auth/google/url', {
      params: { redirect_uri: redirectUri },
    })
    
    const oauthUrl = response.data.data?.url || response.data.url
    if (oauthUrl) {
      // Redirect to Google OAuth
      window.location.href = oauthUrl
    } else {
      throw new Error('Failed to get Google OAuth URL')
    }
  } catch (err: any) {
    if ((window as any).$toast) {
      (window as any).$toast.error(err.response?.data?.message || 'Failed to initiate Google sign up. Please try again.')
    }
    googleLoading.value = false
  }
}
</script>
