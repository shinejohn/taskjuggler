<template>
  <div class="flex items-center gap-2">
    <div :class="['h-2 w-2 rounded-full', statusColor]" />
    <span :class="['text-xs font-semibold', textColor]">
      {{ statusLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type AIStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

const props = defineProps<{
  status: AIStatus;
}>();

const statusColor = computed(() => {
  const colors = {
    idle: 'bg-gray-500',
    listening: 'bg-blue-500 animate-pulse',
    thinking: 'bg-amber-500 animate-pulse',
    speaking: 'bg-green-500 animate-pulse',
  };
  return colors[props.status];
});

const statusLabel = computed(() => {
  const labels = {
    idle: 'Idle',
    listening: 'Listening',
    thinking: 'Thinking',
    speaking: 'Speaking',
  };
  return labels[props.status];
});

const textColor = computed(() => 'text-gray-400');
</script>

