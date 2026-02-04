<template>
  <div v-if="participants.length === 0" class="text-center py-8 text-text-secondary text-body-medium">
    No participants yet
  </div>
  <div v-else class="p-2 space-y-2">
    <div
      v-for="participant in participants"
      :key="participant.id"
      class="glass-standard rounded-lg shadow-1 p-2 flex items-center hover:shadow-2 transition-all duration-normal"
    >
      <div class="relative">
        <img
          :src="participant.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=007AFF&color=fff`"
          :alt="participant.name"
          class="w-10 h-10 rounded-md object-cover"
        />
        <div
          v-if="participant.isActive"
          class="absolute bottom-0 right-0 bg-status-completed w-2 h-2 rounded-full border-2 border-bg-primary"
        ></div>
      </div>
      <div class="ml-2 flex-1">
        <p class="font-medium text-body-small text-text-primary">{{ participant.name }}</p>
        <p class="text-caption text-text-secondary">
          {{ participant.isActive ? 'Active' : 'Inactive' }}
        </p>
      </div>
      <div>
        <MicOffIcon v-if="participant.isMuted" :size="14" class="text-destructive" />
        <MicIcon v-else :size="14" class="text-text-secondary" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MicIcon, MicOffIcon } from 'lucide-vue-next';

interface Participant {
  id: number | string;
  name: string;
  image?: string;
  isMuted?: boolean;
  isActive?: boolean;
}

interface Props {
  participants: Participant[];
}

defineProps<Props>();
</script>

