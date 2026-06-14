<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center items-center gap-2 mb-6">
        <div class="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
          <KeyRound class="h-6 w-6 text-white" />
        </div>
        <span class="text-2xl font-black tracking-tight text-slate-900">4healthcare</span>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Reset your password</h2>
      <p class="mt-2 text-center text-sm text-slate-600">
        Enter your email and we'll send you a link to reset your password.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-100">
        <div v-if="submitted" class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <MailCheck class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Check your email</h3>
          <p class="text-sm text-slate-500 mb-6">
            If an account exists for <span class="font-medium text-slate-700">{{ email }}</span>,
            you'll receive a password reset link shortly.
          </p>
          <RouterLink to="/login" class="font-medium text-blue-600 hover:text-blue-500 text-sm">
            Back to sign in
          </RouterLink>
        </div>

        <form v-else class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700">Email address</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <p v-if="errorMessage" class="text-sm text-red-600" role="alert">{{ errorMessage }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-60"
          >
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </button>

          <p class="text-center text-sm">
            <RouterLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
              Back to sign in
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { KeyRound, MailCheck } from 'lucide-vue-next';
import api from '@/utils/api';

const email = ref('');
const loading = ref(false);
const submitted = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await api.post('/auth/forgot-password', { email: email.value });
    submitted.value = true;
  } catch {
    // Show the same confirmation regardless, to avoid account enumeration
    submitted.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
