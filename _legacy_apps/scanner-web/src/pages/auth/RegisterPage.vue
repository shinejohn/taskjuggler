<template>
  <SignUpPageTemplate
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
    sign-in-route="/login"
    :on-submit="handleRegister"
  />
</template>

<script setup lang="ts">
// @ts-ignore
import SignUpPageTemplate from '@taskjuggler/ui/templates/auth/SignUpPageTemplate.vue'
import { ScanSearch } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

async function handleRegister(data: { name: string; email: string; password: string; password_confirmation: string }): Promise<void> {
  await authStore.register(data)
  router.push('/')
}
</script>
