<template>
  <SignUpPageTemplate
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
    checkbox-color="text-cyan-500 focus:ring-cyan-500"
    sign-in-route="/login"
    :on-submit="handleRegister"
  />
</template>

<script setup lang="ts">
import SignUpPageTemplate from '../../../../shared-ui/src/templates/auth/SignUpPageTemplate.vue'
import { Workflow } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleRegister(data: { name: string; email: string; password: string; password_confirmation: string }): Promise<void> {
  await authStore.register(data)
  router.push('/processes')
}
</script>
