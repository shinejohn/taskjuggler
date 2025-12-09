<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="label">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="input"
              placeholder="Your name"
            />
          </div>
          <div>
            <label for="email" class="label">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input"
              placeholder="Password"
            />
          </div>
          <div>
            <label for="password_confirmation" class="label">Confirm Password</label>
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              type="password"
              required
              class="input"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)

async function handleRegister() {
  loading.value = true
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    router.push('/dashboard')
  } catch (error) {
    alert('Registration failed')
  } finally {
    loading.value = false
  }
}
</script>
