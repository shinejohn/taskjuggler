<template>
  <SignUpPageTemplate
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
    checkbox-color="text-blue-500 focus:ring-blue-500"
    sign-in-route="/login"
    :on-submit="handleRegister"
  />
</template>

<script setup lang="ts">
import SignUpPageTemplate from '../../../shared-ui/src/templates/auth/SignUpPageTemplate.vue'
import { CheckSquare } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

async function handleRegister(data: { name: string; email: string; password: string; password_confirmation: string }): Promise<void> {
  await authStore.register(data)
  router.push('/dashboard')
}
</script>
