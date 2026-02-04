<template>
  <LoginPageTemplate
    app-name="Scanner"
    app-tagline="Website Health Monitoring"
    :logo-icon="ScanSearch"
    logo-gradient="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
    tagline-color="text-emerald-400"
    primary-glow="bg-emerald-500/10"
    secondary-glow="bg-teal-500/10"
    input-focus-color="focus:border-emerald-500"
    button-gradient="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-500/40"
    link-color="text-emerald-400 hover:text-emerald-300"
    sign-up-route="/register"
    forgot-password-route="/forgot-password"
    :on-submit="handleLogin"
    :show-social-login="false"
  />
</template>

<script setup lang="ts">
// @ts-ignore
import LoginPageTemplate from '@taskjuggler/ui/templates/auth/LoginPageTemplate.vue'
import { ScanSearch } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin(email: string, password: string, _rememberMe: boolean): Promise<void> {
  await authStore.login(email, password)
  router.push('/dashboard')
}
</script>
