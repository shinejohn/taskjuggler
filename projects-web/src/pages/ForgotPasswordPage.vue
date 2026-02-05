<template>
  <ForgotPasswordPageTemplate
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
    :on-submit="handleForgotPassword"
  />
</template>

<script setup lang="ts">
import ForgotPasswordPageTemplate from '../../../shared-ui/src/templates/auth/ForgotPasswordPageTemplate.vue'
import { FolderKanban } from 'lucide-vue-next'
import apiClient from '@/api/client'

async function handleForgotPassword(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email })
}
</script>
