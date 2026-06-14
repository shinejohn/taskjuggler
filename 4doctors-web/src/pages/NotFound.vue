<template>
  <div class="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6">
    <div class="text-center max-w-md">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6">
        <FileQuestion class="w-8 h-8" />
      </div>
      <h1 class="text-5xl font-bold text-slate-900 mb-2">404</h1>
      <h2 class="text-xl font-semibold text-slate-700 mb-3">Page not found</h2>
      <p class="text-slate-500 mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div class="flex items-center justify-center gap-3">
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          Go Back
        </button>
        <RouterLink
          :to="homePath"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Go to {{ homeLabel }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { FileQuestion } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const homePath = computed(() => {
  if (!authStore.isAuthenticated) return '/';
  return authStore.isPatient ? '/portal/dashboard' : '/dashboard';
});

const homeLabel = computed(() => (authStore.isAuthenticated ? 'Dashboard' : 'Home'));

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push(homePath.value);
  }
};
</script>
