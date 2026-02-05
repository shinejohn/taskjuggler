<template>
  <div>
    <!-- Filter Toggle Button -->
    <button 
      v-if="collapsible"
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
    >
      <Filter class="w-4 h-4" />
      <span>Filters</span>
      <span v-if="activeFilterCount > 0" class="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full">
        {{ activeFilterCount }}
      </span>
      <ChevronDown :class="['w-4 h-4 transition-transform', isOpen ? 'rotate-180' : '']" />
    </button>

    <!-- Filter Panel -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-if="isOpen || !collapsible"
        class="bg-white border border-slate-200 rounded-xl p-4 mt-2 shadow-sm"
      >
        <div class="flex flex-wrap gap-4 items-end">
          <slot></slot>
          
          <!-- Actions -->
          <div class="flex gap-2 ml-auto">
            <button 
              v-if="activeFilterCount > 0"
              @click="clearAll"
              class="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Clear All
            </button>
            <button 
              v-if="showApply"
              @click="emit('apply')"
              class="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Filter, ChevronDown } from 'lucide-vue-next';

interface Props {
  collapsible?: boolean;
  activeFilterCount?: number;
  showApply?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsible: true,
  activeFilterCount: 0,
  showApply: false
});

const emit = defineEmits<{
  (e: 'apply'): void;
  (e: 'clear'): void;
}>();

const isOpen = ref(!props.collapsible);

const clearAll = () => {
  emit('clear');
};
</script>
