<template>
  <TransitionGroup
    name="toast"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'min-w-[300px] max-w-md p-4 rounded-lg shadow-lg',
        toast.type === 'success' ? 'bg-green-50 border border-green-200' : '',
        toast.type === 'error' ? 'bg-red-50 border border-red-200' : '',
        toast.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : '',
        toast.type === 'info' ? 'bg-blue-50 border border-blue-200' : '',
      ]"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p
            :class="[
              'font-medium',
              toast.type === 'success' ? 'text-green-800' : '',
              toast.type === 'error' ? 'text-red-800' : '',
              toast.type === 'warning' ? 'text-yellow-800' : '',
              toast.type === 'info' ? 'text-blue-800' : '',
            ]"
          >
            {{ toast.message }}
          </p>
        </div>
        <button
          @click="removeToast(toast.id)"
          class="ml-4 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const toasts = ref<Toast[]>([]);

function addToast(message: string, type: Toast['type'] = 'info', duration: number = 5000) {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const toast: Toast = { id, message, type, duration };
  toasts.value.push(toast);

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
}

function removeToast(id: string) {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
}

// Expose methods globally
onMounted(() => {
  (window as any).$toast = {
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
  };
});

onUnmounted(() => {
  delete (window as any).$toast;
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
