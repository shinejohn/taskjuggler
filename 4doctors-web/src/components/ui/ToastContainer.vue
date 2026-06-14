<template>
  <div
    aria-live="polite"
    aria-atomic="false"
    class="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="status"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border bg-white shadow-lg p-4"
        :class="borderClass(toast.type)"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <Info v-else class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-slate-700 flex-1">{{ toast.message }}</p>
        <button
          type="button"
          aria-label="Dismiss notification"
          class="text-slate-400 hover:text-slate-600 flex-shrink-0"
          @click="dismiss(toast.id)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import type { ToastType } from '@/composables/useToast';

const { toasts, dismiss } = useToast();

const borderClass = (type: ToastType) => {
  switch (type) {
    case 'success': return 'border-emerald-200';
    case 'error': return 'border-red-200';
    default: return 'border-blue-200';
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
