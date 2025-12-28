<template>
  <div class="auth-page">
    <Card :padding="'lg'" className="auth-card">
      <h1 class="auth-title">Login to SiteHealth</h1>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <Input
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :required="true"
          :error="errors.email"
        />
        <Input
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          :required="true"
          :error="errors.password"
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          :disabled="authStore.loading"
          className="auth-submit"
        >
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </Button>
        <p class="auth-footer">
          Don't have an account? <RouterLink to="/register" class="auth-link">Sign up</RouterLink>
        </p>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
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
