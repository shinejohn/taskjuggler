<template>
  <DashboardItem
    :is-accepted="item.is_accepted"
    :source="item.source"
    :confidence="item.ai_confidence"
    :is-new="isNew"
    @toggle="$emit('toggle', item.id)"
    @edit="$emit('edit', item.id)"
    @delete="$emit('delete', item.id)"
  >
    <template #title>
      <div class="flex flex-col">
        <span class="text-white font-bold leading-tight">{{ data.drug_name }} {{ data.strength }}</span>
        <span class="text-slate-400 text-sm">{{ data.sig }}</span>
      </div>
    </template>

    <template #subtitle>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 p-3 bg-slate-900/60 rounded-lg border border-slate-700/50">
        <div class="flex flex-col">
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Quantity</span>
          <span class="text-white text-xs font-medium">{{ data.quantity }} {{ data.form }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Refills</span>
          <span class="text-white text-xs font-medium">{{ data.refills }}</span>
        </div>
        <div v-if="data.pharmacy" class="col-span-2 flex flex-col mt-1 pt-1 border-t border-slate-700/50">
          <span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Pharmacy</span>
          <div class="flex items-center gap-1.5">
            <MapPin class="w-3 h-3 text-emerald-400" />
            <span class="text-emerald-400/90 text-xs font-medium">{{ data.pharmacy }}</span>
          </div>
        </div>
      </div>
    </template>
  </DashboardItem>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MapPin } from 'lucide-vue-next';
import DashboardItem from './DashboardItem.vue';
import type { DashboardItem as ItemType } from '@/stores/scribemd/dashboardStore';

const props = defineProps<{
  item: ItemType;
  isNew?: boolean;
}>();

const data = computed(() => {
  return {
    drug_name: props.item.item_data.drug_name || 'Unknown Drug',
    strength: props.item.item_data.strength || '',
    sig: props.item.item_data.sig || 'Sig not specified',
    quantity: props.item.item_data.quantity || '--',
    form: props.item.item_data.form || 'tablets',
    refills: props.item.item_data.refills ?? 0,
    pharmacy: props.item.item_data.pharmacy || '',
  };
});

defineEmits(['toggle', 'edit', 'delete']);
</script>
