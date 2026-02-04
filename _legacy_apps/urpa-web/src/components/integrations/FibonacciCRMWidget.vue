<template>
  <div :class="['rounded-xl border-2 backdrop-blur-sm overflow-hidden shadow-lg', cardBg, cardBorder]">
    <div :class="['p-4 border-b-2', cardBorder, headerBg]">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-200 text-blue-900']">
            <Database class="h-5 w-5" />
          </div>
          <div>
            <h3 :class="['text-base font-bold', textPrimary]">Fibonacci CRM</h3>
            <p :class="['text-xs', textSecondary]">
              {{ linked ? 'Connected' : 'Not connected' }}
            </p>
          </div>
        </div>
        <div :class="['h-2 w-2 rounded-full', linked ? 'bg-green-500' : 'bg-gray-500']" />
      </div>

      <button
        v-if="!linked"
        @click="handleLink"
        :class="['w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors', theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600']"
      >
        Connect Fibonacci CRM
      </button>
      <div v-else class="space-y-2">
        <div class="flex items-center justify-between">
          <span :class="['text-sm', textSecondary]">FAQs synced</span>
          <span :class="['text-sm font-bold', textPrimary]">{{ faqsCount }}</span>
        </div>
        <button
          @click="handleSyncFAQs"
          :disabled="syncing"
          :class="['w-full px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50', theme === 'dark' ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
        >
          {{ syncing ? 'Syncing...' : 'Sync FAQs' }}
        </button>
      </div>
    </div>

    <!-- Business Info -->
    <div v-if="linked && businessInfo" class="p-4 space-y-2">
      <h4 :class="['text-sm font-semibold', textPrimary]">Business Info</h4>
      <div :class="['p-3 rounded-lg', theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100']">
        <p :class="['text-sm font-medium', textPrimary]">{{ businessInfo.name }}</p>
        <p :class="['text-xs mt-1', textSecondary]">{{ businessInfo.industry }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Database } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { useFibonacciStore } from '@/stores/fibonacci';

const businessInfo = ref<any>(null);

const { theme } = useTheme();
const fibonacciStore = useFibonacciStore();

const syncing = ref(false);

const linked = computed(() => fibonacciStore.crmLinked);
const faqsCount = computed(() => fibonacciStore.faqs.length);

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-white/80');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-200');
const headerBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-blue-50/50');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-slate-200' : 'text-gray-800');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-600');

async function handleLink() {
  // TODO: Open Fibonacci CRM link modal with business selection
  // For now, prompt for business ID
  const businessId = prompt('Enter your Fibonacci CRM business ID:');
  if (businessId) {
    try {
      await fibonacciStore.linkCRM(businessId);
      await fibonacciStore.fetchBusinessInfo(businessId);
      businessInfo.value = fibonacciStore.businessInfo;
    } catch (error) {
      // Error handled by store
    }
  }
}

async function handleSyncFAQs() {
  if (!businessInfo.value) {
    return;
  }
  syncing.value = true;
  try {
    await fibonacciStore.syncFAQs(businessInfo.value.id);
  } catch (error) {
    // Error handled by store
  } finally {
    syncing.value = false;
  }
}

onMounted(async () => {
  await fibonacciStore.checkStatus();
  if (fibonacciStore.link?.fibonacci_business_id) {
    await fibonacciStore.fetchBusinessInfo(fibonacciStore.link.fibonacci_business_id);
    businessInfo.value = fibonacciStore.businessInfo;
  }
});
</script>

