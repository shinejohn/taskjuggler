<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>
  
  <template v-else-if="!isAuthenticated && !isTestingMode">
    <!-- Redirect will happen via router navigation guard or watch -->
  </template>
  
  <div v-else-if="isTestingMode && !isAuthenticated" class="min-h-screen bg-gray-50">
    <Alert class="mb-4 border-l-4 border-orange-500 bg-orange-100">
      <AlertTitle>Testing Mode</AlertTitle>
      <AlertDescription class="text-sm text-orange-700">
        Authentication bypassed for development.
        <router-link to="/login" class="underline ml-1">Login normally</router-link>
      </AlertDescription>
    </Alert>
    <slot />
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui';

const router = useRouter();
const { isAuthenticated, loading } = useAuth();

// For testing purposes, allow access without authentication
const isTestingMode = computed(() => 
  import.meta.env.VITE_DEV_MODE === 'true' || window.location.hostname === 'localhost'
);

// Redirect to login if not authenticated and not in testing mode
watch([isAuthenticated, loading, isTestingMode], ([auth, load, testing]) => {
  if (!load && !auth && !testing) {
    router.replace('/login');
  }
}, { immediate: true });
</script>
