<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div :class="['flex h-12 w-12 items-center justify-center rounded-xl shadow-lg', logoGradient]">
            <component :is="logoIcon" class="h-7 w-7 text-white" />
          </div>
          <span class="text-4xl font-bold text-white">{{ appName }}</span>
        </div>
        <p :class="['text-sm font-semibold tracking-wide', taglineColor]">
          {{ appTagline }}
        </p>
      </div>

      <!-- Card -->
      <Card :class="['bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl']">
        <CardContent class="p-8">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-white mb-2">Reset your password</h1>
            <p class="text-slate-400 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <!-- Success Message -->
          <div v-if="isSuccess" class="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p class="text-sm text-green-400 font-medium">
              Check your email! We've sent a password reset link to <strong>{{ email }}</strong>
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p class="text-sm text-red-400">{{ error }}</p>
          </div>

          <form v-if="!isSuccess" @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  :class="['w-full pl-11 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors', inputFocusColor]"
                  required
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              :disabled="isLoading"
              :class="['w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed', buttonGradient]"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <template v-else>
                Send Reset Link
                <ArrowRight class="h-5 w-5" />
              </template>
            </Button>
          </form>

          <!-- Back to Login Link -->
          <div class="mt-6 text-center">
            <router-link
              :to="loginRoute"
              :class="['text-sm font-semibold transition-colors', linkColor]"
            >
              ← Back to login
            </router-link>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import { Mail, ArrowRight, Command } from 'lucide-vue-next'
import { Card, CardContent, Input, Button } from '@taskjuggler/ui'

export interface ForgotPasswordPageProps {
  appName?: string
  appTagline?: string
  logoIcon?: any
  logoGradient?: string
  taglineColor?: string
  inputFocusColor?: string
  buttonGradient?: string
  linkColor?: string
  loginRoute?: string
  onSubmit?: (email: string) => Promise<void>
}

const props = withDefaults(defineProps<ForgotPasswordPageProps>(), {
  appName: 'App',
  appTagline: 'Your Application',
  logoIcon: Command,
  logoGradient: 'bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20',
  taglineColor: 'text-teal-400',
  inputFocusColor: 'focus:border-teal-500',
  buttonGradient: 'bg-gradient-to-r from-teal-600 to-blue-600 shadow-teal-500/30 hover:shadow-teal-500/40',
  linkColor: 'text-teal-400 hover:text-teal-300',
  loginRoute: '/login',
  onSubmit: undefined,
})

// Router available for future use
// const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value) return

  isLoading.value = true
  error.value = ''

  try {
    if (props.onSubmit) {
      await props.onSubmit(email.value)
    } else {
      // Default implementation - should be overridden by parent
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.value }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to send reset email')
      }
    }

    isSuccess.value = true
  } catch (err: any) {
    error.value = err.message || 'Failed to send reset email. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

