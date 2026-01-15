<template>
  <ForgotPasswordPageTemplate
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
    :on-submit="handleForgotPassword"
  />
</template>

<script setup lang="ts">
import ForgotPasswordPageTemplate from '../../../shared-ui/src/templates/auth/ForgotPasswordPageTemplate.vue'
import { Command } from 'lucide-vue-next'
import api from '@/utils/api'

async function handleForgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email })
}
</script>

