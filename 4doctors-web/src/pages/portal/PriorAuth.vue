<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Prior Authorizations</h1>
      <div class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
        Active Tracking
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 2" :key="i" class="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-4">
      <div v-if="priorAuths.length === 0" class="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <ShieldAlert class="w-8 h-8" />
        </div>
        <h3 class="font-bold text-slate-900 mb-1">No authorization requests</h3>
        <p class="text-slate-500 text-sm">When your doctor requests approval from your insurance, it will appear here.</p>
      </div>

      <div 
        v-for="auth in priorAuths" 
        :key="auth.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all p-5"
      >
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <ClipboardCheck class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-slate-900">{{ auth.title }}</h4>
              <p class="text-sm text-slate-600 leading-relaxed mt-1">{{ auth.description }}</p>
              
              <div v-if="auth.status_message" class="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Info class="w-3.5 h-3.5 mt-0.5 text-indigo-400" />
                <span>{{ auth.status_message }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div :class="`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusClass(auth.status)}`">
              {{ auth.status }}
            </div>
            <span class="text-[10px] text-slate-400 font-medium">Updated {{ formatDate(auth.updated_at || auth.created_at || '') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Proactive Card -->
    <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
       <div class="relative z-10">
          <h3 class="font-bold text-lg mb-2">Notice a delay?</h3>
          <p class="text-slate-300 text-sm mb-4">Our AI 'ClaimCoach' monitors these requests daily. If a request is stuck, we automatically alert the insurance carrier's provider relations team.</p>
          <button class="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
             Message Care Team
          </button>
       </div>
       <Zap class="absolute right-0 top-0 w-32 h-32 text-white/5 -mr-8 -mt-8" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePortalStore } from '@/stores/portalStore';
import { 
  ShieldAlert, ClipboardCheck, Info, 
  Zap 
} from 'lucide-vue-next';

const store = usePortalStore();
const { priorAuths, isLoading } = storeToRefs(store);

const formatDate = (date: string) => {
  if (!date) return 'Recently';
  const d = new Date(date);
  return d.toLocaleDateString();
};

const getStatusClass = (status: string | undefined) => {
  const s = status?.toLowerCase() || '';
  if (s === 'approved' || s === 'completed' || s === 'ready') return 'bg-emerald-100 text-emerald-700';
  if (s === 'processing' || s === 'pending') return 'bg-amber-100 text-amber-700';
  if (s === 'denied') return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-600';
};

onMounted(() => {
  store.loadPriorAuths();
});
</script>
