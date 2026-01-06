<template>
  <button
    @click="$emit('select', id)"
    :class="[
      'p-6 bg-white rounded-xl border-2 transition-all duration-300 text-center group',
      selected
        ? 'border-[#1B4F72] shadow-lg scale-105'
        : 'border-slate-100 hover:border-[#1B4F72] hover:shadow-lg'
    ]"
  >
    <div
      :class="[
        'text-4xl mb-3 transition-transform',
        selected ? 'scale-110' : 'group-hover:scale-110'
      ]"
    >
      <component :is="icon" :size="48" :class="selected ? 'text-[#1B4F72]' : 'text-slate-400 group-hover:text-[#1B4F72]'" />
    </div>
    <p
      :class="[
        'font-medium',
        selected ? 'text-[#1B4F72] font-semibold' : 'text-slate-900'
      ]"
    >
      {{ name }}
    </p>
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  id: string;
  name: string;
  icon: Component;
  selected: boolean;
}

defineProps<Props>();
defineEmits<{
  select: [id: string];
}>();
</script>

