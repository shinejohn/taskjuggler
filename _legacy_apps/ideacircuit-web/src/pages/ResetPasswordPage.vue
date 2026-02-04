<template>
  <ResetPasswordPageTemplate
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
    login-route="/login"
    forgot-password-route="/forgot-password"
    token-param="token"
    :on-submit="handleResetPassword"
  />
</template>

<script setup lang="ts">
import ResetPasswordPageTemplate from '../../../shared-ui/src/templates/auth/ResetPasswordPageTemplate.vue'
import { Sparkles } from 'lucide-vue-next'
import api from '@/services/api'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

async function handleResetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
  const email = route.query.email as string
  
  if (!email) {
    throw new Error('Email is required for password reset')
  }

  await api.post('/auth/reset-password', {
    token,
    email,
    password,
    password_confirmation: passwordConfirmation,
  })
  
  router.push('/login')
}
</script>



