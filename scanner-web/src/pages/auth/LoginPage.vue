<template>
  <div class="auth-page">
    <Card class="auth-card">
      <CardContent class="p-8">
        <h1 class="auth-title">Login to SiteHealth</h1>
        <form @submit.prevent="handleSubmit" class="auth-form">
          <div>
            <Label for="email">Email <span class="text-destructive ml-1">*</span></Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              :class="errors.email && 'border-destructive'"
              required
            />
            <p v-if="errors.email" class="text-sm text-destructive mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <Label for="password">Password <span class="text-destructive ml-1">*</span></Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              :class="errors.password && 'border-destructive'"
              required
            />
            <p v-if="errors.password" class="text-sm text-destructive mt-1">{{ errors.password }}</p>
          </div>
          <Button
            type="submit"
            :disabled="authStore.loading"
            class="auth-submit w-full"
          >
            {{ authStore.loading ? 'Logging in...' : 'Login' }}
          </Button>
          <p class="auth-footer">
            Don't have an account? <RouterLink to="/register" class="auth-link">Sign up</RouterLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, Input, Button, Label } from '@taskjuggler/ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = reactive<Record<string, string>>({})

const handleSubmit = async () => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!email.value.trim()) {
    errors.email = 'Email is required'
    return
  }
  
  if (!password.value) {
    errors.password = 'Password is required'
    return
  }
  
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (error: any) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    } else {
      errors.general = error.response?.data?.message || 'Login failed'
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: var(--color-bg-primary);
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-title {
  font-size: var(--font-display-small);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-8) 0;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.auth-submit {
  width: 100%;
  margin-top: var(--space-2);
}

.auth-footer {
  text-align: center;
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
  margin: var(--space-4) 0 0 0;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
