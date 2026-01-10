<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 shadow-lg shadow-purple-600/50">
            <Command class="h-7 w-7 text-white" />
          </div>
          <span class="text-4xl font-bold text-white">Urpa</span>
        </div>
        <p class="text-purple-400 text-sm font-semibold tracking-wide">
          Your Personal Assistant
        </p>
      </div>

      <!-- Card -->
      <Card class="bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl p-8">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-white mb-2">
            Create your account
          </h1>
          <p class="text-slate-400 text-sm">
            Get started with Urpa today
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              Full Name
            </label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                v-model="formData.name"
                type="text"
                placeholder="John Doe"
                class="w-full pl-11 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">
              Email
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                v-model="formData.email"
                type="email"
                placeholder="you@example.com"
                class="w-full pl-11 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
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
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-11 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
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
                class="w-full pl-11 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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

          <!-- Terms -->
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="agreedToTerms"
              type="checkbox"
              class="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span class="text-sm text-slate-400">
              I agree to the{' '}
              <button type="button" class="text-purple-400 hover:text-purple-300">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" class="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </button>
            </span>
          </label>

          <!-- Error Message -->
          <div v-if="authStore.error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p class="text-sm text-red-400">{{ authStore.error }}</p>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="isLoading || !agreedToTerms || authStore.loading"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-600/50 hover:shadow-xl hover:shadow-purple-600/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading || authStore.loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <template v-else>
              Create Account
              <ArrowRight class="h-5 w-5" />
            </template>
          </Button>
        </form>

        <!-- Sign In Link -->
        <p class="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <router-link to="/login" class="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Sign in
          </router-link>
        </p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Command, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const agreedToTerms = ref(false);

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
]);

async function handleSubmit() {
  if (!agreedToTerms.value) return;
  
  if (formData.value.password !== formData.value.confirmPassword) {
    authStore.error = 'Passwords do not match';
    return;
  }

  isLoading.value = true;
  try {
    await authStore.register({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      password_confirmation: formData.value.confirmPassword,
    });
    router.push('/');
  } catch (error) {
    // Error handled by store
  } finally {
    isLoading.value = false;
  }
}
</script>
