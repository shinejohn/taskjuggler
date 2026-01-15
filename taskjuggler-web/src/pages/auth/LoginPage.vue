<template>
  <LoginPageTemplate
    app-name="Task Juggler"
    app-tagline="Manage Your Tasks Efficiently"
    :logo-icon="CheckSquare"
    logo-gradient="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
    tagline-color="text-emerald-400"
    primary-glow="bg-emerald-500/10"
    secondary-glow="bg-teal-500/10"
    input-focus-color="focus:border-emerald-500"
    button-gradient="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-500/40"
    link-color="text-emerald-400 hover:text-emerald-300"
    sign-up-route="/register"
    forgot-password-route="/forgot-password"
    :on-submit="handleLogin"
    :show-social-login="true"
    @google-login="handleGoogleLogin"
  />
</template>

<script setup lang="ts">
import LoginPageTemplate from '../../../shared-ui/src/templates/auth/LoginPageTemplate.vue'
import { CheckSquare } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/utils/api'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin(email: string, password: string, rememberMe: boolean): Promise<void> {
  await authStore.login(email, password)
  authStore.fetchUser()
  router.push('/dashboard')
}

async function handleGoogleLogin(): Promise<void> {
  const redirectUri = `${window.location.origin}/auth/google/callback`
  const response = await api.get('/auth/google/url', {
    params: { redirect_uri: redirectUri },
  })
  
  const oauthUrl = response.data.data?.url || response.data.url
  if (oauthUrl) {
    window.location.href = oauthUrl
  } else {
    throw new Error('Failed to get Google OAuth URL')
  }
}
</script>
