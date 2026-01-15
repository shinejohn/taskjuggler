<template>
  <SignUpPageTemplate
    app-name="IdeaCircuit"
    app-tagline="AI-Powered Meeting Solutions"
    :logo-icon="Sparkles"
    logo-gradient="bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/20"
    tagline-color="text-purple-400"
    primary-glow="bg-purple-500/10"
    secondary-glow="bg-pink-500/10"
    input-focus-color="focus:border-purple-500"
    button-gradient="bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30 hover:shadow-purple-500/40"
    link-color="text-purple-400 hover:text-purple-300"
    checkbox-color="text-purple-500 focus:ring-purple-500"
    sign-in-route="/login"
    :on-submit="handleRegister"
  />
</template>

<script setup lang="ts">
import SignUpPageTemplate from '../../../shared-ui/src/templates/auth/SignUpPageTemplate.vue'
import { Sparkles } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { register } = useAuth()

async function handleRegister(data: { name: string; email: string; password: string; password_confirmation: string }): Promise<void> {
  const result = await register(data.email, data.password, data.name)
  if (result.user) {
    router.push('/login')
  } else {
    throw new Error(result.error || 'Registration failed')
  }
}
</script>
