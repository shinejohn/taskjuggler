<template>
  <div>
    <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start">
      <ExclamationCircleIcon class="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <span>{{ error }}</span>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a
            href="#"
            @click.prevent="onForgotPassword"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            Signing in...
          </span>
          <span v-else>Sign in</span>
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
          <span class="px-2 bg-white text-gray-500">
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
          <span v-else>Sign in with Google</span>
        </button>
      </div>
    </div>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <a
          href="#"
          @click.prevent="onSignUp"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          Sign up
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/client'

interface Props {
  appName?: string
  redirectUri?: string
}

const props = withDefaults(defineProps<Props>(), {
  appName: 'Projects.ai',
  redirectUri: undefined,
})

const emit = defineEmits<{
  success: []
  signUp: []
  forgotPassword: []
}>()

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })
    emit('success')
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  googleLoading.value = true
  error.value = ''
  try {
    // Get Google OAuth URL from API
    const redirectUri = props.redirectUri || `${window.location.origin}/auth/google/callback`
    const response = await apiClient.get('/auth/google/url', {
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
    error.value = err.response?.data?.message || 'Failed to initiate Google login. Please try again.'
    googleLoading.value = false
  }
}

function onSignUp() {
  emit('signUp')
}

function onForgotPassword() {
  emit('forgotPassword')
}
</script>

