<template>
  <div class="relative">
    <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input 
      ref="inputRef"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :class="[
        'pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none transition-all',
        'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        sizeClasses[size],
        fullWidth ? 'w-full' : ''
      ]"
    >
    <button 
      v-if="modelValue"
      @click="clear"
      class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
    >
      <X class="w-4 h-4" />
    </button>
    <Loader2 v-if="loading" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, X, Loader2 } from 'lucide-vue-next';

interface Props {
  modelValue: string;
  placeholder?: string;
  debounce?: number;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  debounce: 300,
  size: 'md',
  fullWidth: false,
  loading: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const sizeClasses = {
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base'
};

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', value);
  }, props.debounce);
};

const clear = () => {
  emit('update:modelValue', '');
  emit('search', '');
  inputRef.value?.focus();
};

const focus = () => {
  inputRef.value?.focus();
};

defineExpose({ focus });
</script>
