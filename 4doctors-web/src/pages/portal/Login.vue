<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <div class="text-center mb-8">
        <div class="h-12 w-12 rounded-xl bg-teal-500 mx-auto flex items-center justify-center text-white font-bold text-xl mb-4">
          P
        </div>
        <h1 class="text-2xl font-bold text-slate-900">Patient Portal</h1>
        <p class="text-slate-500 mt-2">Access your health records securely</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
          <input 
            v-model="email"
            type="email" 
            class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
          <input 
            v-model="password"
            type="password" 
            class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <a href="#" class="text-sm text-teal-600 font-medium hover:underline">Forgot your password?</a>
      </div>

      <div class="mt-8 pt-8 border-t border-slate-100 text-center text-sm text-slate-500">
        New patient? <a href="#" class="text-teal-600 font-medium hover:underline">Register here</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;
    try {
        // In a real implementation, we would pass a 'role: patient' param or use a specific endpoint
        await authStore.login(email.value, password.value);
        router.push('/portal/dashboard');
    } catch (e) {
        alert('Login failed. Please try again.');
    } finally {
        loading.value = false;
    }
};
</script>
