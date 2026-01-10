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
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20">
            <Command class="h-7 w-7 text-white" />
          </div>
          <span class="text-4xl font-bold text-white">Urpa</span>
        </div>
        <p class="text-teal-400 text-sm font-semibold tracking-wide">
          Your Personal Assistant
        </p>
      </div>

      <!-- Card -->
      <Card class="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl">
        <CardContent class="p-8">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p class="text-slate-400 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
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
                  class="w-full pl-11 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full pl-11 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <EyeOff v-if="showPassword" class="h-5 w-5" />
                  <Eye v-else class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Remember & Forgot -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  class="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                />
                <span class="text-sm text-slate-400">Remember me</span>
              </label>
              <button
                type="button"
                class="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="authStore.error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p class="text-sm text-red-400">{{ authStore.error }}</p>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              :disabled="isLoading || authStore.loading"
              class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading || authStore.loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <template v-else>
                Sign In
                <ArrowRight class="h-5 w-5" />
              </template>
            </Button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-slate-800/50 text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              @click="handleGoogleLogin"
              class="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-slate-300 hover:border-slate-600 transition-colors"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
          </div>

          <!-- Sign Up Link -->
          <p class="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <router-link to="/signup" class="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
              Sign up
            </router-link>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Command, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-vue-next';
import { Card, CardContent, Input, Button } from '@taskjuggler/ui';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);

async function handleSubmit() {
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (error) {
    // Error handled by store
  } finally {
    isLoading.value = false;
  }
}

async function handleGoogleLogin() {
  try {
    const response = await api.get('/auth/google/url');
    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error) {
    authStore.error = 'Failed to initiate Google login';
  }
}
</script>
