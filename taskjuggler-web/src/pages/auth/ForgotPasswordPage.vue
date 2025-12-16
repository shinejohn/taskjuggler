<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            TJ
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="success" class="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {{ success }}
        </div>
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start">
          <ExclamationCircleIcon class="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
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
                Sending...
              </span>
              <span v-else>Send reset link</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <router-link
            to="/login"
            class="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Back to login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { EnvelopeIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import api from '@/utils/api'

const router = useRouter()
const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    success.value = 'Password reset link has been sent to your email address.'
    email.value = ''
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

