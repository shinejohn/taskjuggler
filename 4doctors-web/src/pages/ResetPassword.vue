<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center items-center gap-2 mb-6">
        <div class="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
          <KeyRound class="h-6 w-6 text-white" />
        </div>
        <span class="text-2xl font-black tracking-tight text-slate-900">4healthcare</span>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Choose a new password</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-100">
        <div v-if="succeeded" class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Password updated</h3>
          <p class="text-sm text-slate-500 mb-6">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <RouterLink
            to="/login"
            class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to sign in
          </RouterLink>
        </div>

        <div v-else-if="!token || !email" class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 mb-4">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Invalid reset link</h3>
          <p class="text-sm text-slate-500 mb-6">
            This password reset link is invalid or incomplete. Please request a new one.
          </p>
          <RouterLink to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500 text-sm">
            Request a new link
          </RouterLink>
        </div>

        <form v-else class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700">New password</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <p class="mt-1 text-xs text-slate-400">Must be at least 8 characters.</p>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-slate-700">Confirm new password</label>
            <div class="mt-1">
              <input
                id="password_confirmation"
                v-model="passwordConfirmation"
                name="password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
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
            {{ loading ? 'Resetting...' : 'Reset password' }}
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { KeyRound, CheckCircle2, AlertTriangle } from 'lucide-vue-next';
import api from '@/utils/api';

const route = useRoute();

const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''));
const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''));

const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const succeeded = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
  loading.value = true;
  try {
    await api.post('/auth/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    succeeded.value = true;
  } catch {
    errorMessage.value = 'Unable to reset password. The link may have expired — request a new one.';
  } finally {
    loading.value = false;
  }
};
</script>
