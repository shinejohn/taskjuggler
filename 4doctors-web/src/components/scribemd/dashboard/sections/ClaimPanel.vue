<template>
  <div class="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
    <div class="px-5 py-4 border-b border-slate-700/50 bg-slate-800/30 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-emerald-500/10 rounded-lg">
          <DollarSign class="w-4 h-4 text-emerald-400" />
        </div>
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">Live Claim Assembly</h3>
      </div>
      <div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
        <span class="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">ClaimCoach™ Active</span>
      </div>
    </div>

    <div class="p-5 space-y-6">
      <!-- Diagnoses -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Diagnoses (ICD-10)</span>
          <button class="text-[10px] text-emerald-400 font-bold hover:underline">+ Add Dx</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(dx, index) in claim.diagnoses"
            :key="dx.code"
            :class="[
              'group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all cursor-default',
              index === 0 
                ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            ]"
          >
            <div class="flex flex-col">
              <span class="text-xs font-bold" :class="index === 0 ? 'text-emerald-400' : 'text-white'">{{ dx.code }}</span>
              <span class="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">{{ dx.description }}</span>
            </div>
            <span v-if="index === 0" class="text-[8px] font-black text-emerald-500/50 uppercase leading-none">Primary</span>
            <button class="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-700 rounded transition-opacity">
              <X class="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Procedures -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Procedures (CPT)</span>
          <button class="text-[10px] text-emerald-400 font-bold hover:underline">+ Add CPT</button>
        </div>
        <div class="space-y-2">
          <div
            v-for="proc in claim.procedures"
            :key="proc.code"
            class="flex items-center justify-between p-2.5 bg-slate-800 rounded-lg border border-slate-700"
          >
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-white">{{ proc.code }}</span>
              <span class="text-xs text-slate-400 truncate max-w-[180px]">{{ proc.description }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-slate-500 font-bold">Units: {{ proc.units || 1 }}</span>
              <button class="p-1 hover:bg-slate-700 rounded transition-colors">
                <X class="w-3 h-3 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial / Risk Metrics -->
      <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
        <div class="space-y-1">
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Est. Reimbursement</span>
          <p class="text-lg font-bold text-white">${{ Number(claim.estimated_reimbursement ?? 0).toFixed(2) }}</p>
        </div>
        <div class="space-y-1">
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Denial Risk</span>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold" :class="riskColor">{{ Math.round((claim.denial_risk_score || 0) * 100) }}%</span>
            <span class="text-[10px] font-bold uppercase" :class="riskColor">{{ riskText }}</span>
          </div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="px-4 py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-3">
        <CheckCircle2 class="w-4 h-4 text-emerald-400" />
        <span class="text-[11px] font-bold text-emerald-400 leading-tight">
          {{ claim.documentation_complete ? 'All codes supported by documentation' : 'Verifying documentation support...' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DollarSign, X, CheckCircle2 } from 'lucide-vue-next';
import type { Claim } from '@/stores/scribemd/dashboardStore';

const props = defineProps<{
  claim: Claim;
}>();

const riskColor = computed(() => {
  const risk = props.claim.denial_risk_score || 0;
  if (risk < 0.1) return 'text-emerald-400';
  if (risk < 0.3) return 'text-amber-400';
  return 'text-rose-400';
});

const riskText = computed(() => {
  const risk = props.claim.denial_risk_score || 0;
  if (risk < 0.1) return 'Low';
  if (risk < 0.3) return 'Moderate';
  return 'High';
});
</script>
