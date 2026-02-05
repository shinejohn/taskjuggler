<template>
  <span :class="[
    'px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
    colorClasses
  ]">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange';
    text?: string;
}>(), {
    variant: 'default'
});

const colorClasses = computed(() => {
    switch (props.variant) {
        case 'success': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        case 'warning': return 'bg-amber-100 text-amber-800 border border-amber-200';
        case 'danger': return 'bg-red-100 text-red-800 border border-red-200';
        case 'info': return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'purple': return 'bg-purple-100 text-purple-800 border border-purple-200';
        case 'orange': return 'bg-orange-100 text-orange-800 border border-orange-200';
        default: return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
});
</script>
