<template>
  <ResetPasswordPageTemplate
    app-name="Scanner"
    app-tagline="Website Health Monitoring"
    :logo-icon="ScanSearch"
    logo-gradient="bg-gradient-to-br from-green-500 to-teal-600 shadow-green-500/20"
    tagline-color="text-green-400"
    primary-glow="bg-green-500/10"
    secondary-glow="bg-teal-500/10"
    input-focus-color="focus:border-green-500"
    button-gradient="bg-gradient-to-r from-green-600 to-teal-600 shadow-green-500/30 hover:shadow-green-500/40"
    link-color="text-green-400 hover:text-green-300"
    login-route="/login"
    forgot-password-route="/forgot-password"
    token-param="token"
    :on-submit="handleResetPassword"
  />
</template>

<script setup lang="ts">
// @ts-ignore
import ResetPasswordPageTemplate from '@taskjuggler/ui/templates/auth/ResetPasswordPageTemplate.vue'
import { ScanSearch } from 'lucide-vue-next'
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

