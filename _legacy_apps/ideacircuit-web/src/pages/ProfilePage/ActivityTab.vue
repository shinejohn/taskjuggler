<template>
  <div class="glass-standard rounded-lg overflow-hidden shadow-1">
    <div class="p-6 border-b border-border">
      <h2 class="text-headline font-semibold text-text-primary">Recent Activity</h2>
    </div>
    <div class="p-6">
      <div v-if="loading" class="text-center py-8 text-text-secondary text-body-medium">
        Loading activity...
      </div>
      <div v-else-if="activityData.length === 0" class="text-center py-8 text-text-secondary text-body-medium">
        No recent activity
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="activity in activityData"
          :key="activity.id"
          class="flex items-center p-4 glass-subtle rounded-lg"
        >
          <div :class="`p-2 rounded-md mr-4 ${
            activity.type === 'call' ? 'bg-primary-light' : 'bg-bg-tertiary'
          }`">
            <VideoIcon
              v-if="activity.type === 'call'"
              :size="20"
              class="text-primary"
            />
            <FileIcon
              v-else
              :size="20"
              class="text-text-secondary"
            />
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-body-medium text-text-primary">{{ activity.title }}</h3>
            <p class="text-body-small text-text-secondary">
              {{ activity.date }} {{ activity.duration ? `• ${activity.duration}` : '' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoIcon, FileIcon } from 'lucide-vue-next';

defineProps<{
  loading: boolean;
  activityData: Array<{
    id: number;
    type: 'call' | 'file';
    title: string;
    date: string;
    duration?: string;
  }>;
}>();
</script>

