<template>
  <LoginPageTemplate
    app-name="URPA"
    app-tagline="Your Personal Assistant"
    :logo-icon="Command"
    logo-gradient="bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20"
    tagline-color="text-teal-400"
    primary-glow="bg-teal-500/10"
    secondary-glow="bg-blue-500/10"
    input-focus-color="focus:border-teal-500"
    button-gradient="bg-gradient-to-r from-teal-600 to-blue-600 shadow-teal-500/30 hover:shadow-teal-500/40"
    link-color="text-teal-400 hover:text-teal-300"
    sign-up-route="/signup"
    forgot-password-route="/forgot-password"
    :on-submit="handleLogin"
    :show-social-login="true"
    @google-login="handleGoogleLogin"
  />
</template>

<script setup lang="ts">
import LoginPageTemplate from '../../../shared-ui/src/templates/auth/LoginPageTemplate.vue'
import { Command } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/utils/api'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin(email: string, password: string, _rememberMe: boolean): Promise<void> {
  await authStore.login(email, password)
  router.push('/dashboard')
}

async function handleGoogleLogin(): Promise<void> {
  try {
    const response = await api.get('/auth/google/url')
    if (response.data.url) {
      window.location.href = response.data.url
    }
  } catch (error) {
    authStore.error = 'Failed to initiate Google login'
  }
}
</script>
