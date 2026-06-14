<template>
  <Teleport to="body">
    <div
      v-if="state.open"
      class="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-label="state.options.title"
      @keydown.escape="cancel()"
    >
      <div class="absolute inset-0 bg-slate-900/50" @click="cancel()"></div>
      <div class="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-2">{{ state.options.title }}</h3>
        <p class="text-sm text-slate-600 mb-6">{{ state.options.message }}</p>
        <div class="flex justify-end gap-3">
          <button
            ref="cancelButton"
            type="button"
            class="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
            @click="cancel()"
          >
            {{ state.options.cancelLabel || 'Cancel' }}
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white"
            :class="state.options.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
            @click="accept()"
          >
            {{ state.options.confirmLabel || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useConfirm } from '@/composables/useConfirm';

const { state, accept, cancel } = useConfirm();
const cancelButton = ref<HTMLButtonElement | null>(null);

watch(
  () => state.open,
  async (open) => {
    if (open) {
      await nextTick();
      cancelButton.value?.focus();
    }
  }
);
</script>
