<template>
  <ResetPasswordPageTemplate
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
    forgot-password-route="/forgot-password"
    token-param="token"
    :on-submit="handleResetPassword"
  />
</template>

<script setup lang="ts">
import ResetPasswordPageTemplate from '../../../../shared-ui/src/templates/auth/ResetPasswordPageTemplate.vue'
import { Users } from 'lucide-vue-next'
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
