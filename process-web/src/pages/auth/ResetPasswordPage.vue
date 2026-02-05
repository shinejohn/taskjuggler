<template>
  <ResetPasswordPageTemplate
    app-name="Process"
    app-tagline="Workflow Automation"
    :logo-icon="Workflow"
    logo-gradient="bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
    tagline-color="text-cyan-400"
    primary-glow="bg-cyan-500/10"
    secondary-glow="bg-blue-500/10"
    input-focus-color="focus:border-cyan-500"
    button-gradient="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-500/30 hover:shadow-cyan-500/40"
    link-color="text-cyan-400 hover:text-cyan-300"
    login-route="/login"
    forgot-password-route="/forgot-password"
    token-param="token"
    :on-submit="handleResetPassword"
  />
</template>

<script setup lang="ts">
import ResetPasswordPageTemplate from '../../../../shared-ui/src/templates/auth/ResetPasswordPageTemplate.vue'
import { Workflow } from 'lucide-vue-next'
import apiClient from '@/api/client'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

async function handleResetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
  const email = route.query.email as string
  
  if (!email) {
    throw new Error('Email is required for password reset')
  }

  await apiClient.post('/auth/reset-password', {
    token,
    email,
    password,
    password_confirmation: passwordConfirmation,
  })
  
  router.push('/login')
}
</script>
