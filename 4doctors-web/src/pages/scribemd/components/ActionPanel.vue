<template>
  <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
      <div class="flex items-center gap-2">
        <div :class="`p-1.5 rounded-lg bg-${color}-500/20`">
          <component :is="getIcon(icon)" :class="`w-4 h-4 text-${color}-400`" />
        </div>
        <h3 class="font-medium text-white text-sm">{{ title }}</h3>
        <span v-if="items.length > 0" :class="`text-xs text-${color}-400 bg-${color}-500/20 px-2 py-0.5 rounded-full`">
          {{ items.filter(i => i.is_accepted).length }}/{{ items.length }}
        </span>
      </div>
    </div>

    <!-- Items List -->
    <div class="p-3 space-y-2 max-h-48 overflow-y-auto">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all"
        :class="[
          item.is_accepted
            ? 'bg-slate-700/30 hover:bg-slate-700/50'
            : 'bg-slate-800/30 opacity-50 hover:opacity-75'
        ]"
        @click="$emit('toggle-item', item.id)"
      >
        <div
          class="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
          :class="[
            item.is_accepted
              ? `bg-${color}-500 border-${color}-500`
              : 'border-2 border-slate-500'
          ]"
        >
          <Check v-if="item.is_accepted" class="w-2.5 h-2.5 text-white" />
        </div>
        <span class="text-white text-xs truncate">{{ getItemDisplay(item) }}</span>
      </div>

      <!-- Empty State -->
      <div v-if="items.length === 0" class="py-4 text-center">
        <p class="text-slate-500 text-xs">{{ emptyText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Pill, FlaskConical, Shield } from 'lucide-vue-next';
import type { DashboardItem } from '@/stores/scribemd/dashboardStore';

defineProps<{
  title: string;
  items: DashboardItem[];
  icon: string;
  color: string;
  emptyText: string;
}>();

defineEmits<{
  'toggle-item': [itemId: string];
}>();

// Get icon component
function getIcon(iconName: string) {
  const icons: Record<string, unknown> = {
    Pill,
    FlaskConical,
    Shield,
  };
  return icons[iconName] || Pill;
}

// Get display text from item
function getItemDisplay(item: DashboardItem): string {
  const data = item.item_data;
  if (data.drug_name) return String(data.drug_name);
  if (data.name) return String(data.name);
  if (data.procedure_name) return String(data.procedure_name);
  if (data.text) return String(data.text);
  return JSON.stringify(data);
}
</script>
