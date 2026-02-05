<template>
  <ResetPasswordPageTemplate
    app-name="Task Juggler"
    app-tagline="Manage Your Tasks Efficiently"
    :logo-icon="CheckSquare"
    logo-gradient="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20"
    tagline-color="text-blue-400"
    primary-glow="bg-blue-500/10"
    secondary-glow="bg-indigo-500/10"
    input-focus-color="focus:border-blue-500"
    button-gradient="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30 hover:shadow-blue-500/40"
    link-color="text-blue-400 hover:text-blue-300"
    login-route="/login"
    forgot-password-route="/forgot-password"
    token-param="token"
    :on-submit="handleResetPassword"
  />
</template>

<script setup lang="ts">
import ResetPasswordPageTemplate from '@taskjuggler/ui/templates/auth/ResetPasswordPageTemplate.vue'
import { CheckSquare } from 'lucide-vue-next'
import api from '@/utils/api'
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
