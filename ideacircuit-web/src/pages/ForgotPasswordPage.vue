<template>
  <ForgotPasswordPageTemplate
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
    :on-submit="handleForgotPassword"
  />
</template>

<script setup lang="ts">
import ForgotPasswordPageTemplate from '../../../shared-ui/src/templates/auth/ForgotPasswordPageTemplate.vue'
import { Sparkles } from 'lucide-vue-next'
import api from '@/services/api'

async function handleForgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email })
}
</script>

