<template>
  <button
    @click="$emit('select', id)"
    :class="[
      'p-4 rounded-xl border-2 transition-all duration-200 text-left group',
      selected
        ? 'border-[#1B4F72] bg-blue-50 shadow-md'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
    ]"
  >
    <div class="flex items-start gap-4">
      <div
        :class="[
          'p-3 rounded-lg transition-colors',
          selected ? 'bg-[#1B4F72] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#1B4F72]'
        ]"
      >
        <component :is="icon" :size="24" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3
            :class="[
              'font-bold text-lg',
              selected ? 'text-[#1B4F72]' : 'text-slate-900'
            ]"
          >
            {{ title }}
          </h3>
          <span
            :class="[
              'text-sm font-semibold whitespace-nowrap',
              selected ? 'text-[#1B4F72]' : 'text-slate-500'
            ]"
          >
            {{ price }}
          </span>
        </div>
        <p class="text-sm text-slate-600">{{ description }}</p>
      </div>
      <div
        :class="[
          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
          selected
            ? 'border-[#1B4F72] bg-[#1B4F72]'
            : 'border-slate-300 group-hover:border-[#1B4F72]'
        ]"
      >
        <Check v-if="selected" :size="14" class="text-white" />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import type { Component } from 'vue';

interface Props {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: Component;
  selected: boolean;
}

defineProps<Props>();
defineEmits<{
  select: [id: string];
}>();
</script>




