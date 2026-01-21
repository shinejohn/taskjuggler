<template>
  <SignUpPageTemplate
    app-name="4Calls.ai"
    app-tagline="AI Assistant Platform"
    :logo-icon="Users"
    logo-gradient="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
    tagline-color="text-emerald-400"
    primary-glow="bg-emerald-500/10"
    secondary-glow="bg-teal-500/10"
    input-focus-color="focus:border-emerald-500"
    button-gradient="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-500/40"
    link-color="text-emerald-400 hover:text-emerald-300"
    checkbox-color="text-emerald-500 focus:ring-emerald-500"
    sign-in-route="/login"
    :on-submit="handleRegister"
  />
</template>

<script setup lang="ts">
import SignUpPageTemplate from '../../../../shared-ui/src/templates/auth/SignUpPageTemplate.vue'
import { Users } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleRegister(data: { name: string; email: string; password: string; password_confirmation: string }): Promise<void> {
  await authStore.register(data)
  router.push('/onboarding')
}
</script>
