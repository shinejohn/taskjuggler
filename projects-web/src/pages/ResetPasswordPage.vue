<template>
  <ResetPasswordPageTemplate
    app-name="Projects"
    app-tagline="Project Delivery Hub"
    :logo-icon="FolderKanban"
    logo-gradient="bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20"
    tagline-color="text-orange-400"
    primary-glow="bg-orange-500/10"
    secondary-glow="bg-red-500/10"
    input-focus-color="focus:border-orange-500"
    button-gradient="bg-gradient-to-r from-orange-600 to-red-600 shadow-orange-500/30 hover:shadow-orange-500/40"
    link-color="text-orange-400 hover:text-orange-300"
    login-route="/login"
    forgot-password-route="/forgot-password"
    token-param="token"
    :on-submit="handleResetPassword"
  />
</template>

<script setup lang="ts">
import ResetPasswordPageTemplate from '../../../shared-ui/src/templates/auth/ResetPasswordPageTemplate.vue'
import { FolderKanban } from 'lucide-vue-next'
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
