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
          <!-- Email -->
          <div>
            <label :class="['block text-sm font-semibold mb-2', labelClass]">
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

          <!-- Password -->
          <PasswordInput
            v-model="password"
            label="Password"
            :disabled="isLoading"
            :input-focus-color="inputFocusColor"
          />

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between">
            <RememberMeCheckbox
              v-model="rememberMe"
              :checkbox-class="checkboxClass"
              :label-class="labelClass"
            />
            <router-link
              :to="forgotPasswordRoute"
              :class="['text-sm font-semibold transition-colors', linkColor]"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p class="text-sm text-red-400">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="isLoading"
            :class="['w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed', buttonGradient]"
          >
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <template v-else>
              {{ submitLabel }}
              <ArrowRight class="h-5 w-5" />
            </template>
          </Button>
        </form>

        <!-- Social Login -->
        <SocialLoginButtons
          v-if="showSocialLogin"
          :show-github="showGitHub"
          :divider-color="dividerColor"
          :divider-text-color="dividerTextColor"
          @google-login="$emit('googleLogin')"
          @github-login="$emit('githubLogin')"
        />

        <!-- Sign Up Link -->
        <p class="mt-6 text-center text-sm text-slate-400">
          {{ signUpPrompt }}{' '}
          <router-link :to="signUpRoute" :class="['font-semibold transition-colors', linkColor]">
            {{ signUpLinkText }}
          </router-link>
        </p>
      </AuthCard>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, ArrowRight, Command } from 'lucide-vue-next'
import { Input, Button } from '@taskjuggler/ui'
import { AuthLayout, AuthCard, PasswordInput, RememberMeCheckbox, SocialLoginButtons } from '../../components/auth'

export interface LoginPageTemplateProps {
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
  signUpPrompt?: string
  signUpLinkText?: string
  signUpRoute?: string
  forgotPasswordRoute?: string
  inputFocusColor?: string
  buttonGradient?: string
  linkColor?: string
  labelClass?: string
  checkboxClass?: string
  dividerColor?: string
  dividerTextColor?: string
  showSocialLogin?: boolean
  showGitHub?: boolean
  onSubmit?: (email: string, password: string, rememberMe: boolean) => Promise<void>
}

const props = withDefaults(defineProps<LoginPageTemplateProps>(), {
  appName: 'App',
  appTagline: 'Your Application',
  logoIcon: Command,
  logoGradient: 'bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20',
  taglineColor: 'text-teal-400',
  primaryGlow: 'bg-teal-500/10',
  secondaryGlow: 'bg-blue-500/10',
  title: 'Welcome back',
  subtitle: 'Sign in to your account to continue',
  submitLabel: 'Sign In',
  signUpPrompt: "Don't have an account?",
  signUpLinkText: 'Sign up',
  signUpRoute: '/signup',
  forgotPasswordRoute: '/forgot-password',
  inputFocusColor: 'focus:border-teal-500',
  buttonGradient: 'bg-gradient-to-r from-teal-600 to-blue-600 shadow-teal-500/30 hover:shadow-teal-500/40',
  linkColor: 'text-teal-400 hover:text-teal-300',
  labelClass: 'text-slate-300',
  checkboxClass: '',
  dividerColor: 'border-slate-700',
  dividerTextColor: 'text-slate-400',
  showSocialLogin: true,
  showGitHub: false,
  onSubmit: undefined,
})

defineEmits<{
  googleLogin: []
  githubLogin: []
}>()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value || !password.value) return

  isLoading.value = true
  error.value = ''

  try {
    if (props.onSubmit) {
      await props.onSubmit(email.value, password.value, rememberMe.value)
    } else {
      // Default implementation - should be overridden by parent
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Login failed')
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

