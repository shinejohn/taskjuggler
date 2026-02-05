<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Lab Results</h1>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
        <ShieldCheck class="w-4 h-4" /> HIPAA Verified
      </div>
    </div>

    <!-- Info Alert -->
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
      <AlertCircle class="w-5 h-5 text-amber-600 flex-shrink-0" />
      <div>
        <h4 class="text-sm font-bold text-amber-900">Understanding your results</h4>
        <p class="text-xs text-amber-800 leading-relaxed mt-1">
          Results are released to the portal once reviewed by your care team. Some results may take longer to process depending on the lab.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-4">
      <div v-if="labs.length === 0" class="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <FlaskConical class="w-8 h-8" />
        </div>
        <h3 class="font-bold text-slate-900 mb-1">No lab results found</h3>
        <p class="text-slate-500 text-sm">When you have tests performed, they will appear here once processed.</p>
      </div>

      <div 
        v-for="lab in labs" 
        :key="lab.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <FlaskConical class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-slate-900">{{ lab.title }}</h4>
              <p class="text-xs text-slate-500">{{ formatDate(lab.created_at) }} • Order #{{ lab.id.slice(0, 8).toUpperCase() }}</p>
            </div>
          </div>
          <div :class="`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit ${getStatusClass(lab.status)}`">
            {{ lab.status }}
          </div>
        </div>
        
        <div v-if="lab.why_explanation" class="p-5 bg-slate-50/50">
          <div class="flex gap-3">
             <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                <Bot class="w-4 h-4" />
             </div>
             <div>
                <h5 class="text-xs font-bold text-teal-900 uppercase tracking-widest mb-1">HealthBot Insight</h5>
                <p class="text-sm text-slate-700 leading-relaxed italic">"{{ lab.why_explanation }}"</p>
             </div>
          </div>
        </div>

        <div class="px-5 py-4 flex justify-end gap-3 bg-white">
          <button class="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">View Full PDF</button>
          <button class="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">Discuss result</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePortalStore } from '@/stores/portalStore';
import { 
  FlaskConical, AlertCircle, ShieldCheck, 
  Bot 
} from 'lucide-vue-next';

const store = usePortalStore();
const { labs, isLoading } = storeToRefs(store);

const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const getStatusClass = (status: string | undefined) => {
  const s = status?.toLowerCase() || '';
  if (s === 'ready' || s === 'completed') return 'bg-emerald-100 text-emerald-700';
  if (s === 'processing' || s === 'pending') return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-600';
};

onMounted(() => {
  store.loadLabs();
});
</script>
