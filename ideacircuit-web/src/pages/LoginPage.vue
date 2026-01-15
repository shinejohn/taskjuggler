<template>
  <LoginPageTemplate
    app-name="IdeaCircuit"
    app-tagline="AI-Powered Meeting Solutions"
    :logo-icon="Sparkles"
    logo-gradient="bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/20"
    tagline-color="text-purple-400"
    primary-glow="bg-purple-500/10"
    secondary-glow="bg-pink-500/10"
    input-focus-color="focus:border-purple-500"
    button-gradient="bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30 hover:shadow-purple-500/40"
    link-color="text-purple-400 hover:text-purple-300"
    sign-up-route="/signup"
    forgot-password-route="/forgot-password"
    :on-submit="handleLogin"
    :show-social-login="false"
  />
</template>

<script setup lang="ts">
import LoginPageTemplate from '../../../shared-ui/src/templates/auth/LoginPageTemplate.vue'
import { Sparkles } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login } = useAuth()

async function handleLogin(email: string, password: string, rememberMe: boolean): Promise<void> {
  const result = await login(email, password)
  if (result.user) {
    router.push('/presentation')
  } else {
    throw new Error(result.error || 'Login failed')
  }
}
</script>
