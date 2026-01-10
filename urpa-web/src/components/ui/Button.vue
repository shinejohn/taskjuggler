<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-colors',
      variantClasses,
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}>();

defineEmits<{
  click: [];
}>();

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  return variants[props.variant || 'primary'];
});
</script>

