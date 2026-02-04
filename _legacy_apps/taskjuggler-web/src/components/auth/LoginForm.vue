<template>
  <div>
    <div v-if="error" class="auth-form__error">
      <ExclamationCircleIcon class="auth-form__error-icon" />
      <span>{{ error }}</span>
    </div>

    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="auth-form__field">
        <label for="email" class="label">
          Email address
        </label>
        <div class="auth-form__input-wrapper">
          <div class="auth-form__input-icon">
            <EnvelopeIcon class="w-5 h-5" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="input auth-form__input"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div class="auth-form__field">
        <label for="password" class="label">
          Password
        </label>
        <div class="auth-form__input-wrapper">
          <div class="auth-form__input-icon">
            <LockClosedIcon class="w-5 h-5" />
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="input auth-form__input"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div class="auth-form__options">
        <div class="auth-form__checkbox-wrapper">
          <input
            id="remember-me"
            v-model="rememberMe"
            name="remember-me"
            type="checkbox"
            class="auth-form__checkbox"
          />
          <label for="remember-me" class="auth-form__checkbox-label">
            Remember me
          </label>
        </div>

        <button
          type="button"
          @click.prevent="onForgotPassword"
          class="auth-form__link"
        >
          Forgot your password?
        </button>
      </div>

      <div class="auth-form__submit">
        <Button
          type="submit"
          :disabled="loading"
          class="w-full"
        >
          <template v-if="loading">
            <LoadingSpinner size="sm" />
          </template>
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign in</span>
        </Button>
      </div>
    </form>

    <!-- Google SSO -->
    <div class="auth-form__divider">
      <div class="auth-form__divider-line"></div>
      <span class="auth-form__divider-text">Or continue with</span>
      <div class="auth-form__divider-line"></div>
    </div>

    <div class="auth-form__google">
      <Button
        type="button"
        :disabled="loading || googleLoading"
        variant="outline"
        class="w-full"
        @click="handleGoogleLogin"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
          />
        </svg>
        <span v-if="googleLoading">Connecting...</span>
        <span v-else>Sign in with Google</span>
      </Button>
    </div>

    <div class="auth-form__footer">
      <p class="auth-form__footer-text">
        Don't have an account?
        <button
          type="button"
          @click.prevent="onSignUp"
          class="auth-form__link"
        >
          Sign up
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/api'
import { Button } from '@taskjuggler/ui'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

interface Props {
  appName?: string
  redirectUri?: string
}

const props = withDefaults(defineProps<Props>(), {
  appName: 'Task Juggler',
  redirectUri: undefined,
})

const emit = defineEmits<{
  success: []
  signUp: []
  forgotPassword: []
}>()

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    emit('success')
  } catch (err: any) {
    // Handle network errors
    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
      error.value = 'Network error: Unable to connect to the server. Please check your internet connection and ensure the API is running.';
      console.error('Network error:', err);
    } else if (err.response?.status === 422) {
      // Validation errors
      const validationErrors = err.response.data?.errors;
      if (validationErrors) {
        error.value = Object.values(validationErrors).flat().join(', ');
      } else {
        error.value = err.response.data?.message || 'Validation failed. Please check your input.';
      }
    } else if (err.response?.status === 401) {
      error.value = 'Invalid email or password. Please try again.';
    } else {
      error.value = err.response?.data?.message || err.message || 'Login failed. Please try again.';
    }
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  googleLoading.value = true
  error.value = ''
  try {
    // Get Google OAuth URL from API
    const redirectUri = props.redirectUri || `${window.location.origin}/auth/google/callback`
    const response = await api.get('/auth/google/url', {
      params: { redirect_uri: redirectUri },
    })
    
    const oauthUrl = response.data.data?.url || response.data.url
    if (oauthUrl) {
      // Redirect to Google OAuth
      window.location.href = oauthUrl
    } else {
      throw new Error('Failed to get Google OAuth URL')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to initiate Google login. Please try again.'
    googleLoading.value = false
  }
}

function onSignUp() {
  emit('signUp')
}

function onForgotPassword() {
  emit('forgotPassword')
}
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.auth-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.auth-form__input-wrapper {
  position: relative;
}

.auth-form__input-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.auth-form__input {
  padding-left: calc(var(--space-3) + var(--space-3) + 20px);
}

.auth-form__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.auth-form__checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.auth-form__checkbox {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  accent-color: var(--color-primary);
  cursor: pointer;
}

.auth-form__checkbox-label {
  font-size: var(--font-body-small);
  color: var(--color-text-primary);
  cursor: pointer;
}

.auth-form__link {
  font-size: var(--font-body-small);
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

.auth-form__link:hover {
  color: var(--color-primary-hover);
}

.auth-form__submit {
  width: 100%;
}

.auth-form__divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-6) 0;
}

.auth-form__divider-line {
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.auth-form__divider-text {
  font-size: var(--font-body-small);
  color: var(--color-text-tertiary);
}

.auth-form__google {
  width: 100%;
}

.auth-form__footer {
  text-align: center;
  margin-top: var(--space-6);
}

.auth-form__footer-text {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
}

.auth-form__footer-text .auth-form__link {
  margin-left: var(--space-1);
}

.auth-form__error {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background-color: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: var(--color-destructive);
  font-size: var(--font-body-medium);
}

.auth-form__error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}
</style>

