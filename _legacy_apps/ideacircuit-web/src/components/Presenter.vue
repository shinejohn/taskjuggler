<template>
  <div class="bg-bg-primary rounded-lg overflow-hidden flex-1 flex items-center justify-center relative border border-border">
    <div v-if="isVideoOff" class="flex flex-col items-center justify-center text-text-primary">
      <div class="bg-bg-tertiary p-6 rounded-full mb-2">
        <UserIcon :size="64" class="text-text-secondary" />
      </div>
      <p class="text-title-large font-medium text-text-primary">AI Presenter</p>
    </div>
    <template v-else>
      <img
        src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
        alt="AI Presenter"
        class="w-full h-full object-cover"
      />
      <div class="absolute bottom-4 left-4 glass-subtle px-3 py-2 rounded-md text-label font-medium text-text-primary flex items-center shadow-1">
        <div class="w-2 h-2 rounded-full bg-status-completed mr-2"></div>
        AI Presenter
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { UserIcon } from 'lucide-vue-next';

interface Props {
  isVideoOff: boolean;
}

defineProps<Props>();
</script>

