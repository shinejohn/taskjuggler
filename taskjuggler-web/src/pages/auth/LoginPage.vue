<template>
  <div class="auth-page">
    <div class="auth-page__container">
      <div class="auth-page__header">
        <div class="auth-page__logo">
          <span class="auth-page__logo-text">TJ</span>
        </div>
        <h2 class="auth-page__title">
          Sign in to Task Juggler
        </h2>
        <p class="auth-page__subtitle">
          Manage your tasks and workflows efficiently
        </p>
      </div>
      <Card class="auth-page__card">
        <LoginForm
          app-name="Task Juggler"
          @success="handleSuccess"
          @sign-up="handleSignUp"
          @forgot-password="handleForgotPassword"
        />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const authStore = useAuthStore()

function handleSuccess() {
  // Update auth store with user data
  authStore.fetchUser()
  router.push('/dashboard')
}

function handleSignUp() {
  router.push('/register')
}

function handleForgotPassword() {
  router.push('/forgot-password')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-secondary);
}

.auth-page__container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.auth-page__header {
  text-align: center;
}

.auth-page__logo {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-6);
}

.auth-page__logo-text {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  font-size: var(--font-headline);
  font-weight: 700;
}

.auth-page__title {
  font-size: var(--font-display-small);
  font-weight: 700;
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.auth-page__subtitle {
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
}

.auth-page__card {
  padding: var(--space-8) var(--space-6);
}
</style>
