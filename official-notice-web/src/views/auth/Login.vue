<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const { login, loading } = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const handleSubmit = async () => {
    error.value = null
    const result = await login(email.value, password.value)
    if (result.success) {
        router.push('/')
    } else {
        error.value = result.error
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div class="w-full max-w-md">
            <!-- Logo -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-white">Official Notice</h1>
                <p class="text-purple-300 mt-2">Secure Document Signing Platform</p>
            </div>

            <!-- Login Card -->
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h2 class="text-2xl font-semibold text-white mb-6">Sign In</h2>
                
                <form @submit.prevent="handleSubmit" class="space-y-5">
                    <!-- Error Alert -->
                    <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        {{ error }}
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-purple-200 mb-1.5">Email</label>
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            required
                            placeholder="you@company.com"
                            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-purple-200 mb-1.5">Password</label>
                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                    </div>

                    <!-- Submit -->
                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
                    </button>
                </form>

                <!-- Register Link -->
                <div class="mt-6 text-center">
                    <p class="text-purple-200">
                        Don't have an account?
                        <router-link to="/register" class="text-purple-400 hover:text-purple-300 font-medium transition">
                            Create one
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
