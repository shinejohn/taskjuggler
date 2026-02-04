<template>
  <ResetPasswordPageTemplate
    app-name="Urpa"
    app-tagline="Your Personal Assistant"
    :logo-icon="Command"
    logo-gradient="bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20"
    tagline-color="text-teal-400"
    primary-glow="bg-teal-500/10"
    secondary-glow="bg-blue-500/10"
    input-focus-color="focus:border-teal-500"
    button-gradient="bg-gradient-to-r from-teal-600 to-blue-600 shadow-teal-500/30 hover:shadow-teal-500/40"
    link-color="text-teal-400 hover:text-teal-300"
    login-route="/login"
    forgot-password-route="/forgot-password"
    token-param="token"
    :on-submit="handleResetPassword"
  />
</template>

<script setup lang="ts">
import ResetPasswordPageTemplate from '../../../shared-ui/src/templates/auth/ResetPasswordPageTemplate.vue'
import { Command } from 'lucide-vue-next'
import api from '@/utils/api'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

async function handleResetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
  // Get email from query params or request it
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
  
  // Redirect to login after successful reset
  router.push('/login')
}
</script>

