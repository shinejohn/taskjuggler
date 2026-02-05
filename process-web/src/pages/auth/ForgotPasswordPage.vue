<template>
  <ForgotPasswordPageTemplate
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
    :on-submit="handleForgotPassword"
  />
</template>

<script setup lang="ts">
import ForgotPasswordPageTemplate from '../../../../shared-ui/src/templates/auth/ForgotPasswordPageTemplate.vue'
import { Workflow } from 'lucide-vue-next'
import apiClient from '@/api/client'

async function handleForgotPassword(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email })
}
</script>
