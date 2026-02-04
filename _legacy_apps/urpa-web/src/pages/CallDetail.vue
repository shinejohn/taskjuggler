<template>
  <div :class="['min-h-screen w-full', theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50']">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex items-center justify-center h-screen">
        <div class="text-center">
          <Loader2 class="h-10 w-10 animate-spin text-teal-500 mx-auto mb-4" />
          <p :class="['text-lg font-semibold', theme === 'dark' ? 'text-slate-300' : 'text-gray-700']">
            Loading call details...
          </p>
        </div>
      </div>
      <div v-else-if="call" class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <button
            @click="$router.back()"
            :class="['flex items-center gap-2 px-4 py-2 rounded-lg transition-colors', theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900']"
          >
            <ArrowLeft class="h-5 w-5" />
            Back
          </button>
        </div>

        <!-- Call Detail Card -->
        <CallDetail :call="call" @close="$router.back()" />
      </div>
      <div v-else class="flex items-center justify-center h-screen">
        <div class="text-center">
          <AlertCircle class="h-10 w-10 text-red-500 mx-auto mb-4" />
          <p :class="['text-lg font-semibold', theme === 'dark' ? 'text-slate-300' : 'text-gray-700']">
            Call not found
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { usePhoneStore } from '@/stores/phone';
import CallDetail from '@/components/phone/CallDetail.vue';
import type { PhoneCall } from '@/types/phone';

const route = useRoute();
const { theme } = useTheme();
const phoneStore = usePhoneStore();

const loading = ref(true);
const call = ref<PhoneCall | null>(null);

onMounted(async () => {
  const callId = route.params.id as string;
  if (callId) {
    try {
      await phoneStore.fetchCalls();
      call.value = phoneStore.calls.find(c => c.id === callId) || null;
    } catch (error) {
      // Error handled
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
});
</script>

