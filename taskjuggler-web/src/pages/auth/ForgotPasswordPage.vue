<template>
  <ForgotPasswordPageTemplate
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
    :on-submit="handleForgotPassword"
  />
</template>

<script setup lang="ts">
import ForgotPasswordPageTemplate from '@taskjuggler/ui/templates/auth/ForgotPasswordPageTemplate.vue'
import { CheckSquare } from 'lucide-vue-next'
import api from '@/utils/api'

async function handleForgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email })
}
</script>
