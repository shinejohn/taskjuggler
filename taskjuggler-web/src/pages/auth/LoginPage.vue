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
          Sign in to Task Juggler
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Manage your tasks and workflows efficiently
        </p>
      </div>
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <LoginForm
          app-name="Task Juggler"
          @success="handleSuccess"
          @sign-up="handleSignUp"
          @forgot-password="handleForgotPassword"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

function handleSuccess() {
  // Update auth store with user data
  authStore.fetchUser()
  router.push('/dashboard')
}

function handleSignUp() {
  router.push('/register')
}

function handleForgotPassword() {
  router.push('/forgot-password')
}
</script>
