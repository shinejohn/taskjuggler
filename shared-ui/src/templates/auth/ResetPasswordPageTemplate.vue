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
              Enter your new password below
            </p>
          </div>

          <!-- Success Message -->
          <div v-if="isSuccess" class="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p class="text-sm text-green-400 font-medium mb-4">
              Password reset successfully! You can now log in with your new password.
            </p>
            <router-link
              :to="loginRoute"
              :class="['inline-flex items-center gap-2 text-sm font-semibold transition-colors', linkColor]"
            >
              Go to login
              <ArrowRight class="h-4 w-4" />
            </router-link>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p class="text-sm text-red-400">{{ error }}</p>
          </div>

          <!-- Invalid Token Message -->
          <div v-if="isInvalidToken" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p class="text-sm text-red-400 font-medium mb-4">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <router-link
              :to="forgotPasswordRoute"
              :class="['inline-flex items-center gap-2 text-sm font-semibold transition-colors', linkColor]"
            >
              Request new reset link
              <ArrowRight class="h-4 w-4" />
            </router-link>
          </div>

          <form v-if="!isSuccess && !isInvalidToken" @submit.prevent="handleSubmit" class="space-y-5">
            <!-- New Password -->
            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                New Password
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  :class="['w-full pl-11 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors', inputFocusColor]"
                  required
                  :disabled="isLoading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  :disabled="isLoading"
                >
                  <EyeOff v-if="showPassword" class="h-5 w-5" />
                  <Eye v-else class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                Confirm Password
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  :class="['w-full pl-11 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors', inputFocusColor]"
                  required
                  :disabled="isLoading"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  :disabled="isLoading"
                >
                  <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
                  <Eye v-else class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Password Requirements -->
            <div v-if="formData.password" class="space-y-2">
              <div
                v-for="req in passwordRequirements"
                :key="req.label"
                class="flex items-center gap-2"
              >
                <div :class="['w-4 h-4 rounded-full flex items-center justify-center', req.met ? 'bg-green-500' : 'bg-slate-700']">
                  <Check v-if="req.met" class="h-3 w-3 text-white" />
                </div>
                <span :class="['text-xs', req.met ? 'text-green-400' : 'text-slate-500']">
                  {{ req.label }}
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              :disabled="isLoading || !canSubmit"
              :class="['w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed', buttonGradient]"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <template v-else>
                Reset Password
                <ArrowRight class="h-5 w-5" />
              </template>
            </Button>
          </form>

          <!-- Back to Login Link -->
          <div v-if="!isSuccess" class="mt-6 text-center">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// import { useRouter } from 'vue-router'
import { Lock, Eye, EyeOff, ArrowRight, Check, Command } from 'lucide-vue-next'
import { Card, CardContent, Input, Button } from '@taskjuggler/ui'

export interface ResetPasswordPageProps {
  appName?: string
  appTagline?: string
  logoIcon?: any
  logoGradient?: string
  taglineColor?: string
  inputFocusColor?: string
  buttonGradient?: string
  linkColor?: string
  loginRoute?: string
  forgotPasswordRoute?: string
  tokenParam?: string
  onSubmit?: (token: string, password: string, passwordConfirmation: string) => Promise<void>
}

const props = withDefaults(defineProps<ResetPasswordPageProps>(), {
  appName: 'App',
  appTagline: 'Your Application',
  logoIcon: Command,
  logoGradient: 'bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20',
  taglineColor: 'text-teal-400',
  inputFocusColor: 'focus:border-teal-500',
  buttonGradient: 'bg-gradient-to-r from-teal-600 to-blue-600 shadow-teal-500/30 hover:shadow-teal-500/40',
  linkColor: 'text-teal-400 hover:text-teal-300',
  loginRoute: '/login',
  forgotPasswordRoute: '/forgot-password',
  tokenParam: 'token',
  onSubmit: undefined,
})

// Router available for future use  
// const router = useRouter()
const route = useRoute()

const formData = ref({
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)
const isInvalidToken = ref(false)
const error = ref('')
const resetToken = ref('')

const passwordRequirements = computed(() => [
  {
    label: 'At least 8 characters',
    met: formData.value.password.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    met: /[A-Z]/.test(formData.value.password),
  },
  {
    label: 'Contains number',
    met: /\d/.test(formData.value.password),
  },
  {
    label: 'Passwords match',
    met: formData.value.password === formData.value.confirmPassword && formData.value.password.length > 0,
  },
])

const canSubmit = computed(() => {
  return (
    formData.value.password.length >= 8 &&
    formData.value.password === formData.value.confirmPassword &&
    passwordRequirements.value.filter(r => r.met).length >= 3
  )
})

onMounted(() => {
  // Get token from URL query parameter
  const token = route.query[props.tokenParam] as string
  if (!token) {
    isInvalidToken.value = true
    return
  }
  resetToken.value = token
})

async function handleSubmit() {
  if (!canSubmit.value || !resetToken.value) return

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    if (props.onSubmit) {
      await props.onSubmit(resetToken.value, formData.value.password, formData.value.confirmPassword)
    } else {
      // Default implementation - should be overridden by parent
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken.value,
          password: formData.value.password,
          password_confirmation: formData.value.confirmPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to reset password')
      }
    }

    isSuccess.value = true
  } catch (err: any) {
    if (err.message?.includes('invalid') || err.message?.includes('expired')) {
      isInvalidToken.value = true
    } else {
      error.value = err.message || 'Failed to reset password. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

