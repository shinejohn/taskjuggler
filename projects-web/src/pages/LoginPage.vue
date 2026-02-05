<template>
  <LoginPageTemplate
    app-name="Projects"
    app-tagline="Project Delivery Hub"
    :logo-icon="FolderKanban"
    logo-gradient="bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20"
    tagline-color="text-orange-400"
    primary-glow="bg-orange-500/10"
    secondary-glow="bg-red-500/10"
    input-focus-color="focus:border-orange-500"
    button-gradient="bg-gradient-to-r from-orange-600 to-red-600 shadow-orange-500/30 hover:shadow-orange-500/40"
    link-color="text-orange-400 hover:text-orange-300"
    sign-up-route="/register"
    forgot-password-route="/forgot-password"
    :on-submit="handleLogin"
    :show-social-login="false"
  />
</template>

<script setup lang="ts">
import LoginPageTemplate from '../../../shared-ui/src/templates/auth/LoginPageTemplate.vue'
import { FolderKanban } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogin(email: string, password: string): Promise<void> {
  await authStore.login({ email, password })
  router.push('/app/projects')
}
</script>
