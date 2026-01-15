<template>
  <ForgotPasswordPageTemplate
    app-name="Coordinator"
    app-tagline="Client Coordination Platform"
    :logo-icon="Users"
    logo-gradient="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
    tagline-color="text-emerald-400"
    primary-glow="bg-emerald-500/10"
    secondary-glow="bg-teal-500/10"
    input-focus-color="focus:border-emerald-500"
    button-gradient="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-500/40"
    link-color="text-emerald-400 hover:text-emerald-300"
    login-route="/login"
    :on-submit="handleForgotPassword"
  />
</template>

<script setup lang="ts">
import ForgotPasswordPageTemplate from '../../../../shared-ui/src/templates/auth/ForgotPasswordPageTemplate.vue'
import { Users } from 'lucide-vue-next'
import api from '@/utils/api'

async function handleForgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email })
}
</script>
