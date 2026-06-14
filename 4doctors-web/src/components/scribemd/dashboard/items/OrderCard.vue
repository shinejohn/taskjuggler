<template>
  <DashboardItem
    :is-accepted="item.is_accepted"
    :source="item.source"
    :confidence="item.ai_confidence"
    :is-new="isNew"
    :has-warning="!!data.pa_required"
    warning-text="PA Required"
    @toggle="$emit('toggle', item.id)"
    @edit="$emit('edit', item.id)"
    @delete="$emit('delete', item.id)"
  >
    <template #title>
      <div class="flex flex-col">
        <span class="text-white font-bold leading-tight">{{ data.procedure_name }}</span>
        <span class="text-slate-400 text-sm">ICD: {{ data.icd_code }}</span>
      </div>
    </template>

    <template #subtitle>
      <div class="mt-2 p-3 bg-slate-900/60 rounded-lg border border-slate-700/50">
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Facility</span>
            <div class="flex items-center gap-1.5">
              <Building2 class="w-3 h-3 text-emerald-400" />
              <span class="text-white text-xs font-medium">{{ data.facility }}</span>
            </div>
          </div>
          <div v-if="data.pa_required" class="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
            <ShieldAlert class="w-3 h-3 text-amber-500" />
            <span class="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">
              {{ data.pa_status === 'auto_created' ? 'PA Auto-Created ✓' : 'PA Pending' }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </DashboardItem>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Building2, ShieldAlert } from 'lucide-vue-next';
import DashboardItem from './DashboardItem.vue';
import type { DashboardItem as ItemType } from '@/stores/scribemd/dashboardStore';

const props = defineProps<{
  item: ItemType;
  isNew?: boolean;
}>();

const data = computed(() => {
  return {
    procedure_name: props.item.item_data.procedure_name || 'Lab/Test',
    icd_code: props.item.item_data.icd_code || 'TBD',
    facility: props.item.item_data.facility || 'Preferred Lab',
    pa_required: props.item.item_data.pa_required ?? false,
    pa_status: props.item.item_data.pa_status || 'none',
  };
});

defineEmits(['toggle', 'edit', 'delete']);
</script>
