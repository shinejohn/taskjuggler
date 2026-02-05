<template>
  <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-cyan-500/20">
          <FileBarChart class="w-4 h-4 text-cyan-400" />
        </div>
        <h3 class="font-medium text-white text-sm">Claim Summary</h3>
      </div>
      <span
        :class="[
          'text-xs font-medium px-2 py-0.5 rounded-full',
          claim.documentation_complete
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-amber-500/20 text-amber-400'
        ]"
      >
        {{ claim.documentation_complete ? 'Complete' : 'Incomplete' }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3">
      <!-- E&M Level -->
      <div class="flex justify-between items-center">
        <span class="text-slate-400 text-xs">E&M Level</span>
        <span class="text-white font-medium">
          99{{ 210 + (claim.em_level ?? 3) }}
          <span class="text-slate-400 text-xs ml-1">(Level {{ claim.em_level ?? 3 }})</span>
        </span>
      </div>

      <!-- Primary Diagnosis -->
      <div class="flex justify-between items-center">
        <span class="text-slate-400 text-xs">Primary Dx</span>
        <span class="text-white text-sm">{{ claim.primary_diagnosis || 'Not set' }}</span>
      </div>

      <!-- Diagnosis Count -->
      <div class="flex justify-between items-center">
        <span class="text-slate-400 text-xs">Diagnoses</span>
        <span class="text-white text-sm">{{ claim.diagnoses?.length || 0 }}</span>
      </div>

      <!-- Procedure Count -->
      <div class="flex justify-between items-center">
        <span class="text-slate-400 text-xs">Procedures</span>
        <span class="text-white text-sm">{{ claim.procedures?.length || 0 }}</span>
      </div>

      <!-- Estimated Reimbursement -->
      <div v-if="claim.estimated_reimbursement" class="pt-2 border-t border-slate-700/50">
        <div class="flex justify-between items-center">
          <span class="text-slate-400 text-xs">Est. Reimbursement</span>
          <span class="text-emerald-400 font-bold">
            ${{ claim.estimated_reimbursement.toLocaleString() }}
          </span>
        </div>
      </div>

      <!-- Denial Risk -->
      <div v-if="claim.denial_risk_score !== undefined" class="flex justify-between items-center">
        <span class="text-slate-400 text-xs">Denial Risk</span>
        <span
          :class="[
            'font-medium text-sm',
            claim.denial_risk_score < 20 ? 'text-emerald-400' :
            claim.denial_risk_score < 50 ? 'text-amber-400' : 'text-red-400'
          ]"
        >
          {{ claim.denial_risk_score }}%
        </span>
      </div>

      <!-- Validation Flags -->
      <div v-if="claim.validation_flags?.length > 0" class="pt-2 border-t border-slate-700/50">
        <p class="text-xs text-amber-400 mb-1">Validation Issues:</p>
        <ul class="space-y-1">
          <li
            v-for="(flag, index) in claim.validation_flags"
            :key="index"
            class="text-xs text-slate-400 flex items-start gap-1"
          >
            <AlertTriangle class="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
            {{ flag }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileBarChart, AlertTriangle } from 'lucide-vue-next';
import type { Claim } from '@/stores/scribemd/dashboardStore';

defineProps<{
  claim: Claim;
}>();
</script>
