<template>
  <AuthLayout
    :app-name="appName"
    :app-tagline="appTagline"
    :logo-icon="logoIcon"
    :logo-gradient="logoGradient"
    :primary-glow="primaryGlow"
    :secondary-glow="secondaryGlow"
  >
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
      <AuthCard>
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-white mb-2">{{ title }}</h1>
          <p class="text-slate-400 text-sm">
            {{ subtitle }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Name -->
          <div>
            <label :class="['block text-sm font-semibold mb-2', labelClass]">
              Full Name
            </label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                v-model="formData.name"
                type="text"
                placeholder="John Doe"
                :class="['w-full pl-11 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors', inputFocusColor]"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label :class="['block text-sm font-semibold mb-2', labelClass]">
              Email
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                v-model="formData.email"
                type="email"
                placeholder="you@example.com"
                :class="['w-full pl-11 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors', inputFocusColor]"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Extra Fields -->
          <slot name="extra-fields" />

          <!-- Password -->
          <PasswordInput
            v-model="formData.password"
            label="Password"
            :disabled="isLoading"
            :input-focus-color="inputFocusColor"
          />

          <!-- Confirm Password -->
          <PasswordInput
            v-model="formData.confirmPassword"
            label="Confirm Password"
            :disabled="isLoading"
            :input-focus-color="inputFocusColor"
          />

          <!-- Password Requirements -->
          <PasswordRequirements
            :password="formData.password"
            :confirm-password="formData.confirmPassword"
          />

          <!-- Terms -->
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="agreedToTerms"
              type="checkbox"
              :class="['mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900/50 focus:ring-offset-0', checkboxColor, checkboxClass]"
              required
              :disabled="isLoading"
            />
            <span :class="['text-sm', labelClass]">
              I agree to the{' '}
              <button type="button" :class="['font-semibold transition-colors', linkColor]">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" :class="['font-semibold transition-colors', linkColor]">
                Privacy Policy
              </button>
            </span>
          </label>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p class="text-sm text-red-400">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="isLoading || !agreedToTerms || !canSubmit"
            :class="['w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed', buttonGradient]"
          >
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <template v-else>
              {{ submitLabel }}
              <ArrowRight class="h-5 w-5" />
            </template>
          </Button>
        </form>

        <!-- Sign In Link -->
        <p class="mt-6 text-center text-sm text-slate-400">
          {{ signInPrompt }}{' '}
          <router-link :to="signInRoute" :class="['font-semibold transition-colors', linkColor]">
            {{ signInLinkText }}
          </router-link>
        </p>
      </AuthCard>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Mail, User, ArrowRight, Command } from 'lucide-vue-next'
import { Input, Button } from '@taskjuggler/ui'
import { AuthLayout, AuthCard, PasswordInput, PasswordRequirements } from '../../components/auth'

export interface SignUpPageTemplateProps {
  appName?: string
  appTagline?: string
  logoIcon?: any
  logoGradient?: string
  taglineColor?: string
  primaryGlow?: string
  secondaryGlow?: string
  title?: string
  subtitle?: string
  submitLabel?: string
  signInPrompt?: string
  signInLinkText?: string
  signInRoute?: string
  inputFocusColor?: string
  buttonGradient?: string
  linkColor?: string
  labelClass?: string
  checkboxColor?: string
  checkboxClass?: string
  onSubmit?: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>
}

const props = withDefaults(defineProps<SignUpPageTemplateProps>(), {
  appName: 'App',
  appTagline: 'Your Application',
  logoIcon: Command,
  logoGradient: 'bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20',
  taglineColor: 'text-teal-400',
  primaryGlow: 'bg-teal-500/10',
  secondaryGlow: 'bg-blue-500/10',
  title: 'Create your account',
  subtitle: 'Get started today',
  submitLabel: 'Create Account',
  signInPrompt: 'Already have an account?',
  signInLinkText: 'Sign in',
  signInRoute: '/login',
  inputFocusColor: 'focus:border-teal-500',
  buttonGradient: 'bg-gradient-to-r from-teal-600 to-blue-600 shadow-teal-500/30 hover:shadow-teal-500/40',
  linkColor: 'text-teal-400 hover:text-teal-300',
  labelClass: 'text-slate-400',
  checkboxColor: 'text-teal-500 focus:ring-teal-500',
  checkboxClass: '',
  onSubmit: undefined,
})

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const agreedToTerms = ref(false)
const isLoading = ref(false)
const error = ref('')

const canSubmit = computed(() => {
  return (
    formData.value.password.length >= 8 &&
    formData.value.password === formData.value.confirmPassword &&
    /[A-Z]/.test(formData.value.password) &&
    /\d/.test(formData.value.password)
  )
})

async function handleSubmit() {
  if (!agreedToTerms.value || !canSubmit.value) return

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    if (props.onSubmit) {
      await props.onSubmit({
        name: formData.value.name,
        email: formData.value.email,
        password: formData.value.password,
        password_confirmation: formData.value.confirmPassword,
      })
    } else {
      // Default implementation - should be overridden by parent
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.value.name,
          email: formData.value.email,
          password: formData.value.password,
          password_confirmation: formData.value.confirmPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Registration failed')
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

