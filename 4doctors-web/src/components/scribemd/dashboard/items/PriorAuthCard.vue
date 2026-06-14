<template>
  <div class="p-4 bg-slate-800/80 rounded-xl border border-amber-500/30 shadow-lg shadow-amber-500/5">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-amber-500/20 rounded-lg">
          <ShieldAlert class="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h4 class="text-white font-bold leading-none">{{ data.procedure_name }} ({{ data.cpt_code }})</h4>
          <span class="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">Status: {{ data.status }}</span>
        </div>
      </div>
      <button class="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
        <Edit2 class="w-4 h-4" />
      </button>
    </div>

    <div class="space-y-2">
      <div class="flex items-center gap-4 text-xs text-slate-400">
        <span class="font-medium">Payer: <span class="text-slate-200">{{ data.payer }}</span></span>
        <span class="font-medium">Member ID: <span class="text-slate-200">{{ data.member_id }}</span></span>
      </div>
      
      <div class="flex flex-col gap-1">
        <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Clinical Justification</span>
        <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-700/50 text-xs text-slate-300 leading-relaxed italic">
          "{{ data.justification }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ShieldAlert, Edit2 } from 'lucide-vue-next';
import type { DashboardItem as ItemType } from '@/stores/scribemd/dashboardStore';

const props = defineProps<{
  item: ItemType;
}>();

const data = computed(() => {
  return {
    procedure_name: props.item.item_data.procedure_name || 'Procedure',
    cpt_code: props.item.item_data.cpt_code || '',
    status: props.item.item_data.status || 'READY',
    payer: props.item.item_data.payer || 'Aetna PPO',
    member_id: props.item.item_data.member_id || 'AET882991023',
    justification: props.item.item_data.justification || 'Clinical presentation concerning for CAD given cardiac risk factors.',
  };
});
</script>
