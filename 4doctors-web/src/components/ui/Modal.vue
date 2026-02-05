<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="close"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="modelValue"
              :class="['relative bg-white rounded-2xl shadow-2xl w-full flex flex-col', maxWidthClass]"
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 class="text-xl font-bold text-slate-900">
                  <slot name="title">{{ title }}</slot>
                </h3>
                <button
                  @click="close"
                  class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <!-- Body -->
              <div class="px-6 py-4 flex-grow overflow-y-auto max-h-[70vh]">
                <slot></slot>
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                <slot name="footer"></slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
}>(), {
  maxWidth: 'md'
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-sm';
    case 'md': return 'max-w-md';
    case 'lg': return 'max-w-lg';
    case 'xl': return 'max-w-xl';
    case '2xl': return 'max-w-2xl';
    case '4xl': return 'max-w-4xl';
    case '6xl': return 'max-w-6xl';
    default: return 'max-w-md';
  }
});

// Prevent scrolling when modal is open
watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>
