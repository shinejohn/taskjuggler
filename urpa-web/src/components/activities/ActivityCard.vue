<template>
  <div
    :class="[
      'group relative flex gap-3 rounded-lg border-2 p-3 transition-colors cursor-pointer border-l-4',
      cardBorder,
      cardBg,
      cardHoverBorder,
      cardHoverBg,
      getBorderColor()
    ]"
  >
    <div :class="['mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ring-2', iconBg]">
      <component :is="getIcon()" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <h4 :class="['text-base font-bold truncate pr-4', titleColor]">
          {{ activity.title }}
        </h4>
        <div :class="['flex items-center text-sm font-semibold whitespace-nowrap', timeColor]">
          <Clock class="mr-1 h-4 w-4" />
          {{ activity.time }}
        </div>
      </div>
      <p :class="['mt-1.5 text-sm font-medium line-clamp-2 leading-relaxed', descColor]">
        {{ activity.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Mail, MessageSquare, CheckSquare, Calendar, Share2, Clock } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import type { ActivityItem } from '@/types/activity';

const props = defineProps<{
  activity: ActivityItem;
  index: number;
}>();

const { theme } = useTheme();

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-gray-200');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-gray-400');
const cardHoverBg = computed(() => theme.value === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-300');
const cardHoverBorder = computed(() => theme.value === 'dark' ? 'hover:border-slate-600' : 'hover:border-gray-500');
const iconBg = computed(() => theme.value === 'dark' ? 'bg-slate-700/50 ring-white/10' : 'bg-gray-300 ring-gray-500/20');
const titleColor = computed(() => theme.value === 'dark' ? 'text-slate-200' : 'text-gray-900');
const descColor = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-800');
const timeColor = computed(() => theme.value === 'dark' ? 'text-slate-500' : 'text-gray-700');

function getIcon() {
  switch (props.activity.type) {
    case 'email':
      return Mail;
    case 'text':
      return MessageSquare;
    case 'task':
      return CheckSquare;
    case 'calendar':
      return Calendar;
    case 'social':
      return Share2;
    default:
      return Mail;
  }
}

function getBorderColor() {
  switch (props.activity.type) {
    case 'email':
      return 'border-l-blue-500';
    case 'text':
      return 'border-l-green-500';
    case 'task':
      return 'border-l-amber-500';
    case 'calendar':
      return 'border-l-purple-500';
    case 'social':
      return 'border-l-pink-500';
    default:
      return 'border-l-gray-500';
  }
}
</script>

