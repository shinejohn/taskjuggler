<template>
  <LoginPageTemplate
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
    sign-up-route="/register"
    forgot-password-route="/forgot-password"
    :on-submit="handleLogin"
    :show-social-login="false"
  />
</template>

<script setup lang="ts">
import LoginPageTemplate from '../../../../shared-ui/src/templates/auth/LoginPageTemplate.vue'
import { Workflow } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogin(email: string, password: string): Promise<void> {
  await authStore.login(email, password)
  router.push('/processes')
}
</script>
