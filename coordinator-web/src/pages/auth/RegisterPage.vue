<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
    <!-- Header -->
    <div class="p-6">
      <router-link to="/" class="inline-flex items-center gap-2 text-slate-600 hover:text-[#1B4F72] transition-colors">
        <ArrowLeft :size="20" />
        Back to home
      </router-link>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <router-link to="/" class="inline-flex items-center gap-2 mb-6">
            <div class="w-12 h-12 bg-[#1B4F72] rounded-xl flex items-center justify-center text-white font-bold text-lg">
              4C
            </div>
            <span class="text-2xl font-heading font-bold text-[#1B4F72]">
              4calls.ai
            </span>
          </router-link>
          <h1 class="text-3xl font-bold text-slate-900 mb-2">
            Create your account
          </h1>
          <p class="text-slate-600">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <!-- Sign Up Form -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                  placeholder="John Smith"
                  required
                />
              </div>
            </div>

            <!-- Business Name -->
            <div>
              <label for="businessName" class="block text-sm font-medium text-slate-700 mb-2">
                Business name
              </label>
              <div class="relative">
                <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
                <input
                  id="businessName"
                  v-model="formData.businessName"
                  type="text"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                  placeholder="Acme Dental Practice"
                  required
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full pl-10 pr-11 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                  placeholder="••••••••"
                  required
                  minlength="8"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabindex="-1"
                >
                  <Eye v-if="!showPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-2">
                Confirm password
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
                <input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full pl-10 pr-11 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
                  :class="formData.confirmPassword && formData.password !== formData.confirmPassword 
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' 
                    : 'border-slate-200 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]'"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabindex="-1"
                >
                  <Eye v-if="!showConfirmPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <p 
                v-if="formData.confirmPassword && formData.password !== formData.confirmPassword" 
                class="text-xs text-red-600 mt-1"
              >
                Passwords do not match
              </p>
            </div>

            <!-- Terms -->
            <div>
              <label class="flex items-start gap-2 cursor-pointer">
                <input
                  v-model="formData.agreeToTerms"
                  type="checkbox"
                  class="mt-1 rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]"
                  required
                />
                <span class="text-sm text-slate-600">
                  I agree to the
                  <a href="#" class="text-[#1B4F72] hover:underline">Terms of Service</a>
                  and
                  <a href="#" class="text-[#1B4F72] hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {{ error }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !formData.agreeToTerms"
              class="w-full py-3 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
              <span v-else>Create account</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <!-- Social Sign Up -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="py-2.5 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-slate-700"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              class="py-2.5 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-slate-700"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <!-- Login Link -->
        <p class="text-center mt-6 text-sm text-slate-600">
          Already have an account?
          <router-link to="/login" class="text-[#1B4F72] hover:underline font-semibold">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationsStore } from '@/stores/organizations';

const router = useRouter();
const authStore = useAuthStore();
const organizationsStore = useOrganizationsStore();

const formData = ref({
  name: '',
  businessName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
});

const error = ref<string | null>(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const loading = computed(() => authStore.loading);

async function handleRegister() {
  // Clear previous errors
  error.value = null;

  // Validation
  if (!formData.value.name.trim()) {
    error.value = 'Please enter your full name';
    return;
  }

  if (!formData.value.businessName.trim()) {
    error.value = 'Please enter your business name';
    return;
  }

  if (!formData.value.email.trim()) {
    error.value = 'Please enter your email address';
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    error.value = 'Please enter a valid email address';
    return;
  }

  if (formData.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }

  if (!formData.value.agreeToTerms) {
    error.value = 'Please agree to the Terms of Service and Privacy Policy';
    return;
  }

  try {
    // Register user first
    await authStore.register({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
    });

    // Create organization after successful registration
    try {
      await organizationsStore.createOrganization({
        name: formData.value.businessName,
        industry: 'other', // Would come from onboarding
      });
    } catch (orgError: any) {
      // If organization creation fails, user is still registered
      console.warn('Organization creation failed:', orgError);
    }
    
    // After registration, redirect to onboarding
    router.push('/onboarding');
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Registration failed. Please try again.';
    console.error('Registration failed:', e);
  }
}
</script>
